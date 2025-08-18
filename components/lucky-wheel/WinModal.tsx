"use client";

import Image from "next/image";
import { useEffect } from "react";

type WinModalProps = {
  open: boolean;
  amount?: number; // e.g. 250
  multiplier?: number; // e.g. 5
  bet?: number; // e.g. 50
  onClose: () => void;
  autoCloseMs?: number; // default 2400ms
};

export default function WinModal({
  open,
  amount = 0,
  multiplier,
  bet,
  onClose,
  autoCloseMs = 3000,
}: WinModalProps) {
  useEffect(() => {
    if (!open) return;

    // lock scroll + auto close + esc close
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(onClose, autoCloseMs);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, autoCloseMs]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-[min(92vw,720px)] aspect-[1141/754] drop-shadow-2xl">
        {/* ইমেজটি public/images/win_board.png এ রাখো */}
        <Image
          src="/images/lucky-wheel/win_board.png"
          alt="Win"
          fill
          priority
          className="object-contain pointer-events-none select-none rounded-2xl"
        />

        {/* amount টেক্সট – ইমেজের ভেতরের বক্সের উপর বসানো */}
        <div className="absolute left-1/3 top-[68%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-white text-2xl md:text-5xl font-extrabold drop-shadow">
            +{amount}
          </div>

          {multiplier !== undefined && bet !== undefined && (
            <div className="mt-1 text-white/90 text-sm md:text-base">
              {bet} × {multiplier}x
            </div>
          )}
        </div>

        {/* Close button (ঐচ্ছিক) */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black/40 hover:bg-black/55 text-white px-3 py-1 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
