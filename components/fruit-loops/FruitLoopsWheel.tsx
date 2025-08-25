// components/fruit-loops/FruitLoopsWheel.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  setFruitLoopsResults,
  setWinKey,
  settleRound,
  startSpinning,
  stopSpinning,
  type ResultItem,
} from "@/redux/features/fruit-loops/fruitLoopsSlice";

import {
  usePlaceLucBetMutation,
  useSettleLucBetMutation,
} from "@/redux/features/game/wheelGameApi";
import toast from "react-hot-toast";
import { Sound } from "./soundManager";

/* ── Types ─────────────────────────────────────────────────────────────── */
type RootState = any;
type Segment = {
  id: number;
  angle: number;
  result: "Apple" | "Watermelon" | "Mango";
  emoji: "🍎" | "🍉" | "🥭";
  multi: number;
};

/* ── Config (keep your artwork & layout) ───────────────────────────────── */
const GAME_KEY = "fruit-loops-6";
const SEGMENTS: Segment[] = [
  { id: 1, angle: 0, result: "Apple", emoji: "🍎", multi: 3 },
  { id: 2, angle: 60, result: "Watermelon", emoji: "🍉", multi: 3 },
  { id: 3, angle: 120, result: "Mango", emoji: "🥭", multi: 3 },
  { id: 4, angle: 180, result: "Apple", emoji: "🍎", multi: 2 },
  { id: 5, angle: 240, result: "Watermelon", emoji: "🍉", multi: 2 },
  { id: 6, angle: 300, result: "Mango", emoji: "🥭", multi: 2 },
];

// pointer points “up”; your wheel PNG is offset ~60deg clockwise → compensate:
const POINTER_ANGLE = 0;
const ASSET_OFFSET = -60; // keep your previous offset
const EPS = 0.001;
const EXTRA_ROUNDS = 10;
const MIN_SPIN_MS = 8000;
const EXTRA_SPIN_MS = 5000;

const norm360 = (v: number) => ((v % 360) + 360) % 360;

/* ── Timing / Easing ────────────────────────────────────────────────────── */
const WOBBLE_1 = 12,
  WOBBLE_2 = 8,
  WOBBLE_3 = 5,
  WOBBLE_4 = 3,
  WOBBLE_STEP = 250;

