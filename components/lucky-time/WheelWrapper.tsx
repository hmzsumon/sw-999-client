"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import CircleIconButton from "../fruit-loops/CircleIconButton";
import ChipsBar from "./ChipsBar";
import ControlBar from "./ControlBar";
import LuckyTimeBoard from "./LuckyTimeBoard";
import Wheel from "./Wheel";

const WheelWrapper = () => {
  return (
    <div className="relative">
      <div className="absolute top-1 right-0 z-10">
        <Link href="/dashboard">
          <CircleIconButton
            size={42}
            icon={
              <span className="font-extrabold" style={{ fontSize: 22 }}>
                X
              </span>
            }
            colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          />
        </Link>
      </div>

      <div className="absolute top-1 left-0 flex items-center gap-1 text-gray-200 text-sm z-10">
        <Wallet className="text-gray-100" size={20} />
        <span>$0.00</span>
      </div>
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
