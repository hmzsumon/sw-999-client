// components/lucky-time/ChipsBar.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */

import { selectChip } from "@/redux/features/crazy-lion/crazyLionSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import BWChip from "../game-ui/BWChip";

/* ── Config: Chip definitions ────────────────────────────────────────────── */
const CHIP_SET = [
  {
    key: "black",
    size: 50,
    amount: 1,
    baseColor: "#191919",
    faceColor: "#111827",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "blue",
    size: 50,
    amount: 10,
    baseColor: "#2563EB",
    faceColor: "#1D4ED8",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "red",
    size: 50,
    amount: 100,
    baseColor: "#EF4444",
    faceColor: "#DC2626",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "green",
    size: 50,
    amount: 500,
    baseColor: "#22C55E",
    faceColor: "#16A34A",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
] as const;

const withAlpha = (hex: string, aa: string) =>
  hex.length === 7 ? `${hex}${aa}` : hex;

/* ── Component ───────────────────────────────────────────────────────────── */
export default function ChipsBar() {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<number | null>(null);

  const handlePick = (amt: number) => {
    setSelected(amt);
    dispatch(selectChip(amt));
  };

  return (
    <div className="w-full max-w-md mx-auto flex justify-center gap-3 sm:gap-4 mb-3">
      {CHIP_SET.map((chip) => {
        const isActive = selected === chip.amount;

        return (
          <button
            key={chip.key}
            onClick={() => handlePick(chip.amount)}
            className={`relative isolate rounded-full active:scale-[0.96] transition-transform ${
              isActive ? "scale-110 chip-glow" : ""
            }`}
            aria-pressed={isActive}
            aria-label={`${chip.key} chip ${chip.amount}`}
          >
            <BWChip
              size={chip.size}
              amount={chip.amount}
              baseColor={chip.baseColor}
              faceColor={chip.faceColor}
              stripeColor={chip.stripeColor}
              textColor={chip.textColor}
              onClick={handlePick}
            />
          </button>
        );
      })}

      <style jsx>{`
        @keyframes chipGlow {
          0% {
            transform: scale(1.08);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.12);
            filter: brightness(1.06);
          }
          100% {
            transform: scale(1.08);
            filter: brightness(1);
          }
        }
        .chip-glow {
          animation: chipGlow 1.4s ease-in-out infinite;
          will-change: transform, filter;
        }
      `}</style>
    </div>
  );
}
// ── Exports ──────────────────────────────────────────────────────────────
