import React from "react";

const PurpleHeader: React.FC = () => {
  return (
    <main className="min-h-screen flex items-start justify-center p-3 sm:p-4 md:p-6 bg-[#140124]">
      {/* Outer frame (soft purple/pink glow) */}
      <div className="relative w-full max-w-[1280px] p-[8px] sm:p-[10px] rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-[linear-gradient(180deg,rgba(255,170,255,.45),rgba(255,0,136,.45))] [box-shadow:0_6px_28px_rgba(255,0,136,.18),0_0_36px_rgba(215,107,255,.25)]">
        {/* Inner header (pressed look) */}
        <header className="relative rounded-[18px] sm:rounded-[20px] md:rounded-[22px] overflow-visible bg-[linear-gradient(180deg,#D76BFF_0%,#9139E9_18%,#4D168A_65%,#34086D_100%)] ring-1 ring-inset ring-white/10 [box-shadow:inset_12px_12px_26px_rgba(0,0,0,.55),inset_-10px_-10px_24px_rgba(255,170,255,.10),inset_0_-22px_40px_rgba(0,0,0,.45),inset_0_8px_26px_rgba(255,170,255,.18)] min-h-[220px] md:h-[140px]">
          {/* top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-[linear-gradient(180deg,rgba(255,170,255,.55),rgba(255,170,255,0))] opacity-90"></div>
          {/* bottom pink glow line */}
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-[6px] bg-[linear-gradient(90deg,transparent,rgba(255,0,136,.9),transparent)] blur-[2px]"></div>
          {/* underglow */}
          <div className="pointer-events-none absolute -bottom-[6px] left-0 right-0 h-[16px] bg-[radial-gradient(70%_120%_at_50%_100%,rgba(255,0,136,.55),transparent)] opacity-80"></div>

          {/* Content: grid for responsiveness */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-6 py-3 md:py-0 items-center">
            {/* BOX 1: FREE SPIN */}
            <div className="relative p-[6px] sm:p-[7px] md:p-[8px] rounded-[14px] sm:rounded-[16px] bg-[linear-gradient(180deg,#FFE26A_0%,#FF9D00_55%,#FF4B00_100%)] [box-shadow:0_0_8px_rgba(255,184,0,.55),0_0_18px_rgba(255,89,0,.35)]">
              <div className="relative h-[60px] sm:h-[72px] md:h-[80px] w-full rounded-[10px] sm:rounded-[12px] overflow-visible bg-[linear-gradient(180deg,#2a0153_0%,#3a016a_100%)] ring-1 ring-inset ring-yellow-100/50 [box-shadow:inset_0_0_9px_rgba(255,210,90,.65)] flex items-center">
                <span className="text-white font-extrabold tracking-widest text-lg sm:text-xl md:text-2xl pl-4 sm:pl-6">
                  FREE SPIN:
                </span>
                {/* small flare */}
                <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[radial-gradient(closest-side,white,rgba(255,255,150,.95),rgba(255,180,0,.55),transparent)] blur-[1.5px] sm:blur-[2px] opacity-90"></span>
              </div>
            </div>

            {/* BOX 2: Lightning */}
            <div className="relative p-[6px] sm:p-[7px] md:p-[8px] rounded-[14px] sm:rounded-[16px] bg-[linear-gradient(180deg,#FFE26A_0%,#FF9D00_55%,#FF4B00_100%)] [box-shadow:0_0_8px_rgba(255,184,0,.55),0_0_18px_rgba(255,89,0,.35)]">
              <div className="relative h-[60px] sm:h-[72px] md:h-[80px] w-full rounded-[10px] sm:rounded-[12px] overflow-visible bg-[linear-gradient(180deg,#2a0153_0%,#3a016a_100%)] ring-1 ring-inset ring-yellow-100/50 [box-shadow:inset_0_0_9px_rgba(255,210,90,.65)] flex items-center justify-center">
                {/* Lightning icon */}
                <svg
                  viewBox="0 0 64 64"
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 -mt-1 sm:-mt-2 md:-mt-4 drop-shadow-[0_6px_10px_rgba(0,0,0,.45)]"
                >
                  <defs>
                    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFF36A" />
                      <stop offset="55%" stopColor="#FFD14A" />
                      <stop offset="100%" stopColor="#FF9C00" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M36 2 10 38h14L28 62l26-38H40L36 2Z"
                    fill="url(#lg)"
                    stroke="#E77700"
                    strokeWidth="2"
                  />
                  <path
                    d="M22 38 36 18"
                    stroke="white"
                    strokeOpacity=".7"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>

            {/* BOX 3: Coins */}
            <div className="relative p-[6px] sm:p-[7px] md:p-[8px] rounded-[14px] sm:rounded-[16px] bg-[linear-gradient(180deg,#FFE26A_0%,#FF9D00_55%,#FF4B00_100%)] [box-shadow:0_0_8px_rgba(255,184,0,.55),0_0_18px_rgba(255,89,0,.35)]">
              <div className="relative h-[60px] sm:h-[72px] md:h-[80px] w-full rounded-[10px] sm:rounded-[12px] overflow-visible bg-[linear-gradient(180deg,#2a0153_0%,#3a016a_100%)] ring-1 ring-inset ring-yellow-100/50 [box-shadow:inset_0_0_9px_rgba(255,210,90,.65)] flex items-center justify-center">
                {/* Coins */}
                <svg
                  viewBox="0 0 96 64"
                  className="w-14 h-10 sm:w-[68px] sm:h-[46px] md:w-[78px] md:h-[52px] -mt-1 sm:-mt-2 md:-mt-3 drop-shadow-[0_6px_10px_rgba(0,0,0,.45)]"
                >
                  <defs>
                    <linearGradient id="coin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFF36A" />
                      <stop offset="60%" stopColor="#FFB300" />
                      <stop offset="100%" stopColor="#FF8A00" />
                    </linearGradient>
                  </defs>
                  {/* back coin */}
                  <ellipse
                    cx="54"
                    cy="30"
                    rx="20"
                    ry="16"
                    fill="url(#coin)"
                    stroke="#E77700"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="54"
                    cy="30"
                    rx="12"
                    ry="9"
                    fill="none"
                    stroke="#FFDA62"
                    strokeWidth="3"
                    opacity=".8"
                  />
                  {/* front coin */}
                  <ellipse
                    cx="38"
                    cy="38"
                    rx="22"
                    ry="17"
                    fill="url(#coin)"
                    stroke="#E77700"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="38"
                    cy="38"
                    rx="13"
                    ry="10"
                    fill="none"
                    stroke="#FFDA62"
                    strokeWidth="3"
                    opacity=".9"
                  />
                </svg>
              </div>
            </div>
          </div>
        </header>
      </div>
    </main>
  );
};

export default PurpleHeader;
