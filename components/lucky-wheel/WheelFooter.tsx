"use client";
import Image from "next/image";
import React, { useMemo, useRef } from "react";
import { FaRegSquareCaretLeft, FaRegSquareCaretRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import bgFooter from "@/public/images/lucky-wheel/bg_footer.png";
import { setBetAmount } from "@/redux/features/lucky-wheel/luckyWheelSlice";

type RootState = {
  luckyWheel: { betAmount: number };
};

const MIN_BET = 5;
const MAX_BET = 1000;

// Hold behavior: first pause, then step-by-step
const HOLD_DELAY_MS = 400; // প্রথমে একটু থামবে
const REPEAT_MS = 85; // তারপর এই ইন্টারভ্যালে ১ করে বাড়বে/কমবে

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const formatBalance = (amount: number): string => {
  if (amount >= 1_000_000)
    return (amount / 1_000_000).toFixed(2).replace(/\.0$/, "") + "M";
  if (amount >= 1_000)
    return (amount / 1_000).toFixed(2).replace(/\.0$/, "") + "K";
  return amount.toString();
};

const WheelFooter: React.FC = () => {
  const dispatch = useDispatch();
  const betAmount = useSelector((s: RootState) => s.luckyWheel.betAmount);

  const canDec = betAmount > MIN_BET;
  const canInc = betAmount < MAX_BET;

  const changeBet = (next: number) => {
    const safe = clamp(Math.round(next), MIN_BET, MAX_BET);
    if (safe !== betAmount) {
      dispatch(setBetAmount(safe));
      return true; // changed
    }
    return false; // no change
  };

  const adjust = (delta: number) => {
    return changeBet(betAmount + delta);
  };

  // --- Hold logic with initial pause, then repeat ---
  const holdTimeoutRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);
  const wasHoldingRef = useRef(false); // hold শুরু হলে click এফেক্ট ক্যান্সেল

  const startHold = (delta: number, enabled: boolean) => {
    if (!enabled) return;
    stopHold(); // safety
    wasHoldingRef.current = false;

    // প্রথমে pause
    holdTimeoutRef.current = window.setTimeout(() => {
      wasHoldingRef.current = true;
      // তারপর ১ করে বাড়বে/কমবে
      holdIntervalRef.current = window.setInterval(() => {
        const changed = adjust(delta);
        if (!changed) stopHold(); // লিমিটে পৌঁছালে থামাও
      }, REPEAT_MS);
    }, HOLD_DELAY_MS);
  };

  const stopHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // derive button classes
  const btnBase =
    "inline-flex items-center justify-center rounded-md outline-none select-none transition active:scale-[.98]";
  const decClass = useMemo(
    () =>
      `${btnBase} text-yellow-400 text-4xl ${
        canDec ? "opacity-100 cursor-pointer" : "opacity-40 cursor-not-allowed"
      }`,
    [canDec]
  );
  const incClass = useMemo(
    () =>
      `${btnBase} text-yellow-400 text-4xl ${
        canInc ? "opacity-100 cursor-pointer" : "opacity-40 cursor-not-allowed"
      }`,
    [canInc]
  );

  return (
    <div className="relative z-50">
      <div className="absolute bottom-0 w-full h-[10vh]">
        <Image
          src={bgFooter}
          alt="Lucky Wheel Navbar Background"
          className="w-full h-full object-cover pointer-events-none select-none"
          priority
        />
      </div>

      <div className="flex items-center justify-center absolute bottom-0 w-full h-full px-4 -top-8">
        <div className="flex items-center gap-4">
          {/* Decrease */}
          <button
            type="button"
            aria-label="Decrease bet"
            className={decClass}
            disabled={!canDec}
            // single click: ১ ধাপ
            onClick={(e) => {
              if (!canDec) return;
              // যদি hold চলছিল, এই click স্কিপ হবে
              if (wasHoldingRef.current) {
                wasHoldingRef.current = false;
                return;
              }
              adjust(-1);
            }}
            // unified pointer events
            onPointerDown={() => startHold(-1, canDec)}
            onPointerUp={() => {
              stopHold();
              // wasHoldingRef ফ্ল্যাগ true থাকলে onClick স্কিপ করবে
            }}
            onPointerCancel={stopHold}
            onPointerLeave={stopHold}
          >
            <FaRegSquareCaretLeft />
          </button>

          {/* Bet Amount box */}
          <div className="p-[4px] rounded-lg bg-[linear-gradient(180deg,#FFE26A_0%,#FF9D00_55%,#FF4B00_100%)] [box-shadow:0_0_8px_rgba(255,184,0,.55),0_0_18px_rgba(255,89,0,.35)]">
            <div className="py-2 px-4 w-full rounded-[5px] overflow-visible bg-[linear-gradient(180deg,#2a0153_0%,#3a016a_100%)] ring-1 ring-inset ring-yellow-100/50 [box-shadow:inset_0_0_9px_rgba(255,210,90,.65)] flex items-center gap-2">
              <span className="text-white font-extrabold tracking-widest">
                Bet: ৳ {formatBalance(betAmount)}
              </span>
            </div>
          </div>

          {/* Increase */}
          <button
            type="button"
            aria-label="Increase bet"
            className={incClass}
            disabled={!canInc}
            onClick={(e) => {
              if (!canInc) return;
              if (wasHoldingRef.current) {
                wasHoldingRef.current = false;
                return;
              }
              adjust(1);
            }}
            onPointerDown={() => startHold(1, canInc)}
            onPointerUp={() => {
              stopHold();
            }}
            onPointerCancel={stopHold}
            onPointerLeave={stopHold}
          >
            <FaRegSquareCaretRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WheelFooter;
