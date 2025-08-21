// components/lucky-time/Wheel.tsx
"use client";
import {
  ResultItem,
  setLuckyTimeResults,
  setWinKey,
  stopSpinning,
} from "@/redux/features/lucky-time/luckyTimeSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { defaultItems } from "./LuckyTimeBoard";

const SEGMENTS = 12;
const STEP = 360 / SEGMENTS;

// ---------------------- Weighted config ----------------------
// ছোট মাল্টি বেশি ওজন, বড় মাল্টি খুব কম ওজন
// চাইলে সংখ্যা গুলো টিউন করুন।
const MULTI_WEIGHTS: Record<number, number> = {
  1.5: 12,
  2: 10,
  3: 8,
  4: 7,
  5: 6,
  10: 4,
  50: 2,
  100: 1.5,
  150: 0.8,
  200: 0.5,
  300: 0.3,
};

// ওজন বের করা (ম্যাপে না থাকলে 1 ধরা)
const weightOf = (multi: number) => MULTI_WEIGHTS[multi] ?? 1;

// weighted pick (ইনডেক্স রিটার্ন করে)
function pickWeightedIndex<T>(arr: T[], getWeight: (t: T) => number): number {
  const weights = arr.map(getWeight);
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return Math.floor(Math.random() * arr.length);

  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < arr.length; i++) {
    acc += weights[i];
    if (r <= acc) return i;
  }
  return arr.length - 1;
}
// -------------------------------------------------------------

// helpers
const norm360 = (deg: number) => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

const ASSET_OFFSET_DEG = 0;
const EXTRA_ROUNDS = 10;

export default function Wheel() {
  const dispatch = useDispatch();
  const { isSpinning, spinId, durationMs, forceIndex } = useSelector(
    (s: any) => s.luckyTime
  );

  const [duration, setDuration] = useState(6000);
  const [rotationDbg, setRotationDbg] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null);
  const createjsRef = useRef<any>(null);

  // CreateJS setup
  useEffect(() => {
    let cleanup: (() => void) | null = null;
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
      img.src = "/images/lucky-time/lucky_time_wheel1.png";
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
      cleanup = () => createjs.Ticker.removeEventListener("tick", tick);
    })();

    return () => {
      destroyed = true;
      cleanup?.();
      if (stageRef.current) {
        stageRef.current.removeAllChildren();
        stageRef.current.update();
      }
      stageRef.current = null;
      wheelRef.current = null;
    };
  }, []);

  const readSlotFromRotation = (finalRotationDeg: number) => {
    const topAngle = norm360(360 - norm360(finalRotationDeg));
    const slotFloat = norm360(topAngle - ASSET_OFFSET_DEG) / STEP;
    const slot = Math.round(slotFloat) % SEGMENTS;
    return slot;
  };

  // Spin the wheel (Redux isSpinning true হলে)
  useEffect(() => {
    if (!isSpinning) return;
    const createjs = createjsRef.current;
    const wheel = wheelRef.current;
    if (!createjs || !wheel) return;

    const spinTime = Math.floor(Math.random() * 4000) + 4000; // 4–8s
    setDuration(spinTime);

    // ✅ forced হলে সেটাই নিব, নাহলে weighted pick
    const chosen =
      typeof forceIndex === "number" && forceIndex >= 0 && forceIndex < SEGMENTS
        ? forceIndex
        : pickWeightedIndex(defaultItems, (it) => weightOf(it.multi));

    // target angle calc
    const targetTop = norm360(chosen * STEP + ASSET_OFFSET_DEG);
    const cur = norm360(wheel.rotation);
    const targetRotMod = norm360(360 - targetTop);
    const delta = norm360(targetRotMod - cur);
    const totalRotation = wheel.rotation + EXTRA_ROUNDS * 360 + delta;

    createjs.Tween.get(wheel, { override: true })
      .to({ rotation: totalRotation }, spinTime, createjs.Ease.cubicOut)
      .call(() => {
        wheel.rotation = norm360(wheel.rotation);
        setRotationDbg(wheel.rotation);

        // গ্রাউন্ড ট্রুথ হিসেবে ফাইনাল রোটেশন থেকে slot পড়া
        const slot = readSlotFromRotation(wheel.rotation);
        const base = defaultItems[slot];

        const NewResult: ResultItem = {
          id: base.id,
          name: base.name ?? "Unknown",
          emoji: base.emoji,

          angle: wheel.rotation,
          multi: base.multi,
        };

        // আপনার slice অনুযায়ী: যদি setLuckyTimeResults পুরো লিস্ট replace করে,
        // তাহলে prepend করার জন্য আগের লিস্টও লাগবে। অনেকেই এখানে addLuckyTimeResult ব্যবহার করেন।
        // আপাতত আপনার স্ট্রাকচার ধরে একটি মাত্র এন্ট্রি সেট করলাম:
        dispatch(setLuckyTimeResults([NewResult]));

        dispatch(stopSpinning());
        dispatch(setWinKey(uuidv4()));
      });
  }, [isSpinning, forceIndex]);

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
          src="/images/lucky-time/frame_3.png"
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <img
          src="/images/lucky-time/pin.png"
          alt="pointer"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-10"
        />
        <img
          src="/images/lucky-time/middle_wheel.png"
          alt="middle"
          className="absolute top-1/2 left-1/2 w-[33%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
      </div>
    </div>
  );
}
