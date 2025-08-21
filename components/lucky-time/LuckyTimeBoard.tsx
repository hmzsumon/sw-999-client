// components/lucky-time/LuckyTimeBoard.tsx
"use client";
import { useState } from "react";

type BoardItem = {
  id: number;
  multi: string;
  emoji: string;
  dig?: number;
};

const defaultItems: BoardItem[] = [
  { id: 1, multi: "x 200", emoji: "🐯" },
  { id: 2, multi: "x 300", emoji: "🦁" },
  { id: 3, multi: "x 50", emoji: "🐆" },
  { id: 4, multi: "x 2", emoji: "🐖", dig: 90 },
  { id: 5, multi: "x 2", emoji: "🐄" },
  { id: 6, multi: "x 2", emoji: "🐒" },
  { id: 7, multi: "x 10", emoji: "🐺" },
  { id: 8, multi: "x 5", emoji: "🐰", dig: 210 },
  { id: 9, multi: "x 3", emoji: "🦊", dig: 240 },
  { id: 10, multi: "x 50", emoji: "🐴" },
  { id: 11, multi: "x 100", emoji: "🐻" },
  { id: 12, multi: "x 500", emoji: "🐘" },
];

export default function LuckyTimeBoard({
  items = defaultItems,
  title = "Board",
}: {
  items?: BoardItem[];
  title?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full mx-auto max-w-[440px] sm:max-w-[620px] md:max-w-[900px] px-1">
      <div className="rounded-2xl p-1 sm:p-3 bg-[#3b2415] [box-shadow:inset_0_0_0_2px_#8a5a2d]">
        {/* মোবাইল: 4 কলাম, ডেস্কটপ: 6 */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1 sm:gap-3">
          {items.map((it) => {
            const isSelected = selected === it.id;
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
                `}
              >
                {/* inner panel */}
                <div className="absolute inset-[5px] sm:inset-[6px] rounded-lg bg-[#2f1d11] border border-[#8f5d31]/60" />

                {/* Watermark multiplier (top, faint) */}
                <div
                  className=" hidden sm:block
                    pointer-events-none absolute top-1.5 left-1/2 -translate-x-1/2
                    px-2 sm:px-3 rounded
                    text-[11px] sm:text-sm font-extrabold tracking-widest
                    text-[#b7ffcf]/55 bg-[#0e3a29]/20 border border-[#2ebf6b]/25
                    backdrop-blur-[1px] -rotate-3 select-none
                    shadow-[0_0_8px_rgba(0,0,0,.25)]
                    mix-blend-luminosity
                  "
                >
                  {it.multi}
                </div>

                {/* BIG emoji fills card */}
                <div className="relative z-10 h-full w-full flex items-center justify-center p-1">
                  <span
                    className="
                      leading-none
                      text-[clamp(42px,10vw,72px)]
                      sm:text-[clamp(56px,8vw,88px)]
                      drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]
                    "
                  >
                    {it.emoji}
                  </span>
                </div>

                {/* corner lines (decor) */}
                <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-tl-lg border-l border-t border-[#d6a65b]/40" />
                <span className="pointer-events-none absolute right-1 bottom-1 h-5 w-5 rounded-br-lg border-r border-b border-[#d6a65b]/40" />
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-3 sm:h-4" />
    </div>
  );
}
