// components/lucky-time/ActionBar.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */
import {
  clearBets,
  rebet,
  requestSpin,
} from "@/redux/features/lucky-time/luckyTimeSlice";
import { useDispatch, useSelector } from "react-redux";

/* ── Component ──────────────────────────────────────────────────────────── */
export default function ActionBar() {
  /* ── State ───────────────────────────────────────────────────────────── */
  const dispatch = useDispatch();
  const { isSpinning, totalBet, lastBets } = useSelector(
    (s: any) => s.luckyTime
  );

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const canSpin = !isSpinning && totalBet > 0;
  const canRebet = !isSpinning && Object.keys(lastBets || {}).length > 0;
  const canClear = !isSpinning && totalBet > 0;

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const onRebet = () => dispatch(rebet());
  // IMPORTANT: do NOT startSpinning() here; Wheel.tsx will start after place-bet succeeds
  const onSpinIntent = () => {
    if (!canSpin) return;
    dispatch(requestSpin(undefined));
  };
  const onClear = () => {
    if (!canClear) return;
    dispatch(clearBets());
  };

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-[720px] mx-auto mt-1 flex items-center justify-center gap-3">
      <button
        onClick={onRebet}
        disabled={!canRebet}
        className={[
          "h-12 px-5 rounded-full font-extrabold tracking-widest transition",
          "bg-[#a33434] text-white border border-[#f3b1b1]/30 shadow",
          "enabled:hover:brightness-110 enabled:active:scale-95",
          !canRebet ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        aria-label="Rebet last bets"
      >
        REBET
      </button>

      <button
        onClick={onClear}
        disabled={!canClear}
        className={[
          "h-12 px-2 text-sm rounded-full font-extrabold tracking-widest transition",
          "bg-[#9a7b29] text-white border border-[#f6e1a6]/25 shadow",
          "enabled:hover:brightness-110 enabled:active:scale-95",
          !canClear ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        aria-label="Clear all bets"
      >
        CLEAR BET
      </button>

      <button
        onClick={onSpinIntent}
        disabled={!canSpin}
        className={[
          "h-12 px-8 rounded-full font-extrabold tracking-widest transition",
          "bg-[#1b8a3b] text-white border border-[#b6f2c7]/25 shadow",
          "enabled:hover:brightness-110 enabled:active:scale-95",
          !canSpin ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        aria-label="Spin the wheel"
      >
        {isSpinning ? "SPINNING…" : "SPIN"}
      </button>
    </div>
  );
}