/* ── Component ─────────────────────────────────────────────────────────── */
export default function FruitLoopsWheel() {
  /* ── State ───────────────────────────────────────────────────────────── */
  const dispatch = useDispatch();
  const { isSpinning, spinId, bets, totalBet, soundOn } = useSelector(
    (s: RootState) => s.fruitLoops
  );

  const [resultText, setResultText] = useState("");
  console.log("ResultText:", resultText);

  /* ── RTK Query mutations ──────────────────────────────────────────────── */
  const [placeLucBet] = usePlaceLucBetMutation();
  const [settleLucBet] = useSettleLucBetMutation();

  // ✅ alias to match the call-sites below
  const placeBet = placeLucBet;
  const settleBet = settleLucBet;

  /* ── CreateJS / Stage refs ───────────────────────────────────────────── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null);
  const createjsRef = useRef<any>(null);
  const roundIdRef = useRef<string | null>(null);

  /* ── Setup Stage (kept your assets & positions) ──────────────────────── */
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
      img.src = "/images/fruit-loops/wheel_1.png"; // ← your wheel sprite
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

      // 60fps ticker
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

  /* ── Spin intent → place-bet → startSpinning ─────────────────────────── */
  useEffect(() => {
    if (spinId === 0) return;
    if (isSpinning) return;
    if (totalBet <= 0) return;

    (async () => {
      // build array-of-objects for backend: [{segmentId, amount}, ...]
      const betArray = Object.entries(bets || {})
        .filter(([, amt]) => Number(amt) > 0)
        .map(([segmentId, amount]) => ({
          segmentId: Number(segmentId),
          amount: Number(amount),
        }));

      if (betArray.length === 0) return;

      const resp = await placeBet({
        gameKey: GAME_KEY,
        bets: betArray,
      }).unwrap();
      roundIdRef.current = resp?.roundId || null;

      if (roundIdRef.current) {
        // only after server accepted the bet:
        dispatch(startSpinning());
      }
    })().catch(() => {
      // keep UI calm on network error; do not start spinning
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId]);

  /* ── Animate + settle when isSpinning ────────────────────────────────── */
  useEffect(() => {
    if (!isSpinning) return;
    if (!wheelRef.current || !createjsRef.current) return;

    const createjs = createjsRef.current;
    const spinTime = Math.floor(Math.random() * EXTRA_SPIN_MS) + MIN_SPIN_MS;

    // client-side visual pick (server payout is authoritative on /settle)
    const pick = SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];

    // rotation plan
    const cur = norm360(wheelRef.current.rotation);
    const target = norm360(pick.angle + ASSET_OFFSET);
    const neededRaw = norm360(POINTER_ANGLE - target - cur);
    const needed = neededRaw === 0 ? EPS : neededRaw;
    const total = wheelRef.current.rotation + EXTRA_ROUNDS * 360 + needed;

    // ✅ স্পিন সাউন্ড অন
    if (soundOn) Sound.play("spin", { volume: 0.8, loop: false });

    /* ── Continuous spin + end wobble ──────────────────────────────────── */
    createjs.Tween.get(wheelRef.current, { override: true })
      .to({ rotation: total }, spinTime, createjs.Ease.quadOut) // একটানা স্মুথ
      // শেষে হেলে-দুলে থামা
      .to({ rotation: total + WOBBLE_1 }, WOBBLE_STEP, createjs.Ease.quadOut)
      .to({ rotation: total - WOBBLE_2 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total + WOBBLE_3 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total - WOBBLE_4 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total }, WOBBLE_STEP, createjs.Ease.quadOut)
      .call(() => {
        // normalize to 0..359
        if (wheelRef.current)
          wheelRef.current.rotation = norm360(wheelRef.current.rotation);

        // ✅ স্পিন সাউন্ড স্টপ
        Sound.stop("spin");

        // Build ResultItem with emoji+multi so reducer can compute payout & fire WinPop
        const res: ResultItem = {
          id: pick.id,
          name: pick.result,
          emoji: pick.emoji,
          angle: wheelRef.current?.rotation ?? 0,
          multi: pick.multi,
        };
        setResultText(`Result: ${res.name} ×${res.multi}`);

        // 6 slices → 3 betting pots (Apple: 1/4 → 1, Watermelon: 2/5 → 2, Mango: 3/6 → 3)
        const winPotId = ((pick.id - 1) % 3) + 1;

        // server settle (authoritative); send finalMulti so BE & FE match
        (async () => {
          try {
            const rId = roundIdRef.current;
            if (rId) {
              await settleBet({
                gameKey: GAME_KEY,
                roundId: rId,
                winningSegmentId: pick.id,
                finalMulti: pick.multi,
              }).unwrap();
            }
            // trigger pot animations & win pop
            dispatch(setFruitLoopsResults([res])); // recentResults log
            dispatch(settleRound({ potId: winPotId, multi: res.multi })); // correct pot id
            dispatch(setWinKey(uuidv4())); // retrigger pot animation
            roundIdRef.current = null;
          } catch {
            // settle failed → stop spin gracefully; reducer won't apply win
          } finally {
            dispatch(stopSpinning());
          }
        })();
      });

    // cleanup safety
    return () => Sound.stop("spin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  /* ── Actions: Spin / Guard no-bet ─────────────────────────────────────── */
  const onSpin = async () => {
    if (totalBet <= 0) {
      toast.error("Place a bet first!");
      setResultText("Place a bet first!");
      return;
    }

    const betArray = Object.entries(bets || {})
      .filter(([, amt]) => Number(amt) > 0)
      .map(([segmentId, amount]) => ({
        segmentId: Number(segmentId),
        amount: Number(amount),
      }));

    try {
      // 1) SERVER: place-bet (ডেবিট + open round)
      const resp = await placeLucBet({
        gameKey: GAME_KEY,
        bets: betArray,
      }).unwrap();
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

  /* ── Render (kept your UI) ───────────────────────────────────────────── */
  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center">
      <div className="relative w-64 h-64">
        {/* Title (kept) */}
        <div className="absolute z-40 top-0">
          <img
            src="/images/fruit-loops/title_5.png"
            alt="Spinning Wheel"
            className="w-full h-full rotate-[360deg] pointer-events-none"
          />
        </div>

        {/* Wheel (canvas) */}
        <div className="absolute -top-[30%]">
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className="w-full h-full"
          />
        </div>

        {/* Pointer (kept) */}
        <img
          src="/images/fruit-loops/arrow.png"
          alt="arrow"
          className="absolute top-[13%] left-[43%] w-10"
        />
      </div>
    </div>
  );
}
