"use client";

import dynamic from "next/dynamic";

const LuckyWheel = dynamic(
  () => import("@/components/lucky-wheel/LuckyWheel"),
  { ssr: false }
);

const LuckyWheelWrapper = () => {
  return (
    <div className="w-full h-[85vh] relative bg-gray-900 overflow-hidden">
      <div>
        <LuckyWheel />
      </div>
    </div>
  );
};

export default LuckyWheelWrapper;
