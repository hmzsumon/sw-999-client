"use client";

import { startSpinning } from "@/redux/features/lucky-time/luckyTimeSlice";
import { useDispatch } from "react-redux";

export default function ControlBar() {
  const dispatch = useDispatch();
  return (
    <div className="w-full max-w-md mx-auto flex justify-center gap-2 sm:gap-4 mt-3">
      {/* Clear Bet */}
      <button
        className="
          flex-1 py-2 sm:py-3 rounded-md
          bg-[#2b1a0f] border-2 border-yellow-500 text-yellow-300
          font-bold tracking-wide text-sm sm:text-base
          hover:bg-yellow-600/20 active:scale-[0.97] transition
        "
      >
        CLEAR BET
      </button>

      {/* Spin */}
      <button
        className="
          flex-1 py-2 sm:py-3 rounded-md
          bg-green-600 border-2 border-green-700 text-white
          font-bold tracking-wide text-sm sm:text-base
          shadow-[0_0_12px_rgba(34,197,94,.6)]
          hover:bg-green-700 active:scale-[0.97] transition
        "
        onClick={() => dispatch(startSpinning())} // Dispatch action to start spinning
      >
        SPIN
      </button>

      {/* Rules */}
      <button
        className="
          flex-1 py-2 sm:py-3 rounded-md
          bg-[#2b1a0f] border-2 border-yellow-500 text-yellow-300
          font-bold tracking-wide text-sm sm:text-base
          hover:bg-yellow-600/20 active:scale-[0.97] transition
        "
      >
        RULES
      </button>
    </div>
  );
}
