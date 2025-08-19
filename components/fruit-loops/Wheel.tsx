"use client";
import { useCallback, useRef, useState } from "react";

type Segment = { angle: number; result: string };

const Wheel = () => {
  const wheelRef = useRef<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [pendingResult, setPendingResult] = useState<string | null>(null);

  // সেগমেন্ট (ডিজাইন অপরিবর্তিত)
  const segments: Segment[] = [
    { angle: 0, result: "Apple 🍎" },
    { angle: 60, result: "Mango 🥭" },
    { angle: 120, result: "Watermelon 🍉" },
    { angle: 180, result: "Apple 🍎" },
    { angle: 240, result: "Mango 🥭" },
    { angle: 300, result: "Watermelon 🍉" },
  ];

  // স্পিন (React + CSS transition)
  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    const spinTime = Math.floor(Math.random() * 5000) + 5000; // 5-10s
    const randomSegment = segments[Math.floor(Math.random() * segments.length)];
    const finalAngle = (360 - randomSegment.angle) % 360;

    const totalRotation = rotation + 1800 + finalAngle; // extra spins + landing

    setDuration(spinTime);
    setPendingResult(`You got: ${randomSegment.result}`);
    setIsSpinning(true);
    setRotation(totalRotation);
  }, [isSpinning, rotation, segments]);

  // ট্রানজিশন শেষে রেজাল্ট সেট করা
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLImageElement>) => {
    if (e.propertyName !== "transform") return; // শুধু transform শেষ হলে
    setIsSpinning(false);
    setRotation((prev) => prev % 360); // মান ছোট রাখা
    if (pendingResult) setResult(pendingResult);
    setPendingResult(null);
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center ">
      <div className="relative w-64 h-64">
        <div className="absolute z-40 top-0">
          <img
            /* ডেকোরেটিভ: স্পিন হবে না, তাই ref নেই */
            src="/images/fruit-loops/title_5.png"
            alt="Spinning Wheel"
            className="w-full h-full rotate-[360deg] pointer-events-none"
          />
        </div>

        {/* হুইল (শুধু এটাই ঘুরবে) */}
        <div className="absolute -top-[30%]">
          <img
            ref={wheelRef}
            src="/images/fruit-loops/wheel_1.png"
            alt="Spinning Wheel"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? `transform ${duration}ms cubic-bezier(0.215, 0.61, 0.355, 1)` // easeOutCubic
                : "none",
            }}
            className="w-full h-full  "
          />
        </div>

        {/* অ্যারো (স্থির থাকবে) */}
        <img
          src="/images/fruit-loops/arrow.png"
          alt="arrow"
          className="absolute top-[13%] left-[43%] w-10"
        />
      </div>

      {/* স্পিন বোতাম */}
      {/* <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-4 px-6 py-2 text-white font-bold rounded-lg shadow-lg transition-all ${
          isSpinning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button> */}
    </div>
  );
};

export default Wheel;
