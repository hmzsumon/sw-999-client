"use client";
import { defaultItems } from "@/components/lucky-time/LuckyTimeBoard";
import {
  ResultItem,
  setLuckyTimeResults,
  setWinKey,
  stopSpinning,
} from "@/redux/features/lucky-time/luckyTimeSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const SEGMENTS = 12;
const STEP = 360 / SEGMENTS;

// helpers
const norm360 = (deg: number) => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

const ASSET_OFFSET_DEG = 0;

const EXTRA_ROUNDS = 10; // 5×360°

export default function Wheel() {
  const dispatch = useDispatch();
  // 🔽 Redux state
  const { isSpinning, spinId, durationMs, forceIndex } = useSelector(
    (s: any) => s.luckyTime
  );

  const [duration, setDuration] = useState(6000);
  const [result, setResult] = useState<string | null>(null);
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

        // pivot center
        bmp.regX = img.width / 2;
        bmp.regY = img.height / 2;

        // scale to canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        bmp.scaleX = scale;
        bmp.scaleY = scale;

        // center
        bmp.x = canvas.width / 2;
        bmp.y = canvas.height / 2;
        bmp.rotation = 0;

        wheelRef.current = bmp;
        stage.addChild(bmp);
        stage.update();
      };

      // ticker
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

  // Spin the wheel
  useEffect(() => {
    if (!isSpinning) return;
    const createjs = createjsRef.current;
    const wheel = wheelRef.current;
    if (!createjs || !wheel) return;

    const spinTime = Math.floor(Math.random() * 4000) + 4000; // 4–8s
    setDuration(spinTime);
    setResult(null);

    const chosen = Math.floor(Math.random() * SEGMENTS);

    // টপে আনতে হবে: slotCenter = chosen*STEP + ASSET_OFFSET_DEG
    const targetTop = norm360(chosen * STEP + ASSET_OFFSET_DEG);

    // finalRotation ≡ 360 - targetTop (mod 360)
    const cur = norm360(wheel.rotation);
    const targetRotMod = norm360(360 - targetTop);
    const delta = norm360(targetRotMod - cur);

    const totalRotation = wheel.rotation + EXTRA_ROUNDS * 360 + delta;

    createjs.Tween.get(wheel, { override: true })
      .to({ rotation: totalRotation }, spinTime, createjs.Ease.cubicOut)
      .call(() => {
        wheel.rotation = norm360(wheel.rotation);
        setRotationDbg(wheel.rotation);

        const slot = readSlotFromRotation(wheel.rotation);

        const result = defaultItems.filter(
          (item) => item.dig === wheel.rotation
        )[0];
        const NewResult: ResultItem = {
          id: result.id,
          name: result.name ?? "Unknown",
          emoji: result.emoji, // 0..11
          angle: norm360(wheel.rotation), // final angle
          multi: result.multi, // ensure numeric
        };

        dispatch(setLuckyTimeResults([NewResult]));
        dispatch(stopSpinning());
        dispatch(setWinKey(uuidv4()));
      });
  }, [isSpinning]);

  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center">
      <div className="relative w-72 h-72">
        {/* Wheel (CreateJS Canvas) */}
        <canvas
          ref={canvasRef}
          width={288}
          height={288}
          className="w-full h-full"
        />

        {/* Frame (unchanged) */}
        <img
          src="/images/lucky-time/frame_3.png"
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Pointer (unchanged) */}
        <img
          src="/images/lucky-time/pin.png"
          alt="pointer"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-10"
        />

        {/* Middle (unchanged) */}
        <img
          src="/images/lucky-time/middle_wheel.png"
          alt="middle"
          className="absolute top-1/2 left-1/2 w-[33%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
      </div>
    </div>
  );
}
