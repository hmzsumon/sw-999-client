// components/lucky-time/BetBoard.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */
import { placeBetOn } from "@/redux/features/lucky-time/luckyTimeSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChipStack from "../game-ui/ChipStack";
import { SEGMENTS } from "./LuckyWheel";

/* ── Rows (removed "0") ─────────────────────────────────────────────────── */
const ROW_NUMS = ["1", "2", "3", "5", "10"];
const ROW_LUCKY = ["L", "U", "C", "K", "Y"];

/* ── Map "result" → segment id / multi ──────────────────────────────────── */
const findIdByResult = (key: string) =>
  SEGMENTS.find(
    (s) => String(s.result).toLowerCase() === String(key).toLowerCase()
  )?.id ?? null;

const findMultiByResult = (key: string) =>
  SEGMENTS.find(
    (s) => String(s.result).toLowerCase() === String(key).toLowerCase()
  )?.multi ?? null;

/* ── Chip style by denom ───────────────────────────────────────────────── */
const CHIP_STYLE: Record<number, { color: string; stripe: string }> = {
  10: { color: "#191919", stripe: "#ffffff" },
  50: { color: "#2563EB", stripe: "#ffffff" },
  100: { color: "#EF4444", stripe: "#ffffff" },
  500: { color: "#22C55E", stripe: "#ffffff" },
  1000: { color: "#7C3AED", stripe: "#ffffff" },
};

/* ── Utils ─────────────────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString();

/* ── Decompose stake into chips ────────────────────────────────────────── */
const DENOMS = [1000, 500, 100, 50, 10] as const;
function decompose(total: number): Record<number, number> {
  let rem = Math.max(0, Math.floor(total / 10) * 10);
  const out: Record<number, number> = {};
  for (const d of DENOMS) {
    const c = Math.floor(rem / d);
    if (c > 0) {
      out[d] = c;
      rem -= c * d;
    }
  }
  return out;
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function BetBoard() {
  const dispatch = useDispatch();

  // ── Redux state ────────────────────────────────────────────────────────
  const lucky = useSelector((s: any) => s.luckyTime || {});
  const bets: Record<number, number> = lucky.bets || {};
  const selectedChip: number | null = lucky.selectedChip ?? null;

  // winner flash: highlight the last winning id for a short time
  const last = lucky.last; // {id, name, ...}
  const winKey = lucky.winKey; // changes every settle
  const [flashId, setFlashId] = useState<number | null>(null);

  useEffect(() => {
    if (last?.id) {
      setFlashId(last.id);
      const t = setTimeout(() => setFlashId(null), 2200);
      return () => clearTimeout(t);
    }
  }, [winKey]); // re-run when a new win happens

  /* ── Single tile ─────────────────────────────────────────────────────── */
  const Tile = ({ label }: { label: string }) => {
    const id = findIdByResult(label);
    const multi = findMultiByResult(label);
    const betHere = id ? bets[id] ?? 0 : 0;
    const disabled = id == null;
    const isWinner = flashId != null && id === flashId;

    const onClick = () => {
      if (!id) return;
      dispatch(placeBetOn({ itemId: id, amount: selectedChip ?? 0 }));
    };

    const breakdown = decompose(betHere);

    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={[
          "relative h-14 sm:h-[68px] rounded-xl overflow-hidden", // ↑ bigger height
          "bg-[#2b1a0f] border border-[#a47335]/70",
          "text-yellow-300 font-extrabold tracking-widest",
          "shadow-[inset_0_0_0_1px_rgba(255,208,90,.15),0_6px_16px_rgba(0,0,0,.35)]",
          "hover:border-yellow-300/70 active:scale-[0.98] transition",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          isWinner ? "ring-2 ring-yellow-300/80 animate-win-tile" : "",
        ].join(" ")}
        aria-label={`Bet on ${label}`}
      >
        {/* inner panel */}
        <span className="pointer-events-none absolute inset-[6px] rounded-lg bg-[#23160c] border border-[#d6a65b]/20" />

        {/* winner glow overlay */}
        {isWinner && (
          <span className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,225,140,.25),rgba(0,0,0,0)_65%)]" />
        )}

        {/* label */}
        <div className="relative z-20 flex flex-col items-center justify-center leading-tight">
          <span
            className={[
              "text-lg sm:text-xl", // ↑ bigger label
              isWinner ? "animate-win-label" : "",
            ].join(" ")}
          >
            {label}
          </span>

          {/* faint multiplier under the label */}
          {multi != null && (
            <span className="mt-[1px] text-[10px] sm:text-xs text-yellow-100/60 font-bold">
              ×{multi}
            </span>
          )}
        </div>

        {/* amount badge */}
        {betHere > 0 && (
          <span className="absolute top-1 right-1 z-30 text-[10px] sm:text-xs px-1.5 py-[2px] rounded-full bg-emerald-400/90 text-black font-extrabold shadow">
            {fmt(betHere)}
          </span>
        )}

        {/* stacked chips (by denom) */}
        <div className="pointer-events-none absolute left-1/2 bottom-[6px] -translate-x-1/2 z-10">
          {DENOMS.map((d, gi) => {
            const c = breakdown[d] || 0;
            if (!c) return null;
            const sty = CHIP_STYLE[d];
            return (
              <div
                key={d}
                className="absolute left-1/2 bottom-0 -translate-x-1/2"
                style={{
                  transform: `translate(-50%,0) translateY(-${gi * 2}px)`,
                }}
              >
                <ChipStack
                  count={c}
                  color={sty.color}
                  stripe={sty.stripe}
                  size={22} // ↑ slightly larger chips to match larger tiles
                  pile
                />
              </div>
            );
          })}
        </div>

        {/* scoped animations */}
        <style jsx>{`
          @keyframes winTilePulse {
            0%,
            100% {
              box-shadow: 0 0 0 rgba(255, 210, 120, 0);
              transform: translateY(0);
            }
            50% {
              box-shadow: 0 0 24px rgba(255, 210, 120, 0.35);
              transform: translateY(-1px);
            }
          }
          .animate-win-tile {
            animation: winTilePulse 1.2s ease-in-out 2;
          }

          @keyframes winLabelBounce {
            0% {
              transform: scale(1) rotate(0deg);
            }
            30% {
              transform: scale(1.28) rotate(-3deg);
              text-shadow: 0 0 12px rgba(255, 225, 120, 0.75),
                0 0 28px rgba(255, 180, 0, 0.45);
            }
            60% {
              transform: scale(1.12) rotate(2deg);
            }
            100% {
              transform: scale(1) rotate(0deg);
            }
          }
          .animate-win-label {
            animation: winLabelBounce 800ms ease-out 2;
          }
        `}</style>
      </button>
    );
  };

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-[640px] mx-auto mt-3">
      <div className="rounded-[18px] p-3 bg-[#3b2415] [box-shadow:inset_0_0_0_2px_#8a5a2d]">
        {/* Row 1: numbers (no title; grid = 5 cols) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-2">
          {ROW_NUMS.map((x) => (
            <Tile key={x} label={x} />
          ))}
        </div>

        {/* Row 2: L U C K Y */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {ROW_LUCKY.map((x) => (
            <Tile key={x} label={x} />
          ))}
        </div>
      </div>
    </div>
  );
}
