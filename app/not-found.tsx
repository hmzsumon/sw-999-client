// app/not-found.tsx
"use client";

import RulesBtn from "@/components/game-ui/RulesBtn";
import Logo from "@/public/logo/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Smart not-found with staged UX:
 * 1) Loading progress animates and "sticks" at 99% (or 80% randomly)
 * 2) After a short delay, the Network Error message appears.
 */
export default function NotFound() {
  const router = useRouter();

  // Random stick target: 70% chance 99, else 80
  const targetRef = useRef<number>(Math.random() < 0.7 ? 99 : 80);

  const [progress, setProgress] = useState(0); // 0..target
  const [phase, setPhase] = useState<"loading" | "error">("loading"); // staged UI

  // Animate progress until it reaches the target, then show error after a delay
  useEffect(() => {
    let raf: number | null = null;
    let p = 0;
    const target = targetRef.current;

    const tick = () => {
      // ease-out towards the target but never exceed it
      const step = Math.max(0.08, (target - p) * 0.035);
      p = Math.min(target, p + step);
      setProgress(p);

      if (p < target) {
        raf = requestAnimationFrame(tick);
      } else {
        if (raf) cancelAnimationFrame(raf);
        // Wait a moment, then reveal the error UI
        const showErrorAfterMs = 1100;
        const t = setTimeout(() => setPhase("error"), showErrorAfterMs);
        return () => clearTimeout(t);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round(progress);

  // UI colors
  const barGradient =
    "linear-gradient(90deg, #fde68a 0%, #fbbf24 50%, #fb923c 100%)";
  const glassBg =
    "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(90% 60% at 50% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%), radial-gradient(80% 50% at 50% 80%, rgba(255,215,128,0.06), rgba(0,0,0,0) 60%), #0b0a0a",
      }}
      aria-live="polite"
      aria-busy={phase === "loading"}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.6)] p-6 relative overflow-hidden"
        style={{ background: glassBg }}
      >
        {/* subtle corner glow */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: "#fbbf24" }}
        />

        {/* Logo */}
        <div className="flex items-center justify-center mb-5 select-none">
          <Image
            src={Logo}
            alt="Logo"
            width={220}
            height={64}
            priority
            className="h-auto w-auto drop-shadow-[0_4px_16px_rgba(0,0,0,.35)]"
          />
        </div>

        {/* Progress strip */}
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-200"
            style={{ width: `${pct}%`, background: barGradient }}
          />
        </div>

        {/* Loading label */}
        <div className="mt-3 text-center text-sm font-semibold text-white/90 tabular-nums">
          {pct}% — {phase === "loading" ? "Loading…" : "Stalled"}
        </div>

        {/* Error block (revealed after loading stalls) */}
        <div
          className={`mt-5 text-center transition-opacity duration-500 ${
            phase === "error" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-white font-extrabold tracking-wide text-sm">
            Network Error
          </div>
          <div className="text-white/70 text-xs mt-1">
            The page exists, but the load stalled due to your device or network.
          </div>

          {/* Actions (use RulesBtn styling) */}
          <div className="mt-5 grid grid-cols-2 gap-1">
            {/* TRY AGAIN */}
            <RulesBtn
              size="lg"
              label="TRY AGAIN"
              colors={{ start: "#9cff6a", mid: "#6bdc46", end: "#36b12a" }}
              onClick={() => router.refresh()}
            />

            {/* GO BACK (styled like your example) */}
            <RulesBtn
              size="lg"
              label="GO BACK"
              colors={{ start: "#b37a11", mid: "#a36b0e", end: "#d59012" }}
              onClick={() => router.back()}
            />
          </div>

          {/* tiny hint */}
          <div className="mt-4 text-center text-[11px] text-white/35">
            Hint: connection stalled — please retry or change network.
          </div>
        </div>
      </div>
    </div>
  );
}
