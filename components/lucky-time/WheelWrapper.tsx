"use client";

import ChipsBar from "./ChipsBar";
import ControlBar from "./ControlBar";
import LuckyTimeBoard from "./LuckyTimeBoard";
import Wheel from "./Wheel";

const WheelWrapper = () => {
  return (
    <div>
      <Wheel />
      <LuckyTimeBoard />
      <div className="mt-0">
        <ChipsBar />
        <ControlBar />
      </div>
    </div>
  );
};

export default WheelWrapper;
