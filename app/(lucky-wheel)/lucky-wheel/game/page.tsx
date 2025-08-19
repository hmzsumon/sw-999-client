"use client";

import dynamic from "next/dynamic";

const LuckyWheel = dynamic(
  () => import("@/components/lucky-wheel/LuckyWheel"),
  { ssr: false }
);

const LuckyWheelWrapper = () => {
  return (
    <div className="w-full h-[95vh] relative  overflow-hidden">
      <LuckyWheel />
    </div>
  );
};

export default LuckyWheelWrapper;
