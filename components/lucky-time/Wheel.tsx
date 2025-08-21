"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const SEGMENTS = 12;
const STEP = 360 / SEGMENTS;

// ঘড়ির কাঁটার দিকে, টপ থেকে শুরু
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

// আপনার আর্টে সেগমেন্ট-০ এর **কেন্দ্র** যদি টপে ঠিক না থাকে,
// এখানে ডিগ্রি দিয়ে ফাইন টিউন করুন (ডানে গেলে +, বামে গেলে -)
const ASSET_OFFSET_DEG = 0; // প্রয়োজনমতো 0/±15/±30 ইত্যাদি ট্রাই করুন

const EXTRA_ROUNDS = 10; // 5×360°

export default function Wheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [result, setResult] = useState<string | null>(null);
  console.log("Result:", result);
  const [rotationDbg, setRotationDbg] = useState(0); // ডিবাগ দেখার জন্য

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null); // createjs.Bitmap
  const createjsRef = useRef<any>(null); // module

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

  // যে স্লট পিনের নিচে আছে সেটা গণনা (ফাইনাল রোটেশন থেকে)
  const readSlotFromRotation = (finalRotationDeg: number) => {
    // পিন টপে, তাই হুইলের টপ-এঙ্গেল = 360 - rotation
    const topAngle = norm360(360 - norm360(finalRotationDeg));
    // আর্ট ক্যালিব্রেশন সমন্বয় করে নিকটতম স্লট-সেন্টারে রাউন্ড
    const slotFloat = norm360(topAngle - ASSET_OFFSET_DEG) / STEP;
    const slot = Math.round(slotFloat) % SEGMENTS;
    return slot;
  };

  // স্পিন
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
    const createjs = createjsRef.current;
    const wheel = wheelRef.current;
    if (!createjs || !wheel) return;

    const spinTime = Math.floor(Math.random() * 4000) + 4000; // 4–8s
    setDuration(spinTime);
    setIsSpinning(true);
    setResult(null);

    // র‍্যান্ডম স্লট পিক
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
        // নরমালাইজ
        wheel.rotation = norm360(wheel.rotation);
        setRotationDbg(wheel.rotation);

        // ✅ ফাইনাল রোটেশন থেকে স্লট পড়া (এটাই গ্রাউন্ড ট্রুথ)
        const slot = readSlotFromRotation(wheel.rotation);

        const NewResult = newArray.filter(
          (item) => item.dig === wheel.rotation
        )[0];
        setResult(NewResult ? `${NewResult.emoji} ${NewResult.name}` : null);

        setIsSpinning(false);
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

      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-56 px-6 py-2 text-white font-bold rounded-lg shadow-lg ${
          isSpinning ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isSpinning ? `Spinning...` : "Spin the Wheel"}
      </button>

      <div className="mt-6 min-h-12 flex items-center justify-center">
        {result ? (
          <div className="px-4 py-2 rounded-lg text-xl font-bold bg-yellow-900/40 text-yellow-300">
            You got: <span className="ml-2">{result}</span>
          </div>
        ) : (
          <div className="text-sm text-white/60">Spin to see the animal!</div>
        )}
      </div>

      {/* (ঐচ্ছিক) ছোট ডিবাগ – কোন এঙ্গেলে থামল */}
      {/* <div className="mt-2 text-xs text-white/50">rot: {rotationDbg.toFixed(2)}°</div> */}
    </div>
  );
}
