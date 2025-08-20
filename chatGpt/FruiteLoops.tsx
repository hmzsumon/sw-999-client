import { stopSpinning } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Wheel = () => {
  const dispatch = useDispatch();
  const { isSpinning } = useSelector((state: any) => state.fruitLoops);

  const wheelRef = useRef<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [duration, setDuration] = useState(6000);
  const [pendingResult, setPendingResult] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const segments = [
    { angle: 0, result: "Apple 🍎" },
    { angle: 60, result: "Mango 🥭" },
    { angle: 120, result: "Watermelon 🍉" },
    { angle: 180, result: "Apple 🍎" },
    { angle: 240, result: "Mango 🥭" },
    { angle: 300, result: "Watermelon 🍉" },
  ];

  // 🔑 এখন isSpinning true হলেই spin হবে
  useEffect(() => {
    if (!isSpinning) return;

    const spinTime = Math.floor(Math.random() * 5000) + 5000;
    const randomSegment = segments[Math.floor(Math.random() * segments.length)];
    const finalAngle = (360 - randomSegment.angle) % 360;
    const totalRotation = rotation + 1800 + finalAngle;

    setDuration(spinTime);
    setPendingResult(`You got: ${randomSegment.result}`);
    setRotation(totalRotation);
  }, [isSpinning]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLImageElement>) => {
    if (e.propertyName !== "transform") return;
    dispatch(stopSpinning());
    setRotation((prev) => prev % 360);
    if (pendingResult) setResult(pendingResult);
    setPendingResult(null);
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      <img
        ref={wheelRef}
        src="/images/fruit-loops/wheel_1.png"
        alt="wheel"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? `transform ${duration}ms cubic-bezier(0.215, 0.61, 0.355, 1)`
            : "none",
        }}
        className="w-full h-full"
      />
      <img
        src="/images/fruit-loops/arrow.png"
        alt="arrow"
        className="absolute top-[13%] left-[43%] w-10"
      />
      {result && <p className="mt-2 text-center">{result}</p>}
    </div>
  );
};

export default Wheel;
