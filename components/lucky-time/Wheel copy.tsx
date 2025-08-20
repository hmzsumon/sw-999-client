"use client";
import { useCallback, useState } from "react";

const SEGMENTS = 12;
const STEP = 360 / SEGMENTS;
const AUTO_RESET_DELAY_MS = 2000;

// প্রাণীর নামের লিস্ট (অর্ডার: ঘড়ির কাঁটার দিকে টপ থেকে)
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

// helper
const norm360 = (deg: number) => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};
// pointer-এর নিচের কোণ
const topAngleOf = (rotation: number) => norm360(360 - norm360(rotation));

export default function Wheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [result, setResult] = useState<string | null>(null);

  // offset slot (ম্যানুয়ালি ঠিক করতে পারবেন)
  const OFFSET_SLOT = 0;
  // যদি রেজাল্ট সবসময় ১ স্লট ডানে যায় → OFFSET_SLOT=1
  // যদি বামে যায় → OFFSET_SLOT=11

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    const spinTime = Math.floor(Math.random() * 4000) + 4000;
    const extraSpins = 5 * 360;

    // random slot index
    const chosenSlot = Math.floor(Math.random() * SEGMENTS);

    // targetTop = chosenSlot * STEP (slot কেন্দ্র)
    const targetTop = norm360(chosenSlot * STEP);

    // finalRotation ≡ 360 - targetTop
    const cur = norm360(rotation);
    const targetRotMod = norm360(360 - targetTop);
    const delta = norm360(targetRotMod - cur);

    const totalRotation = rotation + extraSpins + delta;
    console.log("Spinning to:", totalRotation, "slot:", chosenSlot);

    setDuration(spinTime);
    setIsSpinning(true);
    setResult(null);
    setRotation(totalRotation);
  }, [isSpinning, rotation]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLImageElement>) => {
    if (e.propertyName !== "transform") return;
    setIsSpinning(false);

    const finalR = norm360(rotation);
    setRotation(finalR);

    // pointer angle
    const top = topAngleOf(finalR);

    // nearest slot
    let slot = Math.round(top / STEP) % SEGMENTS;
    // offset adjust
    slot = (slot - OFFSET_SLOT + SEGMENTS) % SEGMENTS;

    const name = ANIMALS[slot] ?? "Unknown";
    setResult(name);

    // auto reset
    setTimeout(() => setRotation(0), AUTO_RESET_DELAY_MS);
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center">
      <div className="relative w-72 h-72">
        <img
          src="/images/lucky-time/lucky_time_wheel1.png"
          alt="Spinning Wheel"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${duration}ms cubic-bezier(0.215,0.61,0.355,1)`
              : "none",
          }}
          className="w-full h-full"
        />

        {/* Frame */}
        <img
          src="/images/lucky-time/frame_3.png"
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Pointer */}
        <img
          src="/images/lucky-time/pin.png"
          alt="pointer"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-10"
        />

        {/* Middle */}
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
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
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
    </div>
  );
}
