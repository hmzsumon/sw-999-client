import React from "react";

type MangoPotProps = {
  pot?: number;
  mine?: number;
  title?: string;
  multiplier?: number | string;
  className?: string;
};

const MangoPot: React.FC<MangoPotProps> = ({
  pot = 0,
  mine = 0,
  title = "Mango",
  multiplier = "X 2.9",
  className = "",
}) => {
  const fmt = (n: number) => n.toFixed(2);
  const midY = 207; // inner panel middle (113 + 188/2)

  return (
    <div className={className}>
      <div className="w-full h-[346px]">
        <svg
          viewBox="0 0 272 346"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ===== defs ===== */}
          <defs>
            {/* main body */}
            <linearGradient id="mp-gMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE09A" />
              <stop offset="18%" stopColor="#FFD067" />
              <stop offset="48%" stopColor="#FFB33B" />
              <stop offset="78%" stopColor="#FFA224" />
              <stop offset="100%" stopColor="#FF8D15" />
            </linearGradient>

            {/* inner rim highlight */}
            <linearGradient id="mp-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".28" />
              <stop offset="100%" stopColor="white" stopOpacity=".14" />
            </linearGradient>

            {/* glossy top */}
            <linearGradient id="mp-glossTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".42" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* purple chip */}
            <linearGradient id="mp-chip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A25BFF" />
              <stop offset="55%" stopColor="#842FF4" />
              <stop offset="100%" stopColor="#6A17DA" />
            </linearGradient>

            {/* chip top gloss */}
            <linearGradient id="mp-chipGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".65" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* inner panel */}
            <linearGradient id="mp-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="42%" stopColor="#FBFBFC" />
              <stop offset="100%" stopColor="#F1F6F0" />
            </linearGradient>

            {/* top tag gradient (slightly lighter) */}
            <linearGradient id="mp-topTag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE7A8" />
              <stop offset="36%" stopColor="#FFD068" />
              <stop offset="100%" stopColor="#FFB23B" />
            </linearGradient>

            {/* top tag gloss */}
            <linearGradient id="mp-topTagGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".55" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* soft shadow */}
            <filter
              id="mp-softShadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="10"
                floodColor="#000"
                floodOpacity=".35"
              />
            </filter>

            {/* inner shadow for white panel */}
            <filter
              id="mp-innerShadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite
                operator="arithmetic"
                k2="-1"
                k3="1"
                in2="SourceAlpha"
              />
              <feColorMatrix
                type="matrix"
                values={`0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 .34 0`}
              />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>

            {/* tiny glow */}
            <filter
              id="mp-edgeGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
          </defs>

          {/* ===== main orange rounded panel ===== */}
          <rect
            x="2"
            y="2"
            width="268"
            height="342"
            rx="26"
            fill="url(#mp-gMain)"
            filter="url(#mp-softShadow)"
          />
          {/* glossy top */}
          <rect
            x="5"
            y="4"
            width="262"
            height="96"
            rx="22"
            fill="url(#mp-glossTop)"
          />
          {/* inner rim */}
          <rect
            x="4"
            y="4"
            width="264"
            height="338"
            rx="24"
            fill="none"
            stroke="url(#mp-rim)"
            strokeWidth="2"
            opacity=".9"
          />

          {/* ======= TOP SECTION (exact-like) ======= */}
          {/* pill tag with side caps */}
          <g filter="url(#mp-softShadow)">
            {/* side round caps */}
            <circle
              cx="72"
              cy="17"
              r="10"
              fill="url(#mp-topTag)"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="17"
              r="10"
              fill="url(#mp-topTag)"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            {/* main pill */}
            <rect
              x="72"
              y="-3"
              width="128"
              height="40"
              rx="18"
              fill="url(#mp-topTag)"
              stroke="white"
              strokeOpacity=".45"
              strokeWidth="1"
            />
            {/* top gloss */}
            <rect
              x="75"
              y="-1"
              width="122"
              height="18"
              rx="12"
              fill="url(#mp-topTagGloss)"
              opacity=".9"
            />
            {/* label */}
            <text
              x="136"
              y="23"
              textAnchor="middle"
              fontSize="16"
              fontFamily="Poppins, system-ui, sans-serif"
              fontStyle="italic"
              fontWeight="600"
              fill="#714b02"
            >
              {title}
            </text>
          </g>

          {/* purple multiplier chip (with soft glow + gloss) */}
          <g filter="url(#mp-softShadow)">
            {/* glow behind */}
            <rect
              x="90"
              y="61"
              width="92"
              height="44"
              rx="22"
              fill="#000"
              opacity=".18"
            />
            {/* chip */}
            <rect
              x="94"
              y="68"
              width="84"
              height="30"
              rx="14"
              fill="url(#mp-chip)"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            {/* chip top gloss */}
            <rect
              x="97"
              y="70"
              width="78"
              height="12"
              rx="8"
              fill="url(#mp-chipGloss)"
              opacity=".85"
            />
            <text
              x="136"
              y="88"
              textAnchor="middle"
              fontSize="16"
              fontFamily="Baloo 2, system-ui, sans-serif"
              fontWeight="800"
              fill="#fff"
              letterSpacing=".08em"
            >
              {typeof multiplier === "number"
                ? `X ${multiplier}`
                : String(multiplier)}
            </text>
          </g>

          {/* ===== inner white content panel ===== */}
          <g filter="url(#mp-softShadow)">
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="url(#mp-inner)"
              filter="url(#mp-innerShadow)"
            />
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="none"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="2"
            />
          </g>

          {/* watermark: mango + slice + leaf (faint) */}
          <g opacity=".18" transform="translate(74,148)">
            <radialGradient id="mp-mg" cx="55%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFD4A8" />
              <stop offset="50%" stopColor="#FFB45C" />
              <stop offset="100%" stopColor="#FF8F2D" />
            </radialGradient>
            <ellipse cx="60" cy="58" rx="44" ry="36" fill="url(#mp-mg)" />
            <linearGradient id="mp-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9BE076" />
              <stop offset="100%" stopColor="#4EAF52" />
            </linearGradient>
            <path
              d="M70 22c18-8 36 2 38 8-18 8-36-2-38-8Z"
              fill="url(#mp-leaf)"
            />
            <linearGradient id="mp-slice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF1AD" />
              <stop offset="100%" stopColor="#FFD768" />
            </linearGradient>
            <ellipse
              cx="92"
              cy="82"
              rx="32"
              ry="24"
              fill="url(#mp-slice)"
              stroke="#FFC241"
              strokeWidth="4"
            />
            <g stroke="#FFE493" strokeWidth="4" opacity=".85">
              <path d="M72 82h40M72 92h40M72 72h40" />
              <path d="M82 64v36M92 60v44M102 64v36" />
            </g>
          </g>

          {/* ===== Pot/My text ===== */}
          <text
            x="136"
            y="180"
            textAnchor="middle"
            fontSize="18"
            fontFamily="Poppins, system-ui, sans-serif"
            fontWeight="600"
            fill="#000"
            fillOpacity=".85"
          >
            {`Pot: ${fmt(pot)}`}
          </text>

          {/* Divider (crisp, always visible) */}
          <g>
            <rect
              x="54"
              y={midY - 0.75}
              width="164"
              height="1.5"
              fill="#000"
              opacity=".45"
            />
            <rect
              x="54"
              y={midY - 1.2}
              width="164"
              height="0.8"
              fill="#fff"
              opacity=".22"
            />
          </g>

          <text
            x="136"
            y="240"
            textAnchor="middle"
            fontSize="20"
            fontFamily="Baloo 2, system-ui, sans-serif"
            fontWeight="800"
            fill="#7B1CF9"
          >
            {`My: ${fmt(mine)}`}
          </text>

          {/* ======= BOTTOM SECTION (exact-like) ======= */}
          {/* soft ground shadow for bumps */}
          <ellipse
            cx="136"
            cy="346"
            rx="76"
            ry="12"
            fill="#000"
            opacity=".22"
          />
          {/* three bumps */}
          <g>
            <circle cx="88" cy="340" r="18" fill="url(#mp-gMain)" />
            <circle cx="136" cy="342" r="20" fill="url(#mp-gMain)" />
            <circle cx="184" cy="340" r="18" fill="url(#mp-gMain)" />
            {/* glossy edge arcs */}
            <g opacity=".8" filter="url(#mp-edgeGlow)">
              <path
                d="M72 328a18 18 0 0 1 32 0"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M118 328a20 20 0 0 1 36 0"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M166 328a18 18 0 0 1 32 0"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="2"
                fill="none"
              />
            </g>
            {/* subtle top sparkle */}
            <g opacity=".35">
              <circle cx="96" cy="330" r="2" fill="#fff" />
              <circle cx="176" cy="330" r="2" fill="#fff" />
              <circle cx="136" cy="332" r="2.3" fill="#fff" />
            </g>
          </g>

          {/* tiny corner sparkles */}
          <circle cx="12" cy="334" r="2" fill="#fff" opacity=".7" />
          <circle cx="260" cy="16" r="3" fill="#fff" opacity=".7" />
        </svg>
      </div>
    </div>
  );
};

export default MangoPot;
