"use client";
import Image from "next/image";
import { gameMenuitems } from "./SidebarDesktop";

const GameMenu = () => {
  return (
    <div className="overflow-x-auto scrollbar-hide ">
      <div className="flex gap-2 w-max">
        {gameMenuitems.map((it, idx) => (
          <button
            key={idx}
            className="
                    shrink-0 
                    rounded-2xl px-2 py-1
                    flex  items-center justify-center text-center
                    snap-start
                    transition-transform hover:-translate-y-0.5
                    outline-none
                    "
            style={{
              background:
                "linear-gradient(180deg,#0b4b43 0%, #083d38 60%, #073331 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.45), 0 4px 10px rgba(0,0,0,.25)",
              border: "1px solid rgba(0,0,0,.25)",
            }}
          >
            <span className="relative w-9 h-9 mb-2">
              <Image
                src={it.icon}
                alt={it.label}
                fill
                sizes="36px"
                className="object-contain drop-shadow"
                priority={idx < 6}
              />
            </span>
            <span className="text-[13px] leading-tight font-semibold text-[#9fd6d0]">
              {it.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
