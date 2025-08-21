// components/lucky-time/ChipsBar.tsx
"use client";
import { useState } from "react";

const chips = [1, 2, 5, 10, 50];

export default function ChipsBar() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full max-w-md mx-auto flex justify-center gap-2 sm:gap-3 mb-3">
      {chips.map((value) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center font-bold
              transition active:scale-[0.95]
              ${
                isActive
                  ? "bg-yellow-400 text-black border-yellow-600 shadow-[0_0_12px_rgba(250,204,21,.7)]"
                  : "bg-[#2b1a0f] text-yellow-300 border-yellow-500 hover:border-yellow-300"
              }
            `}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
