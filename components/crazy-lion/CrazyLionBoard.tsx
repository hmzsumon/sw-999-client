// components/lucky-time/LuckyTimeBoard.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */

import { Boost, placeBetOn } from "@/redux/features/crazy-lion/crazyLionSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SEGMENTS } from "./Wheel";

/* ── Types ──────────────────────────────────────────────────────────────── */
type BoardItem = {
  id: number;
  name?: string;
  multi: number;
  emoji: string;
  dig?: number;
};
type SliceLastResult = {
  id: number;
  name: string;
  emoji: string;
  angle: number;
  multi: number;
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString();

/* ── Component Crazy Lion ───────────────────────────────────────────────────────────── */
const CrazyLionBoard = ({
  items = SEGMENTS,
  title = "Board",
  resetMs = 2500,
}: {
  items?: BoardItem[];
  title?: string;
  resetMs?: number;
}) => {
  const dispatch = useDispatch();

  // Redux pulls
  const { crazyLionResults, winKey, activeBoosts, bets } = useSelector(
    (s: any) => s.crazyLion
  );
  const lastWin = crazyLionResults?.[0] as SliceLastResult | undefined;
  const winningId = lastWin?.id;

  // local selected highlight only
  const [selected, setSelected] = useState<number | null>(null);

  // Win highlight reset window
  const [activeWinId, setActiveWinId] = useState<number | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!winningId) return;

    // পূর্বের টাইমার থাকলে পরিষ্কার করুন
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    setActiveWinId(winningId);
    resetTimerRef.current = setTimeout(() => {
      setActiveWinId(null);
      resetTimerRef.current = null;
    }, resetMs);

    // cleanup
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winningId, crazyLionResults?.length, winKey, resetMs]);

  // Overlay refs (for optional boost chips)
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Emoji animation key
  const animKey = useMemo(
    () =>
      `${winKey ?? "none"}-${winningId ?? "none"}-${
        crazyLionResults?.length ?? 0
      }`,
    [winKey, winningId, crazyLionResults?.length]
  );

  // on tile click → place bet using currently selected chip (slice handles checks)
  const handleTileClick = (id: number) => {
    setSelected((cur) => (cur === id ? null : id));
    dispatch(placeBetOn({ itemId: id }));
  };

  return (
    <div
      ref={overlayRef}
      className="relative w-full mx-auto max-w-[440px] sm:max-w-[620px] md:max-w-[900px] px-1"
    >
      <div className="rounded-2xl p-1 sm:p-3 bg-[#3b2415] [box-shadow:inset_0_0_0_2px_#8a5a2d]">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1 sm:gap-3">
          {items.map((it) => {
            const isSelected = selected === it.id;
            const isWinActive = activeWinId === it.id;
            const betHere = bets?.[it.id] ?? 0;

            return (
              <button
                key={it.id}
                ref={(el: any) => (tileRefs.current[it.id] = el)}
                onClick={() => handleTileClick(it.id)}
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
                {/* Inner panel */}
                <div className="absolute inset-[5px] sm:inset-[6px] rounded-lg bg-[#2f1d11] border border-[#8f5d31]/60" />

                {/* Watermark multiplier (emoji-এর ওপর দেখাতে z-index বাড়ানো হয়েছে) */}
                <div
                  className=" pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 z-30
                                px-2 sm:px-3 rounded-md text-[11px] sm:text-sm font-extrabold tracking-widest
                                text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.9)]
                                bg-black/65 backdrop-blur-[2px] border border-white/20"
                >
                  ×{it.multi}
                </div>

                {/* BIG emoji */}
                <div className="relative z-0 h-full w-full flex items-center justify-center p-1">
                  <span
                    key={isWinActive ? `emoji-${animKey}` : `emoji-${it.id}`}
                    className={`leading-none text-[clamp(42px,10vw,72px)] sm:text-[clamp(56px,8vw,88px)]
                               drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]
                               ${isWinActive ? "animate-win-emoji" : ""}`}
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
                               bg-yellow-300/90 text-black font-extrabold shadow-md animate-badge-pop z-20"
                  >
                    WIN ×{lastWin?.multi ?? it.multi}
                  </div>
                )}

                {/* Bet badge */}
                {betHere > 0 && (
                  <div className="absolute top-1 right-1 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-emerald-400/90 text-black font-extrabold shadow">
                    {fmt(betHere)}
                  </div>
                )}

                {/* corners */}
                <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-tl-lg border-l border-t border-[#d6a65b]/40" />
                <span className="pointer-events-none absolute right-1 bottom-1 h-5 w-5 rounded-br-lg border-r border-b border-[#d6a65b]/40" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional: boost overlay (যদি Wheel বুস্ট স্পন করে) */}
      <div className="pointer-events-none absolute inset-0">
        {activeBoosts?.map((b: Boost) => {
          const rect = overlayRef.current?.getBoundingClientRect();
          const tile = tileRefs.current[b.itemId];
          if (!rect || !tile) return null;

          const r = tile.getBoundingClientRect();
          const tx = r.left - rect.left + r.width / 2;
          const ty = r.top - rect.top + r.height / 2;
          const cx = rect.width / 2;
          const cy = rect.height / 2;

          const style: React.CSSProperties = {
            left: tx,
            top: ty,
            ["--tx" as any]: `${cx - tx}px`,
            ["--ty" as any]: `${cy - ty}px`,
          };

          // 50×+, 80× হলে গোল্ড; নইলে গ্রিন
          const toneClass = b.value >= 50 ? "boost-gold" : "boost-green";

          return (
            <div key={b.id} className={`boost-chip ${toneClass}`} style={style}>
              ×{b.value}
            </div>
          );
        })}
      </div>

      <div className="h-3 sm:h-4" />

      {/* Animations */}
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

        /* ── BOOST: glowing + pulse + halo ─────────────────────────────── */
        .boost-chip {
          position: absolute;
          left: 0;
          top: 0;
          transform: translate(
              calc(-50% + var(--tx, 0px)),
              calc(-50% + var(--ty, 0px))
            )
            scale(0.6);
          opacity: 0;
          padding: 6px 10px;
          border-radius: 9999px;
          font-weight: 900;
          font-size: 12px;
          color: #0a2414;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.25);
          animation: boost-in 650ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards,
            glowPulse 2.2s ease-in-out 0.65s infinite alternate;
          z-index: 30;
        }
        /* Green tone (default) */
        .boost-chip.boost-green {
          background: radial-gradient(
            circle at 30% 30%,
            #c8ffdf 0%,
            #7ef5b1 35%,
            #36d67a 65%,
            #1fb968 100%
          );
          border-color: rgba(46, 191, 107, 0.6);
          box-shadow: 0 0 0 1px rgba(46, 191, 107, 0.35) inset,
            0 8px 22px rgba(0, 0, 0, 0.35), 0 0 18px rgba(46, 191, 107, 0.55);
          filter: drop-shadow(0 0 12px rgba(46, 191, 107, 0.45));
        }
        /* Gold tone (50×/80× etc.) */
        .boost-chip.boost-gold {
          color: #2b1800;
          background: radial-gradient(
            circle at 30% 30%,
            #fff3c4 0%,
            #ffe28a 35%,
            #ffc94a 65%,
            #ffb627 100%
          );
          border-color: rgba(255, 198, 77, 0.65);
          box-shadow: 0 0 0 1px rgba(255, 198, 77, 0.45) inset,
            0 8px 22px rgba(0, 0, 0, 0.35), 0 0 22px rgba(255, 208, 90, 0.65);
          filter: drop-shadow(0 0 14px rgba(255, 208, 90, 0.55));
        }
        /* Soft halo ring */
        .boost-chip::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: inherit;
          z-index: -1;
          filter: blur(8px);
          opacity: 0.7;
          background: radial-gradient(
            circle,
            rgba(82, 255, 170, 0.35),
            rgba(82, 255, 170, 0)
          );
        }
        .boost-chip.boost-gold::before {
          background: radial-gradient(
            circle,
            rgba(255, 224, 138, 0.45),
            rgba(255, 224, 138, 0)
          );
        }

        /* In animation */
        @keyframes boost-in {
          0% {
            opacity: 0;
            transform: translate(
                calc(-50% + var(--tx, 0px)),
                calc(-50% + var(--ty, 0px))
              )
              scale(0.6);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        /* Pulsing glow */
        @keyframes glowPulse {
          0% {
            filter: drop-shadow(0 0 10px rgba(80, 255, 180, 0.35));
          }
          100% {
            filter: drop-shadow(0 0 22px rgba(80, 255, 180, 0.65));
          }
        }
      `}</style>
    </div>
  );
};
/* ── Exports ────────────────────────────────────────────────────────────── */
export default CrazyLionBoard;
