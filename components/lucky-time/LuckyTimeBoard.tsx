// components/lucky-time/LuckyTimeBoard.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

type BoardItem = {
  id: number;
  name?: string;
  multi: number;
  emoji: string;
  dig?: number;
};

export const defaultItems: BoardItem[] = [
  { id: 1, multi: 200, emoji: "🐯", name: "Tiger", dig: 0 },
  { id: 2, multi: 300, emoji: "🦁", name: "Lion", dig: 30 },
  { id: 3, multi: 50, emoji: "🐆", name: "Leopard", dig: 60 },
  { id: 4, multi: 1.5, emoji: "🐖", name: "Pig", dig: 90 },
  { id: 5, multi: 4, emoji: "🐄", name: "Cow", dig: 120 },
  { id: 6, multi: 2, emoji: "🐒", name: "Monkey", dig: 150 },
  { id: 7, multi: 10, emoji: "🐺", name: "Wolf", dig: 180 },
  { id: 8, multi: 5, emoji: "🐰", name: "Rabbit", dig: 210 },
  { id: 9, multi: 3, emoji: "🦊", name: "Fox", dig: 240 },
  { id: 10, multi: 50, emoji: "🐴", name: "Horse", dig: 270 },
  { id: 11, multi: 100, emoji: "🐻", name: "Bear", dig: 300 },
  { id: 12, multi: 150, emoji: "🐘", name: "Elephant", dig: 330 },
];

type SliceLastResult = {
  id: number;
  name: string;
  emoji: string;
  angle: number;
  multi: number;
};

export default function LuckyTimeBoard({
  items = defaultItems,
  title = "Board",
  resetMs = 2500, // how long the win highlight/animation stays before resetting
}: {
  items?: BoardItem[];
  title?: string;
  resetMs?: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  // Pull from Redux (adjust state typing if you have RootState)
  const { luckyTimeResults, winKey } = useSelector(
    (state: any) => state.luckyTime
  );

  // Assume newest result is at index 0 (prepend). Adjust if your order is different.
  const lastWin = luckyTimeResults?.[0] as SliceLastResult | undefined;
  const winningId = lastWin?.id;

  // Keep an "active" winning id that auto-resets after `resetMs`
  const [activeWinId, setActiveWinId] = useState<number | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Whenever a new win arrives, start the highlight window
    if (!winningId) return;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    setActiveWinId(winningId);
    resetTimerRef.current = setTimeout(() => {
      setActiveWinId(null); // reset highlight
    }, resetMs);

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
    // Tie to winKey and list length to ensure retrigger on new results
  }, [winningId, luckyTimeResults?.length, winKey, resetMs]);

  // Changing this key forces a re-mount of animated nodes -> replays CSS animations
  const animKey = useMemo(
    () =>
      `${winKey ?? "none"}-${winningId ?? "none"}-${
        luckyTimeResults?.length ?? 0
      }`,
    [winKey, winningId, luckyTimeResults?.length]
  );

  return (
    <div className="w-full mx-auto max-w-[440px] sm:max-w-[620px] md:max-w-[900px] px-1">
      <div className="rounded-2xl p-1 sm:p-3 bg-[#3b2415] [box-shadow:inset_0_0_0_2px_#8a5a2d]">
        {/* Mobile: 4 columns, Desktop: 6 */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1 sm:gap-3">
          {items.map((it) => {
            const isSelected = selected === it.id;
            const isWinActive = activeWinId === it.id;

            return (
              <button
                key={it.id}
                onClick={() => setSelected(isSelected ? null : it.id)}
                className={`
                  relative w-full aspect-[3/4] h-[4.5rem] sm:h-[6.5rem]
                  rounded-xl bg-[#2b1a0f] border-2 transition active:scale-[0.98]
                  ${
                    isSelected
                      ? "border-yellow-300 shadow-[0_0_18px_rgba(255,213,87,.35)]"
                      : "border-[#6a4424] hover:border-[#a56a35]"
                  }
                  ${
                    isWinActive ? "animate-win-card ring-2 ring-yellow-300" : ""
                  }
                `}
                aria-pressed={isSelected}
                aria-label={`${it.name ?? "Item"} ×${it.multi}`}
              >
                {/* inner panel */}
                <div className="absolute inset-[5px] sm:inset-[6px] rounded-lg bg-[#2f1d11] border border-[#8f5d31]/60" />

                {/* Watermark multiplier */}
                <div
                  className="hidden sm:block pointer-events-none absolute top-1.5 left-1/2 -translate-x-1/2
                    px-2 sm:px-3 rounded text-[11px] sm:text-sm font-extrabold tracking-widest
                    text-[#b7ffcf]/55 bg-[#0e3a29]/20 border border-[#2ebf6b]/25 backdrop-blur-[1px]
                    -rotate-3 select-none shadow-[0_0_8px_rgba(0,0,0,.25)] mix-blend-luminosity"
                >
                  {it.multi}
                </div>

                {/* BIG emoji */}
                <div className="relative z-10 h-full w-full flex items-center justify-center p-1">
                  <span
                    key={isWinActive ? `emoji-${animKey}` : `emoji-${it.id}`}
                    className={`
                      leading-none
                      text-[clamp(42px,10vw,72px)] sm:text-[clamp(56px,8vw,88px)]
                      drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]
                      ${isWinActive ? "animate-win-emoji" : ""}
                    `}
                    aria-label={it.name}
                  >
                    {it.emoji}
                  </span>
                </div>

                {/* Win badge */}
                {isWinActive && (
                  <div
                    key={`badge-${animKey}`}
                    className="absolute -top-2 -right-2 text-[11px] sm:text-xs px-2 py-0.5 rounded-full
                               bg-yellow-300/90 text-black font-extrabold shadow-md animate-badge-pop"
                  >
                    WIN ×{lastWin?.multi ?? it.multi}
                  </div>
                )}

                {/* corner lines (decor) */}
                <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-tl-lg border-l border-t border-[#d6a65b]/40" />
                <span className="pointer-events-none absolute right-1 bottom-1 h-5 w-5 rounded-br-lg border-r border-b border-[#d6a65b]/40" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-3 sm:h-4" />

      {/* Scoped CSS animations */}
      <style jsx>{`
        @keyframes winPop {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.25) rotate(-6deg);
          }
          55% {
            transform: scale(0.96) rotate(4deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes winGlow {
          0% {
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
          35% {
            box-shadow: 0 0 28px rgba(255, 213, 87, 0.45);
          }
          100% {
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
        }
        @keyframes badgePop {
          0% {
            transform: scale(0.6) translateY(-4px);
            opacity: 0;
          }
          60% {
            transform: scale(1.1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-win-emoji {
          animation: winPop 900ms ease-out 1;
        }
        .animate-win-card {
          animation: winGlow 1200ms ease-out 1;
        }
        .animate-badge-pop {
          animation: badgePop 700ms ease-out 1;
        }
      `}</style>
    </div>
  );
}
