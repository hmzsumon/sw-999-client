const PortBoard = () => {
  return (
    <div>
      {/* SIZE টিউন: w-[1017px] h-[474px] → আপনার মতো দিন */}
      <div className="relative w-[1017px] max-w-[95vw] h-[300px] rounded-[30px] overflow-hidden bg-[linear-gradient(180deg,#6FE9D1_0%,#45CFC7_22%,#2DB3BE_55%,#2AA497_78%,#2B9A8C_100%)] ring-1 ring-white/20 [box-shadow:inset_0_1px_0_rgba(255,255,255,.35),inset_0_-60px_90px_rgba(0,0,0,.28),inset_0_0_40px_rgba(0,0,0,.10),0_18px_40px_rgba(0,0,0,.35)]">
        {/* টপ-লেফট গ্লসি শিন */}
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_110%_at_0%_0%,rgba(255,255,255,.45)_0%,rgba(255,255,255,.18)_34%,transparent_62%)]" />

        {/* টপ-রাইট সফট হাইলাইট */}
        <span className="pointer-events-none absolute -top-10 right-0 w-[48%] h-[42%] bg-[radial-gradient(60%_80%_at_85%_0%,rgba(255,255,255,.22),transparent_70%)]" />

        {/* বটম ভিনিয়েট/ডার্ক ব্যান্ড */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(0deg,rgba(0,0,0,.28),rgba(0,0,0,0))]" />

        {/* এজ হাইলাইট (soft inner stroke) */}
        <span className="pointer-events-none absolute inset-0 rounded-[32px] [box-shadow:inset_0_0_0_2px_rgba(255,255,255,.16),inset_0_0_120px_rgba(64,225,200,.10)]" />

        {/* গ্রেইন/ব্লুম-টাইপ নরম টেক্সচার (ঐচ্ছিক) */}
        <span className="pointer-events-none absolute inset-0 opacity-[.08] bg-[radial-gradient(1200px_600px_at_50%_120%,#ffffff_0%,transparent_60%)] mix-blend-overlay" />
      </div>
    </div>
  );
};

export default PortBoard;
