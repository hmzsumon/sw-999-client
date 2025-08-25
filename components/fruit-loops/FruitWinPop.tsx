// components/fruit-loops/FruitWinPop.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { closeWinPop } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sound } from "./soundManager";

/* ── Pot palettes (পটভেদে রঙ/গ্রেডিয়েন্ট) ───────────────────────────── */
const PALETTES = {
  apple: {
    main: ["#FF9EA6", "#FF6B72", "#E93A44", "#C81E28", "#A7141C"],
    text: "#fff",
  },
  watermelon: {
    main: ["#B9FF73", "#A9FB55", "#87EB3E", "#6CD733", "#59C62A"],
    text: "#0b3a08",
  },
  mango: {
    main: ["#FFE59A", "#FFD66E", "#FFC247", "#FFAB1E", "#FF9800"],
    text: "#2a1900",
  },
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
const potIdToKey = (id: any) =>
  Number(id) === 1 ? "apple" : Number(id) === 2 ? "watermelon" : "mango";
const titleToEmoji = (t: string) =>
  t.includes("apple") ? "🍎" : t.includes("mango") ? "🥭" : "🍉";

/* ── Component ─────────────────────────────────────────────────────────── */
export default function FruitWinPop() {
  /* ── Store ──────────────────────────────────────────────────────────── */
  const dispatch = useDispatch();
  const { winToast, fruitLoopsResults, winKey, soundOn } = useSelector(
    (s: any) => s.fruitLoops || {}
  );

  const open = !!winToast?.open;
  const potId = winToast?.potId;
  const winAmount = Number(winToast?.winAmount || 0);

  // ফল/ইমোজি resolve
  const lastRes = Array.isArray(fruitLoopsResults)
    ? fruitLoopsResults[0]
    : fruitLoopsResults;

  const fruitKey =
    (lastRes?.name && potId && potIdToKey(potId)) || potIdToKey(potId || 2);

  const emoji =
    lastRes?.emoji ||
    titleToEmoji(String(lastRes?.name || fruitKey).toLowerCase());

  const pal =
    PALETTES[fruitKey as keyof typeof PALETTES] || PALETTES.watermelon;

  /* ── Local: coin blast ──────────────────────────────────────────────── */
  const [blastIds, setBlastIds] = useState<number[]>([]);

  useEffect(() => {
    if (!open) return;

    // ✅ জিতলেই সাউন্ড: big (multi ≥ 3) না হলে সাধারণ win
    if (soundOn) {
      const big = Number(lastRes?.multi || 0) >= 3;
      Sound.play(big ? "big" : "win");
    }

    const batch = Date.now();
    setBlastIds(Array.from({ length: 34 }, (_, i) => batch + i));

    const t = setTimeout(() => dispatch(closeWinPop()), 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, winKey]);

  if (!open) return null;

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Overlay (click to close) */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => dispatch(closeWinPop())}
      />

      {/* Popup card */}
      <div className="relative z-10 w-[90%] max-w-[420px]">
        <div
          className="relative rounded-3xl p-5 shadow-2xl overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${pal.main[0]} 0%, ${pal.main[2]} 55%, ${pal.main[4]} 100%)`,
            border: "2px solid rgba(255,255,255,.35)",
          }}
        >
          {/* Top gloss */}
          <div
            className="absolute left-0 right-0 h-24 top-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.42), rgba(255,255,255,0))",
            }}
          />

          {/* Emoji dance */}
          <div className="relative flex flex-col items-center text-center">
            <div
              className="select-none"
              style={{
                fontSize: 72,
                textShadow: "0 6px 18px rgba(0,0,0,.25)",
                animation: "fruitDance 1200ms ease-in-out infinite",
              }}
              aria-label="winner-emoji"
            >
              {emoji}
            </div>

            <div
              className="mt-1 font-extrabold"
              style={{
                color: pal.text,
                fontSize: 28,
                letterSpacing: ".03em",
                textShadow: "0 2px 8px rgba(0,0,0,.25)",
                animation: "titlePop 900ms ease 1",
              }}
            >
              YOU WIN!
            </div>

            <div
              className="mt-1 font-semibold"
              style={{
                color: pal.text,
                fontSize: 16,
                opacity: 0.92,
              }}
            >
              {fruitKey.toUpperCase()}
            </div>

            <div
              className="mt-3 px-4 py-2 rounded-full font-black"
              style={{
                color: "#fff",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.15))",
                border: "1px solid rgba(255,255,255,.35)",
                textShadow: "0 2px 8px rgba(0,0,0,.45)",
                letterSpacing: ".02em",
                filter: "drop-shadow(0 8px 18px rgba(0,0,0,.3))",
              }}
            >
              +{winAmount.toFixed(2)}
            </div>
          </div>

          {/* Coin blast */}
          <div className="pointer-events-none absolute inset-0">
            {blastIds.map((id, i) => {
              const angle =
                (i / blastIds.length) * 360 + (Math.random() * 24 - 12);
              const dist = 120 + Math.random() * 70;
              const dur = 900 + Math.random() * 700;
              const size = 16 + Math.random() * 12;
              const x = Math.cos((angle * Math.PI) / 180) * dist;
              const y = Math.sin((angle * Math.PI) / 180) * dist;
              const delay = i * 15;
              return (
                <span
                  key={id}
                  className="absolute will-change-transform select-none"
                  style={
                    {
                      left: "50%",
                      top: "52%",
                      transform: "translate(-50%, -50%)",
                      fontSize: `${size}px`,
                      animation: `coinBlast ${dur}ms cubic-bezier(.2,.8,.2,1) ${delay}ms forwards`,
                      // @ts-ignore
                      "--tx": `${x}px`,
                      // @ts-ignore
                      "--ty": `${y}px`,
                    } as React.CSSProperties
                  }
                >
                  🪙
                </span>
              );
            })}
          </div>

          {/* Close hint */}
          <div
            className="absolute right-3 top-2 text-white/80 text-xs"
            style={{ textShadow: "0 1px 3px rgba(0, 0, 0, .5)" }}
          >
            tap to close
          </div>
        </div>
      </div>

      {/* ── Scoped Styles ───────────────────────────────────────────────── */}
      <style jsx>{`
        @keyframes fruitDance {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-6px) rotate(-12deg) scale(1.08);
          }
          50% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          75% {
            transform: translateY(-6px) rotate(12deg) scale(1.08);
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }
        @keyframes titlePop {
          0% {
            transform: scale(0.9);
            letter-spacing: 0.02em;
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
            letter-spacing: 0.06em;
            opacity: 1;
          }
          100% {
            transform: scale(1);
            letter-spacing: 0.03em;
            opacity: 1;
          }
        }
        @keyframes coinBlast {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(0, 0) scale(0.8)
              rotate(0deg);
            filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty))
              scale(1.15) rotate(200deg);
            filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35));
          }
        }
      `}</style>
    </div>
  );
}
