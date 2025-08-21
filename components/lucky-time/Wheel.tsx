"use client";
import {
  setLuckyTimeResults,
  startSpinning,
  stopSpinning,
} from "@/redux/features/lucky-time/luckyTimeSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SEGMENTS = 12;
const STEP = 360 / SEGMENTS;

const ANIMALS = [
  "🐯 Tiger",
  "🦁 Lion",
  "🐆 Leopard",
  "🐖 Pig",
  "🐄 Cow",
  "🐒 Monkey",
  "🐺 Wolf",
  "🐰 Rabbit",
  "🦊 Fox",
  "🐴 Horse",
  "🐻 Bear",
  "🐘 Elephant",
];
const boardItems = [
  {
    id: 1,
    multi: "x 200",
    emoji: "🐯",
  },
  {
    id: 2,
    multi: "x 300",
    emoji: "🦁",
  },
  {
    id: 3,
    multi: "x 50",
    emoji: "🐆",
  },
  {
    id: 4,
    multi: "x 2",
    emoji: "🐖",
    dig: 90,
  },
  {
    id: 5,
    multi: "x 2",
    emoji: "🐄",
  },
  {
    id: 6,
    multi: "x 2",
    emoji: "🐒",
  },
  {
    id: 7,
    multi: "x 10",
    emoji: "🐺",
  },
  {
    id: 8,
    multi: "x 5",
    emoji: "🐰",
    dig: 210,
  },
  {
    id: 9,
    multi: "x 3",
    emoji: "🦊",
    dig: 240,
  },
  {
    id: 10,
    multi: "x 50",
    emoji: "🐴",
  },
  {
    id: 11,
    multi: "x 100",
    emoji: "🐻",
  },
  {
    id: 12,
    multi: "x 500",
    emoji: "🐘",
  },
];

const newArray = [
  {
    name: "Tiger",
    emoji: "🐯",
    dig: 0,
  },
  {
    name: "Lion",
    emoji: "🦁",
    dig: 30,
  },
  {
    name: "Leopard",
    emoji: "🐆",
    dig: 60,
  },
  {
    name: "Pig",
    emoji: "🐖",
    dig: 90,
  },
  {
    name: "Cow",
    emoji: "🐄",
    dig: 120,
  },
  {
    name: "Monkey",
    emoji: "🐒",
    dig: 150,
  },
  {
    name: "Wolf",
    emoji: "🐺",
    dig: 180,
  },
  {
    name: "Rabbit",
    emoji: "🐰",
    dig: 210,
  },
  {
    name: "Fox",
    emoji: "🦊",
    dig: 240,
  },
  {
    name: "Horse",
    emoji: "🐴",
    dig: 270,
  },
  {
    name: "Bear",
    emoji: "🐻",
    dig: 300,
  },
  {
    name: "Elephant",
    emoji: "🐘",
    dig: 330,
  },
];

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
  console.log("Result:", result);
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

  // স্পিন
  const runSpin = useCallback(
    (spinDuration: number, forced?: number | null) => {
      const createjs = createjsRef.current;
      const wheel = wheelRef.current;
      if (!createjs || !wheel) return;

      dispatch(startSpinning());

      const chosen =
        typeof forced === "number" && forced >= 0 && forced < SEGMENTS
          ? forced
          : Math.floor(Math.random() * SEGMENTS);

      const targetTop = norm360(chosen * STEP + ASSET_OFFSET_DEG);
      const cur = norm360(wheel.rotation);
      const targetRotMod = norm360(360 - targetTop);
      const delta = norm360(targetRotMod - cur);
      const totalRotation = wheel.rotation + EXTRA_ROUNDS * 360 + delta;

      createjs.Tween.get(wheel, { override: true })
        .to({ rotation: totalRotation }, spinDuration, createjs.Ease.cubicOut)
        .call(() => {
          wheel.rotation = norm360(wheel.rotation);
          setRotationDbg(wheel.rotation);

          const slot = readSlotFromRotation(wheel.rotation);
          const item = newArray[slot];
          const payload = {
            slot,
            name: item?.name ?? "Unknown",
            emoji: item?.emoji ?? "❓",
            angle: wheel.rotation,
          };

          // keep legacy result array if other UI uses it
          dispatch(setLuckyTimeResults([`${payload.emoji} ${payload.name}`]));
          dispatch(stopSpinning());
        });
    },
    [dispatch]
  );
  // 🔁 React to Redux trigger
  useEffect(() => {
    if (!spinId) return;

    if (isSpinning) return; // currently spinning; ignore trigger

    runSpin(durationMs, forceIndex ?? null);
  }, [spinId, isSpinning, durationMs, forceIndex, runSpin]);
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

      {/* <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-56 px-6 py-2 text-white font-bold rounded-lg shadow-lg ${
          isSpinning ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isSpinning ? `Spinning...` : "Spin the Wheel"}
      </button> */}
    </div>
  );
}
