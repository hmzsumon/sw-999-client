"use client";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MotionDiv = dynamic(
  async () => {
    const mod = await import("framer-motion");
    return mod.motion.div;
  },
  { ssr: false }
);

// ---- Types ----
type Game = {
  id: string;
  title: string;
  image: string; // full URL or /public path
  provider?: string; // e.g., Evolution, BNG, PG, JILI
  badge?: string; // e.g., "1 Line"
  isFavorite?: boolean;
  link?: string; // optional link to game
};

// ---- Demo data (replace with your own) ----
const demoGames: Game[] = [
  {
    id: "g1",
    title: "High Flyer",
    image: "/games/game_1.png",
    provider: "PRAGMATIC PLAY",
    isFavorite: true,
    link: "/lucky-wheel",
  },
  {
    id: "g2",
    title: "Mega Wheel",
    image: "/games/game_2.png",
    provider: "Evolution",
    isFavorite: true,
    link: "/fruit-loops",
  },
  {
    id: "g3",
    title: "Classic 777",
    image: "/games/game_3.png",
    provider: "BT Gaming",
    link: "/lucky-time",
  },
  {
    id: "g4",
    title: "Aztec Treasures",
    image: "/games/game_4.png",
    provider: "PG",
    link: "/dashboard",
  },
  {
    id: "g5",
    title: "Coin Up",
    image: "/games/game_5.png",
    provider: "BNG",
    isFavorite: true,
    link: "/dashboard",
  },
  {
    id: "g6",
    title: "Clover Coins 3x3",
    image: "/games/game_6.png",
    provider: "JILI",
    badge: "1 Line",
    link: "/dashboard",
  },
];

// ---- Card component ----
function GameCard({ game }: { game: Game }) {
  return (
    <Link href={game.link ?? "/dashboard"}>
      <MotionDiv
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl shadow-black/20"
      >
        <img
          src={game.image}
          alt={game.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />

        {/* soft inner gradient to match the reference look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

        {/* top-right favorite */}
        <button
          aria-label="favorite"
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur text-rose-600 shadow-sm"
        >
          <Heart className="h-4 w-4" fill="currentColor" />
        </button>

        {/* top-left small badge (optional) */}
        {game.badge ? (
          <div className="absolute left-2 top-2 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-emerald-950 shadow">
            {game.badge}
          </div>
        ) : null}

        {/* provider chip bottom-center */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <div className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
            {game.provider ?? "Provider"}
          </div>
        </div>
      </MotionDiv>
    </Link>
  );
}

// ---- Section header ----
function SectionHeader({
  onPrev,
  onNext,
}: {
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200 drop-shadow">
        HOT GAMES
      </h2>

      <div className="flex items-center gap-2">
        <button className="rounded-full bg-yellow-300/90 px-3 py-1 text-sm font-semibold text-emerald-950 shadow hover:bg-yellow-300">
          See All
        </button>
        <button
          aria-label="previous"
          onClick={onPrev}
          className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-900/60 ring-1 ring-white/10 hover:bg-emerald-800/70"
        >
          <ChevronLeft className="h-5 w-5 text-white/90" />
        </button>
        <button
          aria-label="next"
          onClick={onNext}
          className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-900/60 ring-1 ring-white/10 hover:bg-emerald-800/70"
        >
          <ChevronRight className="h-5 w-5 text-white/90" />
        </button>
      </div>
    </div>
  );
}

// ---- Main component ----
export default function HotGamesMenu({
  items = demoGames,
}: {
  items?: Game[];
}) {
  return (
    <section className="w-full rounded-3xl bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 p-4 text-white">
      <SectionHeader />

      {/* grid of cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {items.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </section>
  );
}
