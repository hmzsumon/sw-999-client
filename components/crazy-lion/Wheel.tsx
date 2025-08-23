// components/lucky-time/Wheel.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */

import {
  usePlaceLucBetMutation,
  useSettleLucBetMutation,
} from "@/redux/features/crazy-lion/crazyLionApi";
import {
  clearSpinBoosts,
  ResultItem,
  setSpinBoosts,
  settleRound,
  setWinKey,
  startSpinning,
} from "@/redux/features/crazy-lion/crazyLionSlice";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdLockReset } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import CircleIconButton from "../fruit-loops/CircleIconButton";
import RulesBtn from "../fruit-loops/RulesBtn";

/* ── Types/Board ────────────────────────────────────────────────────────── */
export type RootState = any;
type BoardItem = {
  id: number;
  result: string;
  multi: number;
  emoji: string;
  dig: number;
};

/* ── SEGMENTS (Equal-EV ভিত্তি; RTP = 1 / Σ(1/multi)) ───────────────────── */
export const SEGMENTS: BoardItem[] = [
  { id: 1, multi: 2.5, emoji: "🦁", result: "Lion", dig: 0 },
  { id: 2, multi: 2, emoji: "🐯", result: "Tiger", dig: 30 },
  { id: 3, multi: 2.5, emoji: "🐘", result: "Elephant", dig: 60 },
  { id: 4, multi: 2, emoji: "🐻", result: "Bear", dig: 90 },
  { id: 5, multi: 4, emoji: "🐴", result: "Horse", dig: 120 },
  { id: 6, multi: 4, emoji: "🦊", result: "Fox", dig: 150 },
  { id: 7, multi: 5, emoji: "🐰", result: "Rabbit", dig: 180 },
  { id: 8, multi: 3, emoji: "🐺", result: "Wolf", dig: 210 },
  { id: 9, multi: 5.5, emoji: "🐒", result: "Monkey", dig: 240 },
  { id: 10, multi: 3, emoji: "🐄", result: "Cow", dig: 270 },
  { id: 11, multi: 2, emoji: "🐖", result: "Pig", dig: 300 },
  { id: 12, multi: 3, emoji: "🐆", result: "Leopard", dig: 330 },
];

const POINTER_ANGLE = 0;
const ASSET_OFFSET = -30;
const EPS = 0.001;
const EXTRA_ROUNDS = 10;

/* ── Wobble/Timing ─────────────────────────────────────────────────────── */
const WOBBLE_1 = 12,
  WOBBLE_2 = 8,
  WOBBLE_3 = 5,
  WOBBLE_4 = 3,
  WOBBLE_STEP = 250;
const MIN_SPIN_MS = 8000,
  EXTRA_SPIN_MS = 5000;

/* ── Equal-EV weighting (RTP = 1/Σ1/m) ─────────────────────────────────── */
const sumInv = (arr: BoardItem[]) => arr.reduce((a, s) => a + 1 / s.multi, 0);
const S = sumInv(SEGMENTS); // তোমার বর্তমান multis-এ ≈ 4.1818
const RTP = 1 / S; // ≈ 0.239 (≈ 23.9% RTP)
const PROBS = SEGMENTS.map((s) => 1 / s.multi / S);

