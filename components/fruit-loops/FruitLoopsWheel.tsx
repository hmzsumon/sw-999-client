// components/fruit-loops/FruitLoopsWheel.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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

import { placeBetAndHold, settleAndPayout } from "@/redux/features/bet/betFlow";
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

/* ── Config (artwork/layout) ───────────────────────────────────────────── */
const GAME_KEY = "fruit-loops-6";
const SEGMENTS: Segment[] = [
  { id: 1, angle: 0, result: "Apple", emoji: "🍎", multi: 2.9 },
  { id: 2, angle: 60, result: "Watermelon", emoji: "🍉", multi: 2.9 },
  { id: 3, angle: 120, result: "Mango", emoji: "🥭", multi: 2.9 },
  { id: 4, angle: 180, result: "Apple", emoji: "🍎", multi: 2.9 },
  { id: 5, angle: 240, result: "Watermelon", emoji: "🍉", multi: 2.9 },
  { id: 6, angle: 300, result: "Mango", emoji: "🥭", multi: 2.9 },
];

// pointer points “up”; your wheel PNG is offset ~60deg clockwise → compensate:
const POINTER_ANGLE = 0;
const ASSET_OFFSET = -60;
const EPS = 0.001;
const EXTRA_ROUNDS = 10;
const MIN_SPIN_MS = 8000;
const EXTRA_SPIN_MS = 5000;
const LOSE_DELAY_MS = 350;

const norm360 = (v: number) => ((v % 360) + 360) % 360;

/* ── Ending wobble ─────────────────────────────────────────────────────── */
const WOBBLE_1 = 12,
  WOBBLE_2 = 8,
  WOBBLE_3 = 5,
  WOBBLE_4 = 3,
  WOBBLE_STEP = 250;

/* ── Component ─────────────────────────────────────────────────────────── */
export default function FruitLoopsWheel() {
  const dispatch = useDispatch();
  const { isSpinning, spinId, bets, totalBet, soundOn } = useSelector(
    (s: RootState) => s.fruitLoops
  );

  const [resultText, setResultText] = useState("");

  /* ── CreateJS / Stage refs ───────────────────────────────────────────── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null);
  const createjsRef = useRef<any>(null);
  const roundIdRef = useRef<string | null>(null);

  /* ── Setup Stage (assets & positions) ────────────────────────────────── */
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
      img.src = "/images/fruit-loops/wheel_1.png";
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

  /* ── Spin intent → wallet.placeBetAndHold → startSpinning ────────────── */
  useEffect(() => {
    if (spinId === 0) return;
    if (isSpinning) return;
    if (totalBet <= 0) return;

    (async () => {
      // bets → array
      const betArray = Object.entries(bets || {})
        .filter(([, amt]) => Number(amt) > 0)
        .map(([segmentId, amount]) => ({
          segmentId: Number(segmentId),
          amount: Number(amount),
        }));

      if (!betArray.length) return;

      try {
        const { roundId } = await (dispatch as any)(
          placeBetAndHold({
            gameKey: GAME_KEY,
            bets: betArray,
            totalStake: Number(totalBet) || 0,
          })
        );

        roundIdRef.current = roundId;
        dispatch(startSpinning());
      } catch (err: any) {
        toast.error(err?.message ?? "Bet failed");
      }
    })();
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

    if (soundOn) Sound.play("spin", { volume: 0.08 });

    createjs.Tween.get(wheelRef.current, { override: true })
      .to({ rotation: total }, spinTime, createjs.Ease.quadOut)
      .to({ rotation: total + WOBBLE_1 }, WOBBLE_STEP, createjs.Ease.quadOut)
      .to({ rotation: total - WOBBLE_2 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total + WOBBLE_3 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total - WOBBLE_4 }, WOBBLE_STEP, createjs.Ease.quadInOut)
      .to({ rotation: total }, WOBBLE_STEP, createjs.Ease.quadOut)
      .call(() => {
        if (wheelRef.current)
          wheelRef.current.rotation = norm360(wheelRef.current.rotation);

        Sound.stop("spin");

        // Result object for UI
        const res: ResultItem = {
          id: pick.id,
          name: pick.result,
          emoji: pick.emoji,
          angle: wheelRef.current?.rotation ?? 0,
          multi: pick.multi,
        };
        setResultText(`Result: ${res.name} ×${res.multi}`);

        // 6 slices → 3 betting pots (1/4→1, 2/5→2, 3/6→3)
        const winPotId = ((pick.id - 1) % 3) + 1;

        // local stake on that pot (just to infer loss sound)
        const stakeHere =
          Number((bets as any)?.[String(winPotId)]) ||
          Number((bets as any)?.[winPotId]) ||
          0;
        const isLoss = Math.floor(stakeHere * pick.multi) <= 0;

        (async () => {
          try {
            const rId = roundIdRef.current;
            if (rId) {
              await (dispatch as any)(
                settleAndPayout({
                  gameKey: GAME_KEY,
                  roundId: rId,
                  winningSegmentId: pick.id,
                  finalMulti: pick.multi,
                })
              );
            }

            // trigger pot animations & win pop
            dispatch(setFruitLoopsResults([res]));
            dispatch(settleRound({ potId: winPotId, multi: res.multi }));
            dispatch(setWinKey(uuidv4()));
            roundIdRef.current = null;
          } catch {
            // ignore; UI calm
          } finally {
            dispatch(stopSpinning());
            if (soundOn && isLoss)
              setTimeout(() => Sound.play("lose"), LOSE_DELAY_MS);
          }
        })();
      });

    return () => Sound.stop("spin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

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
