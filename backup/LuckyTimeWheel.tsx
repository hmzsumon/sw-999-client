"use client";
import { useCallback, useState } from "react";

const animals = [
  { dig: 0, name: "🐯 Tiger" },
  { dig: 30, name: "🦁 Lion" },
  { dig: 60, name: "🐆 Leopard" },
  { dig: 90, name: "🐖 Pig" },
  { dig: 120, name: "🐄 Cow" },
  { dig: 150, name: "🐒 Monkey" },
  { dig: 180, name: "🐺 Wolf" },
  { dig: 210, name: "🐰 Rabbit" },
  { dig: 240, name: "🦊 Fox" },
  { dig: 270, name: "🐴 Horse" },
  { dig: 300, name: "🐻 Bear" },
  { dig: 330, name: "🐘 Elephant" },
];

export default function Wheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [result, setResult] = useState<string | null>(null);

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    const spinTime = Math.floor(Math.random() * 4000) + 4000; // 4–8s
    const extraSpins = 5 * 360; // কয়েক রাউন্ড বেশি

    // ✅ যেকোনো একটা এনিমেল র‍্যান্ডমলি বেছে নিই
    const chosen = animals[Math.floor(Math.random() * animals.length)];

    // এই অ্যাঙ্গেলেই থামাবে
    const totalRotation = rotation + extraSpins + chosen.dig;
    console.log("Spinning to:", totalRotation);

    setDuration(spinTime);
    setIsSpinning(true);
    setRotation(totalRotation);
    setResult(chosen.name); // রেজাল্ট দেখাবো
  }, [isSpinning, rotation]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLImageElement>) => {
    if (e.propertyName !== "transform") return;
    setIsSpinning(false);
    setRotation((prev) => prev % 360); // বড় সংখ্যা ছোট করে রাখা
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center">
      <div className="relative w-72 h-72">
        {/* হুইল */}
        <img
          src="/images/lucky-time/lucky_time_wheel1.png"
          alt="Spinning Wheel"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${duration}ms cubic-bezier(0.215, 0.61, 0.355, 1)`
              : "none",
          }}
          className="w-full h-full"
        />

        {/* ফ্রেম */}
        <img
          src="/images/lucky-time/frame_3.png"
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* পয়েন্টার */}
        <img
          src="/images/lucky-time/pin.png"
          alt="pointer"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-10"
        />

        {/* মাঝের ঢাকনা */}
        <img
          src="/images/lucky-time/middle_wheel.png"
          alt="middle"
          className="absolute top-1/2 left-1/2 w-[33%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
      </div>

      {/* স্পিন বোতাম */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-56 px-6 py-2 text-white font-bold rounded-lg shadow-lg transition-all ${
          isSpinning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      {/* রেজাল্ট */}
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