/* ── Helpers ───────────────────────────────────────────────────────────── */
const cryptoRand = () => {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] / 2 ** 32;
  }
  return Math.random();
};
function weightedPick<T>(arr: T[], probs: number[], rnd = cryptoRand): T {
  let r = rnd();
  for (let i = 0; i < arr.length; i++) {
    r -= probs[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}
const norm360 = (v: number) => ((v % 360) + 360) % 360;

/* ── Boosts (visual) ───────────────────────────────────────────────────── */
const BOOST_VALUES = [
  { v: 5, w: 45 },
  { v: 10, w: 35 },
  { v: 15, w: 15 },
  { v: 50, w: 4 },
  { v: 80, w: 1 },
] as const;
const BOOST_LIFETIME_MS = 6000;
const pickWeightedBoost = () => {
  const total = BOOST_VALUES.reduce((a, b) => a + b.w, 0);
  let r = Math.random() * total;
  for (const { v, w } of BOOST_VALUES) {
    r -= w;
    if (r <= 0) return v;
  }
  return BOOST_VALUES[BOOST_VALUES.length - 1].v;
};
const pickDistinctIds = (n: number, ids: number[]) =>
  ids
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, n);

/* ──Start Wheel Component ───────────────────────────────────────────────── */
export default function Wheel() {
  const dispatch = useDispatch();
  const { isSpinning, totalBet, activeBoosts, balance, bets } = useSelector(
    (s: RootState) => s.crazyLion
  );

  /* ── RTK Query mutations ──────────────────────────────────────────────── */
  const [placeLucBet, { isLoading: placing }] = usePlaceLucBetMutation();
  const [settleLucBet, { isLoading: settling }] = useSettleLucBetMutation();

  // সার্ভার ওপেন করা রাউন্ড আইডি
  const roundIdRef = useRef<string | null>(null);

  /* ── CreateJS setup ──────────────────────────────────────────────────── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null);
  const createjsRef = useRef<any>(null);

  const [resultText, setResultText] = useState<string | null>(null);

  useEffect(() => {
    let cleanupTicker: (() => void) | null = null;
    let destroyed = false;

    (async () => {
      const mod: any = await import("createjs-module");
      const createjs = mod?.default ?? mod;
      createjsRef.current = createjs;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const stage = new createjs.Stage(canvas);
      stageRef.current = stage;

      const img = new Image();
      img.src = "/images/crazy-lion/wheel1.png"; // ❗️12-slice PNG; আর্ট মিল না হলে বদলাও
      img.onload = () => {
        if (destroyed) return;
        const bmp = new createjs.Bitmap(img);
        bmp.regX = img.width / 2;
        bmp.regY = img.height / 2;

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        bmp.scaleX = scale;
        bmp.scaleY = scale;
        bmp.x = canvas.width / 2;
        bmp.y = canvas.height / 2;
        bmp.rotation = 0;

        wheelRef.current = bmp;
        stage.addChild(bmp);
        stage.update();
      };

      createjs.Ticker.framerate = 60;
      const tick = () => stage.update();
      createjs.Ticker.addEventListener("tick", tick);
      cleanupTicker = () => createjs.Ticker.removeEventListener("tick", tick);
    })();

    return () => {
      destroyed = true;
      cleanupTicker?.();
      stageRef.current?.removeAllChildren();
      stageRef.current?.update();
      stageRef.current = null;
      wheelRef.current = null;
    };
  }, []);

  /* ── Spin: when isSpinning true ──────────────────────────────────────── */
  useEffect(() => {
    if (!isSpinning) return;
    if (!wheelRef.current || !createjsRef.current) return;

    const createjs = createjsRef.current;
    setResultText(null);

    // 1) এই স্পিনের জন্য ভিজ্যুয়াল বুস্ট স্পন
    const count = Math.floor(Math.random() * 3) + 2; // 2..4
    const ids = pickDistinctIds(
      count,
      SEGMENTS.map((s) => s.id)
    );
    const now = Date.now();
    dispatch(
      setSpinBoosts(
        ids.map((id) => ({
          id: uuidv4(),
          itemId: id,
          value: pickWeightedBoost(),
          expiresAt: now + BOOST_LIFETIME_MS,
        }))
      )
    );

    // 2) টাইমিং + equal-EV pick
    const spinTime = Math.floor(Math.random() * EXTRA_SPIN_MS) + MIN_SPIN_MS;
    const pick = weightedPick(SEGMENTS, PROBS);

    // 3) রোটেশন ক্যালক
    const cur = norm360(wheelRef.current.rotation);
    const target = norm360(pick.dig + ASSET_OFFSET);
    const neededRaw = norm360(POINTER_ANGLE - target - cur);
    const needed = neededRaw === 0 ? EPS : neededRaw;
    const total = wheelRef.current.rotation + EXTRA_ROUNDS * 360 + needed;

    // 4) অ্যানিমেশন
    createjs.Tween.get(wheelRef.current, { override: true })
      .to({ rotation: total }, spinTime, createjs.Ease.quadOut)
      .to({ rotation: total + WOBBLE_1 }, WOBBLE_STEP, createjs.Ease.quadOut)
      .to({ rotation: total - WOBBLE_2 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total + WOBBLE_3 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total - WOBBLE_4 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total }, WOBBLE_STEP, createjs.Ease.quadOut)
      .call(() => {
        // normalize
        if (wheelRef.current)
          wheelRef.current.rotation = norm360(wheelRef.current.rotation);
        const finalAngle = wheelRef.current?.rotation ?? 0;

        // 5) বুস্ট অ্যাপ্লাই
        const b = activeBoosts.find((x: any) => x.itemId === pick.id);
        const finalMulti = b ? pick.multi * b.value : pick.multi;

        // 6) লোকাল রেজাল্ট অবজেক্ট
        const res: ResultItem = {
          id: pick.id,
          name: pick.result,
          emoji: pick.emoji,
          angle: finalAngle,
          multi: finalMulti,
        };

        setResultText(
          `Result: ${res.name} ×${res.multi}${b ? ` (boost ×${b.value})` : ""}`
        );
        console.log(
          `[RTP≈${(RTP * 100).toFixed(1)}%] sumInv=${S.toFixed(4)} pick=`,
          res
        );

        // 7) SERVER: settle (roundId + outcome পাঠানো) → তারপর লোকাল settle
        (async () => {
          try {
            const roundId = roundIdRef.current;
            if (!roundId) {
              toast.error("No round to settle");
            } else {
              await settleLucBet({
                roundId,
                outcome: {
                  segmentId: pick.id,
                  finalMulti,
                  angle: finalAngle,
                },
              }).unwrap();
            }

            // LOCAL: UI/state আপডেট — balance/হিস্ট্রি/clear bets
            dispatch(settleRound(res));
            dispatch(setWinKey(uuidv4()));
            dispatch(clearSpinBoosts());
            roundIdRef.current = null;
          } catch (e: any) {
            toast.error(e?.data?.message ?? "Settle failed");
            // fallback: লোকাল স্টেট তবুও সেটেল করতে চাইলে নিচের লাইন অন/অফ করো
            // dispatch(settleRound(res));
          }
        })();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  /* ── Actions: Spin / Guard no-bet ─────────────────────────────────────── */
  const onSpin = async () => {
    if (totalBet <= 0) {
      toast.error("Place a bet first!");
      setResultText("Place a bet first!");
      return;
    }

    // bets → server payload: { "1": 50, "7": 30, ... }
    const payloadBets = Object.fromEntries(
      Object.entries(bets || {}).filter(([, amt]) => (amt as number) > 0)
    );

    try {
      // 1) SERVER: place-bet (ডেবিট + open round)
      const resp = await placeLucBet({ bets: payloadBets }).unwrap();
      roundIdRef.current = resp?.roundId;

      if (!roundIdRef.current) {
        toast.error("Failed to open round");
        return;
      }

      // 2) এখন স্পিন শুরু
      dispatch(startSpinning());
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Bet failed");
    }
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center">
      {/* Wheel canvas + chrome */}
      <div className="relative w-72 h-72">
        <canvas
          ref={canvasRef}
          width={288}
          height={288}
          className="w-full h-full"
        />
        <img
          src="/images/crazy-lion/frame_3.png"
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <img
          src="/images/crazy-lion/pin.png"
          alt="pointer"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-10"
        />
        <img
          src="/images/crazy-lion/middle_wheel.png"
          alt="middle"
          className="absolute top-1/2 left-1/2 w-[33%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
      </div>

      {/* status (debug) */}
      {/* <p className="mt-2 text-sm text-white/80">{resultText ?? " "}</p> */}

      {/* Controls */}
      <div className="my-2 flex items-center gap-3">
        <RulesBtn
          size="lg"
          label={totalBet > 0 ? totalBet : "PLACE BET"}
          colors={{ start: "#4a3b14", mid: "#614d1a", end: "#9a7b29" }}
          onClick={() => {
            // note: clearBets reducer refunds the stake to balance
            // import ছাড়াই plain action type দিয়েই ডিসপ্যাচ করা হয়েছে:
            (dispatch as any)({ type: "crazyLion/clearBets" });
          }}
        />

        <CircleIconButton
          size={48}
          icon={
            <span className="font-extrabold" style={{ fontSize: 22 }}>
              <MdLockReset />
            </span>
          }
          colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          onClick={() => {
            // একই clearBets
            (dispatch as any)({ type: "crazyLion/clearBets" });
          }}
        />

        <RulesBtn
          size="lg"
          label={
            placing ? "PLACING…" : settling || isSpinning ? "SPINNING…" : "SPIN"
          }
          disabled={placing || settling || isSpinning}
          colors={{ start: "#0d5c3a", mid: "#0a4c30", end: "#1fa36a" }}
          onClick={onSpin}
        />
      </div>
    </div>
  );
}
