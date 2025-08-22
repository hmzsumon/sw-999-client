// components/lucky-time/WinPop.tsx
"use client";

/* ── Win Pop: জেতার পর বড় ইমোজি + amount + শিমার/গ্লো + কনফেটি ───────── */
import { closeWinPop } from "@/redux/features/lucky-time/luckyTimeSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const fmt = (n: number) => n.toLocaleString();

export default function WinPop() {
  const dispatch = useDispatch();
  const { winToast } = useSelector((s: any) => s.luckyTime);
  const open = !!winToast?.open && !!winToast?.item;
  const item = winToast?.item;
  const win = winToast?.winAmount ?? 0;
  const bet = winToast?.betAmount ?? 0;

  // কাউন্ট-আপ অ্যানিমেশন
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!open) return;
    const target = win;
    const dur = Math.min(1500, Math.max(600, target / 10)); // ডায়নামিক স্পিড
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setShown(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, win]);

  // অটো-ক্লোজ
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => dispatch(closeWinPop()), 2600);
    return () => clearTimeout(id);
  }, [open, dispatch]);

  // কনফেটির জন্য 12টি “রশ্মি”
  const rays = useMemo(() => Array.from({ length: 12 }), []);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-live="polite"
    >
      {/* Dimmed backdrop + subtle noise */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={() => dispatch(closeWinPop())}
      />

      {/* Confetti rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {rays.map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 block w-0.5 h-28 origin-bottom opacity-0 confetti"
            style={{
              transform: `translate(-50%,-50%) rotate(${
                i * (360 / rays.length)
              }deg)`,
              animationDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>

      {/* Pop card */}
      <div
        className="relative w-64 z-[101] pop-card text-center px-6 py-5 sm:px-8 sm:py-6"
        role="dialog"
        aria-label="You Win"
      >
        {/* Shimmer border */}
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-emerald-400 opacity-80 blur-[6px]" />
        <div className="relative rounded-2xl bg-[#1b120a]/95 ring-1 ring-white/10 px-6 py-5 sm:px-8 sm:py-6">
          <div className="text-[13px] sm:text-sm tracking-widest font-extrabold text-amber-200/90 mb-1">
            YOU WIN!
          </div>

          <div className="leading-none mb-1">
            <span className="text-[56px] sm:text-[72px] drop-shadow-[0_3px_3px_rgba(0,0,0,.35)]">
              {item.emoji}
            </span>
          </div>

          <div className="text-amber-200/90 font-extrabold text-lg sm:text-xl">
            {item.name} <span className="text-white/90">×{item.multi}</span>
          </div>

          <div className="mt-2 text-[12px] sm:text-sm text-white/70">
            Bet: <b className="text-white">{fmt(bet)}</b>
          </div>

          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black text-emerald-300 drop-shadow-[0_3px_8px_rgba(0,0,0,.4)] win-amount">
            +{fmt(shown)}
          </div>

          <button
            onClick={() => dispatch(closeWinPop())}
            className="mt-3 sm:mt-4 inline-flex items-center justify-center px-4 py-1.5 rounded-lg
                       text-[12px] sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400
                       text-black shadow active:scale-[0.98]"
          >
            OK
          </button>
        </div>
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        /* Card pop-in + pulse */
        .pop-card {
          animation: popIn 420ms cubic-bezier(0.2, 0.9, 0.2, 1) 1,
            pulse 1.6s ease-in-out 1.2 both;
        }
        @keyframes popIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
            filter: blur(2px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        /* Confetti rays (gold/green alternating) */
        .confetti {
          background: linear-gradient(#ffe08a, #ffd042);
          border-radius: 9999px;
          animation: ray 700ms ease-out forwards;
          box-shadow: 0 0 12px rgba(255, 221, 100, 0.35);
        }
        .confetti:nth-child(odd) {
          background: linear-gradient(#b6ffcc, #53e38b);
          box-shadow: 0 0 12px rgba(83, 227, 139, 0.35);
        }
        @keyframes ray {
          0% {
            transform: translate(-50%, -40%) scaleY(0.2);
            opacity: 0;
          }
          55% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -120%) scaleY(1);
            opacity: 0;
          }
        }

        /* Amount flicker glow */
        .win-amount {
          text-shadow: 0 0 10px rgba(80, 255, 180, 0.5),
            0 0 22px rgba(80, 255, 180, 0.35);
          animation: amountGlow 1.2s ease-in-out 1 both;
        }
        @keyframes amountGlow {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
          100% {
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
}
