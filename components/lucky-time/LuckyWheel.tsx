// components/lucky-time/Wheel.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */
import {
  usePlaceLucBetMutation,
  useSettleLucBetMutation,
} from "@/redux/features/lucky-time/luckyTimeApi";
import {
  clearSpinBoosts,
  ResultItem,
  setSpinBoosts,
  settleRound,
  setWinKey,
  startSpinning,
} from "@/redux/features/lucky-time/luckyTimeSlice";
import { useEffect, useRef, useState } from "react";
// react-hot-toast optional; remove if you don't use toasts
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

/* ── Types ──────────────────────────────────────────────────────────────── */
export type RootState = any;
type BoardItem = {
  id: number;
  result: string;
  multi: number;
  emoji: string;
  angle: number;
};

/* ── Config (segments) ──────────────────────────────────────────────────── */
export const SEGMENTS: BoardItem[] = [
  { id: 1, multi: 10, emoji: "C", result: "c", angle: 0 },
  { id: 2, multi: 10, emoji: "K", result: "k", angle: 30 },
  { id: 3, multi: 10, emoji: "Y", result: "y", angle: 60 },
  { id: 4, multi: 1, emoji: "0", result: "0", angle: 90 },
  { id: 5, multi: 2, emoji: "1️⃣", result: "1", angle: 120 },
  { id: 6, multi: 3, emoji: "2️⃣", result: "2", angle: 150 },
  { id: 7, multi: 4, emoji: "3️⃣", result: "3", angle: 180 },
  { id: 8, multi: 5, emoji: "5️⃣", result: "5", angle: 210 },
  { id: 9, multi: 10, emoji: "🔟", result: "10", angle: 240 },
  { id: 10, multi: 1, emoji: "0️⃣", result: "0", angle: 270 },
  { id: 11, multi: 2, emoji: "L", result: "l", angle: 300 },
  { id: 12, multi: 10, emoji: "U", result: "u", angle: 330 },
];

const GAME_KEY = "lucky-time";
const POINTER_ANGLE = 0;
const ASSET_OFFSET = 0; // adjust if your PNG is pre-rotated
const EPS = 0.001;
const EXTRA_ROUNDS = 10;

/* ── Timing / Easing ────────────────────────────────────────────────────── */
const WOBBLE_1 = 12,
  WOBBLE_2 = 8,
  WOBBLE_3 = 5,
  WOBBLE_4 = 3,
  WOBBLE_STEP = 250;
const MIN_SPIN_MS = 8000,
  EXTRA_SPIN_MS = 5000;

/* ── Helpers: RNG / math / probabilities ───────────────────────────────── */
const sumInv = (arr: BoardItem[]) => arr.reduce((a, s) => a + 1 / s.multi, 0);
const S = sumInv(SEGMENTS);
const RTP = 1 / S; // for debugging
const PROBS = SEGMENTS.map((s) => 1 / s.multi / S);

const cryptoRand = () => {
  try {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] / 2 ** 32;
  } catch {
    return Math.random();
  }
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

/* ── Visual boosts (optional) ───────────────────────────────────────────── */
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

/* ── Component ──────────────────────────────────────────────────────────── */
export default function Wheel() {
  /* ── State (redux & locals) ──────────────────────────────────────────── */
  const dispatch = useDispatch();
  const { isSpinning, totalBet, activeBoosts, bets, spinId } = useSelector(
    (s: RootState) => s.luckyTime
  );

  const [placeLucBet, { isLoading: placing }] = usePlaceLucBetMutation();
  const [settleLucBet, { isLoading: settling }] = useSettleLucBetMutation();

  const roundIdRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null);
  const createjsRef = useRef<any>(null);

  const [resultText, setResultText] = useState<string | null>(null); // debug

  /* ── Effects: CreateJS setup ─────────────────────────────────────────── */
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
      img.src = "/images/lucky-time/lucky-time-wheel.png";
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

  /* ── Effects: spinId → place-bet → startSpinning ─────────────────────── */
  useEffect(() => {
    if (spinId === 0) return;
    if (isSpinning) return;
    if (totalBet <= 0) return;
    onSpin().catch(() => void 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId]);

  /* ── Effects: animation when isSpinning ──────────────────────────────── */
  useEffect(() => {
    if (!isSpinning) return;
    if (!wheelRef.current || !createjsRef.current) return;

    const createjs = createjsRef.current;
    setResultText(null);

    // spawn visual boosts
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

    // timing & random pick (client-side visual)
    const spinTime = Math.floor(Math.random() * EXTRA_SPIN_MS) + MIN_SPIN_MS;
    const pick = weightedPick(SEGMENTS, PROBS);

    // rotation plan
    const cur = norm360(wheelRef.current.rotation);
    const target = norm360(pick.angle + ASSET_OFFSET);
    const neededRaw = norm360(POINTER_ANGLE - target - cur);
    const needed = neededRaw === 0 ? EPS : neededRaw;
    const total = wheelRef.current.rotation + EXTRA_ROUNDS * 360 + needed;

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

        // apply visual boost on client payout (UI only; server stays source of truth)
        const b = activeBoosts.find((x: any) => x.itemId === pick.id);
        const finalMulti = b ? pick.multi * b.value : pick.multi;

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
        // console.log(`[RTP≈${(RTP * 100).toFixed(1)}%] sumInv=${S.toFixed(4)} pick=`, res);

        // settle on server then update local state
        (async () => {
          try {
            const roundId = roundIdRef.current;
            if (!roundId) {
              toast.error?.("No round to settle");
            } else {
              await settleLucBet({
                gameKey: GAME_KEY,
                roundId,
                winningSegmentId: pick.id,
                finalMulti,
              }).unwrap();
            }
            dispatch(settleRound(res));
            dispatch(setWinKey(uuidv4()));
            dispatch(clearSpinBoosts());
            roundIdRef.current = null;
          } catch (e: any) {
            toast.error?.(e?.data?.message ?? "Settle failed");
          }
        })();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const onSpin = async () => {
    if (totalBet <= 0) {
      toast.error?.("Place a bet first!");
      setResultText("Place a bet first!");
      return;
    }

    // build BetInput[] for backend
    const betArray = Object.entries(bets || {})
      .filter(([, amt]) => Number(amt) > 0)
      .map(([segmentId, amount]) => ({
        segmentId: Number(segmentId),
        amount: Number(amount),
      }));

    if (!betArray.length) {
      toast.error?.("No bets to place");
      return;
    }

    try {
      const resp = await placeLucBet({
        gameKey: GAME_KEY,
        bets: betArray,
      }).unwrap();
      roundIdRef.current = resp?.roundId;
      if (!roundIdRef.current) {
        toast.error?.("Failed to open round");
        return;
      }
      // only after server accepts bet
      dispatch(startSpinning());
    } catch (e: any) {
      toast.error?.(e?.data?.message ?? "Bet failed");
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center">
      <div className="relative w-72 h-72">
        <canvas
          ref={canvasRef}
          width={288}
          height={288}
          className="w-full h-full"
        />
        <img
          src="/images/lucky-time/frame.png"
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <img
          src="/images/lucky-time/pin.png"
          alt="pointer"
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 pointer-events-none z-10"
        />
        <img
          src="/images/lucky-time/lucky-time-middle.png"
          alt="middle"
          className="absolute top-1/2 left-1/2 w-[33%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
      </div>
      {/* Debug: <p className="mt-2 text-sm text-white/80">{resultText ?? " "}</p> */}
    </div>
  );
}

/* ── Exports ───────────────────────────────────────────────────────────── */
// Default export above; keep named export for segments
