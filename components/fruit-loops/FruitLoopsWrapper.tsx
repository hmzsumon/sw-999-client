// app/(fruit-loops)/page.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import BetControlBar from "@/components/fruit-loops/BetControlBar";
import BetPotCard from "@/components/fruit-loops/BetPotCard";
import Wheel from "@/components/fruit-loops/FruitLoopsWheel";
import FruitWinPop from "@/components/fruit-loops/FruitWinPop";
import SoundToggleButton from "@/components/fruit-loops/SoundToggleButton";
import { Sound } from "@/components/fruit-loops/soundManager";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CircleIconButton from "../game-ui/CircleIconButton";

/* ── Helpers ───────────────────────────────────────────────────────────── */
function toKey(v: any): string | undefined {
  if (!v) return undefined;
  const str =
    typeof v === "string"
      ? v
      : typeof v === "object"
      ? v.segKey || v.name || v.result || ""
      : "";
  const s = String(str).toLowerCase();
  if (s.includes("apple")) return "apple";
  if (s.includes("mango")) return "mango";
  if (s.includes("watermelon")) return "watermelon";
  return s.trim();
}

/* ── Watermark helper ──────────────────────────────────────────────────── */
const WM = (emoji: string, tint: string, dx = 80, dy = 150) => (
  <g opacity=".15" transform={`translate(${dx},${dy})`}>
    <circle cx="50" cy="50" r="40" fill={tint} />
    <text x="50" y="60" textAnchor="middle" fontSize="32">
      {emoji}
    </text>
  </g>
);

/* ── Component ─────────────────────────────────────────────────────────── */
export default function FruitLoopsWrapper() {
  const { fruitLoopsResults, winKey, spinId, soundOn } = useSelector(
    (s: any) => s.fruitLoops
  );

  const last = Array.isArray(fruitLoopsResults)
    ? fruitLoopsResults[0]
    : fruitLoopsResults;
  const winnerKey = toKey(last);
  const animKey = winKey ?? spinId;

  /* ── BG: প্রথম জেসচার-এ স্টার্ট ─────────────────────────────────────── */
  useEffect(() => {
    if (!soundOn) {
      Sound.stopBG();
      return;
    }
    const start = () => Sound.startBG();
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    window.addEventListener("touchstart", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
  }, [soundOn]);

  return (
    <div className="flex flex-col items-center justify-center relative h-full">
      {/* Wheel background: ক্লিক ব্লক না করার জন্য */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Wheel />
      </div>

      {/* Top-right controls (Sound + Close) */}
      <div className="absolute top-[0%] -right-4 p-2 z-30 ">
        <Link href="/dashboard">
          <CircleIconButton
            size={42}
            icon={
              <span className="font-extrabold" style={{ fontSize: 22 }}>
                <X size={28} strokeWidth={3} />
              </span>
            }
            colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          />
        </Link>
      </div>

      <div className="absolute top-[0%] -left-4 p-2 z-30 ">
        <SoundToggleButton />
      </div>

      {/* Pots */}
      <div className="absolute top-[15%] md:top-[30%] flex flex-col items-center justify-center w-full z-20">
        <div className="grid grid-cols-3 gap-1">
          <BetPotCard
            seg="apple"
            title="Apple"
            multiplier="X 2.9"
            pot={0}
            topLift={14}
            palette={{
              main: ["#FF9EA6", "#FF6B72", "#E93A44", "#C81E28", "#A7141C"],
              chip: ["#A5D6A7", "#4CAF50", "#2E7D32"],
              topTag: ["#FFE4E8", "#FF9FB1", "#FF4D62"],
              inner: ["#FFFFFF", "#FEFBFC", "#FAF2F3"],
            }}
            watermark={WM("🍎", "#ffcdd2")}
            isWinner={winnerKey === "apple"}
            winKey={animKey}
          />
          <BetPotCard
            seg="watermelon"
            title="Watermelon"
            multiplier="X 2.9"
            pot={0}
            topLift={16}
            watermark={WM("🍉", "#c8e6c9")}
            isWinner={winnerKey === "watermelon"}
            winKey={animKey}
          />
          <BetPotCard
            seg="mango"
            title="Mango"
            multiplier="X 2.9"
            pot={0}
            topLift={10}
            palette={{
              main: ["#FFE59A", "#FFD66E", "#FFC247", "#FFAB1E", "#FF9800"],
              chip: ["#4FC3F7", "#2196F3", "#1976D2"],
              topTag: ["#FFF0B3", "#FFD666", "#FFB000"],
              inner: ["#FFFFFF", "#FCFCFD", "#F2F6FF"],
            }}
            watermark={WM("🥭", "#FFE0B2")}
            isWinner={winnerKey === "mango"}
            winKey={animKey}
          />
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute flex bottom-20 md:bottom-0 w-full transform md:-translate-x-1/2 md:left-[50%] z-30">
        <BetControlBar />
      </div>

      {/* Win popup */}
      <FruitWinPop />
    </div>
  );
}
