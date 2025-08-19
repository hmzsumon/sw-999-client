const ChipBoard = () => {
  return (
    <div className="">
      <div className="relative w-full  h-[80px] sm:h-[92px] md:h-[110px] rounded-[20px] overflow-hidden bg-[linear-gradient(180deg,#c7ff63_0%,#aef842_30%,#87e737_60%,#6fd42f_80%,#56bf28_100%)] ring-1 ring-white/20 [box-shadow:inset_0_1px_0_rgba(255,255,255,.65),inset_0_-18px_28px_rgba(0,0,0,.18),inset_0_0_0_1px_rgba(255,255,255,.12),0_12px_24px_rgba(0,0,0,.28)]">
        {/* Top glossy sheen + left-corner bloom */}
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_3%_6%,rgba(255,255,255,.55),rgba(255,255,255,.20)_36%,transparent_62%),linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0))]" />

        {/* Soft inner rim highlight (beveled edge) */}
        <span className="pointer-events-none absolute inset-[3px] rounded-[17px] [box-shadow:inset_0_0_0_2px_rgba(255,255,255,.20),inset_0_0_80px_rgba(255,255,255,.06)]" />

        {/* Bright lime line near bottom */}
        <span className="pointer-events-none absolute inset-x-2 bottom-[10px] h-[3px] bg-[linear-gradient(90deg,transparent,#e6ff9a,transparent)] opacity-80 blur-[.5px]" />

        {/* Very light bloom/grain (optional) */}
        <span className="pointer-events-none absolute inset-0 opacity-[.06] bg-[radial-gradient(900px_500px_at_50%_120%,#ffffff,transparent_60%)] mix-blend-overlay" />

        {/* Content slot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-black/60 font-semibold">PLAY</span>
        </div>
      </div>
    </div>
  );
};

export default ChipBoard;
