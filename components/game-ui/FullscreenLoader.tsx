// components/ui/FullscreenLoader.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  /** Control visibility manually (optional). If omitted, it auto-hides on completion. */
  show?: boolean;
  /** Image/asset URLs to preload and show real progress. */
  assets?: string[];
  /** Minimum time to keep loader visible (ms) to avoid flash. */
  minDurationMs?: number;
  /** Called when loading finishes (all assets loaded + min duration). */
  onDone?: () => void;
  /** Optional brand/logo node to show above the bar. */
  logo?: React.ReactNode;
  /** z-index for the overlay. */
  zIndex?: number;
  /** Simulate progress even while real assets load to keep smooth. */
  smooth?: boolean;
};

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

export default function FullscreenLoader({
  show,
  assets = [],
  minDurationMs = 1200,
  onDone,
  logo,
  zIndex = 9999,
  smooth = true,
}: Props) {
  const [internalShow, setInternalShow] = useState<boolean>(true);
  const [rawProgress, setRawProgress] = useState<number>(0); // 0..100
  const [startedAt, setStartedAt] = useState<number>(() => performance.now());
  const rafRef = useRef<number | null>(null);
  const cancelRef = useRef<boolean>(false);

  const total = assets.length;
  const progress = clamp(rawProgress);

  // Start preloading
  useEffect(() => {
    cancelRef.current = false;
    setStartedAt(performance.now());
    setRawProgress(0);

    if (total === 0) {
      // No assets → just simulate to 100 after minDuration
      const done = () => {
        const elapsed = performance.now() - startedAt;
        const wait = Math.max(0, minDurationMs - elapsed);
        setTimeout(() => {
          setRawProgress(100);
          onDone?.();
          setInternalShow(false);
        }, wait);
      };
      if (smooth) {
        // smooth simulate
        let p = 0;
        const tick = () => {
          if (cancelRef.current) return;
          p = clamp(p + Math.random() * 10, 0, 95); // crawl to 95
          setRawProgress(p);
          if (p < 95) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            done();
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      } else {
        done();
      }
      return () => {
        cancelRef.current = true;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    // With assets: real progress + optional smoothing
    let loaded = 0;
    const update = () => {
      const percent = (loaded / total) * 100;
      setRawProgress((prev) =>
        smooth ? Math.max(prev, prev + (percent - prev) * 0.3) : percent
      );
    };

    const onAssetDone = () => {
      loaded += 1;
      update();
      if (loaded >= total) {
        const finalize = () => {
          const elapsed = performance.now() - startedAt;
          const wait = Math.max(0, minDurationMs - elapsed);
          setTimeout(() => {
            setRawProgress(100);
            onDone?.();
            setInternalShow(false);
          }, wait);
        };
        if (smooth) {
          // finish easing to ~98 then finalize
          let p = progress;
          const ease = () => {
            if (cancelRef.current) return;
            p = p + (100 - p) * 0.2;
            setRawProgress(p);
            if (p < 99.2) {
              rafRef.current = requestAnimationFrame(ease);
            } else {
              finalize();
            }
          };
          rafRef.current = requestAnimationFrame(ease);
        } else {
          finalize();
        }
      }
    };

    const imgs: HTMLImageElement[] = [];
    assets.forEach((src) => {
      const img = new Image();
      img.onload = onAssetDone;
      img.onerror = onAssetDone; // count errors as done so loader doesn't hang
      // cache-bust is optional; uncomment if you really need fresh loads:
      // const bust = src.includes("?") ? "&_t=" : "?_t=";
      // img.src = src + bust + Date.now();
      img.src = src;
      imgs.push(img);
    });

    return () => {
      cancelRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // No need to revoke <img>, GC will handle.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, minDurationMs, smooth, assets.join("|")]);

  const visible = show ?? internalShow;

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0b0a0a] bg-[radial-gradient(90%_60%_at_50%_30%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%),radial-gradient(80%_50%_at_50%_80%,rgba(255,215,128,0.06),rgba(0,0,0,0)_60%)] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md px-6 py-7 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.6)]">
        {/* Logo / Title */}
        <div className="mb-5 flex items-center justify-center text-white">
          {logo ?? (
            <div className="font-extrabold tracking-widest text-lg">
              LOADING…
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 transition-[width] duration-200"
            style={{ width: `${progress.toFixed(0)}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="mt-3 text-center text-sm font-semibold text-white/90 tabular-nums">
          {progress.toFixed(0)}%
        </div>

        {/* Tiny helper text */}
        <div className="mt-1 text-center text-xs text-white/50">
          Preparing assets…
        </div>
      </div>
    </div>
  );
}
