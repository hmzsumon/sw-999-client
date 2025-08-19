import React from "react";

type WatermelonPotProps = {
  pot?: number;
  mine?: number;
  title?: string;
  multiplier?: number | string;
  className?: string;
};

const WatermelonPot: React.FC<WatermelonPotProps> = ({
  pot = 0,
  mine = 0,
  title = "Watermelon",
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
            {/* main green body */}
            <linearGradient id="wm-gMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B9FF73" />
              <stop offset="22%" stopColor="#A9FB55" />
              <stop offset="58%" stopColor="#87EB3E" />
              <stop offset="86%" stopColor="#6CD733" />
              <stop offset="100%" stopColor="#59C62A" />
            </linearGradient>

            {/* inner rim highlight */}
            <linearGradient id="wm-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".28" />
              <stop offset="100%" stopColor="#fff" stopOpacity=".14" />
            </linearGradient>

            {/* glossy top overlay */}
            <linearGradient id="wm-glossTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".42" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* purple chip */}
            <linearGradient id="wm-chip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A25BFF" />
              <stop offset="55%" stopColor="#842FF4" />
              <stop offset="100%" stopColor="#6A17DA" />
            </linearGradient>
            <linearGradient id="wm-chipGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".75" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* inner white panel */}
            <linearGradient id="wm-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FBFBFC" />
              <stop offset="100%" stopColor="#EEF6EF" />
            </linearGradient>

            {/* top pill tag (lighter green) */}
            <linearGradient id="wm-topTag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4FFA3" />
              <stop offset="45%" stopColor="#B8FB6E" />
              <stop offset="100%" stopColor="#8BE241" />
            </linearGradient>
            <linearGradient id="wm-topTagGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* shadows/glow */}
            <filter
              id="wm-softShadow"
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
            <filter
              id="wm-innerShadow"
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
                values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0`}
              />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
            <filter
              id="wm-edgeGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
          </defs>

          {/* ===== card base ===== */}
          <rect
            x="2"
            y="2"
            width="268"
            height="342"
            rx="26"
            fill="url(#wm-gMain)"
            filter="url(#wm-softShadow)"
          />
          <rect
            x="5"
            y="4"
            width="262"
            height="96"
            rx="22"
            fill="url(#wm-glossTop)"
          />
          <rect
            x="4"
            y="4"
            width="264"
            height="338"
            rx="24"
            fill="none"
            stroke="url(#wm-rim)"
            strokeWidth="2"
            opacity=".9"
          />

          {/* ========= TOP (exact-like) ========= */}
          <g filter="url(#wm-softShadow)">
            {/* subtle pill shadow */}
            <ellipse
              cx="136"
              cy="18"
              rx="74"
              ry="13"
              fill="#000"
              opacity=".12"
            />
            {/* side caps */}
            <circle
              cx="66"
              cy="15"
              r="12"
              fill="url(#wm-topTag)"
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <circle
              cx="206"
              cy="15"
              r="12"
              fill="url(#wm-topTag)"
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            {/* main pill */}
            <rect
              x="66"
              y="-5"
              width="140"
              height="40"
              rx="20"
              fill="url(#wm-topTag)"
              stroke="#fff"
              strokeOpacity=".45"
              strokeWidth="1"
            />
            {/* pill gloss */}
            <rect
              x="70"
              y="-3"
              width="132"
              height="16"
              rx="10"
              fill="url(#wm-topTagGloss)"
              opacity=".9"
            />
            {/* label */}
            <text
              x="136"
              y="22"
              textAnchor="middle"
              fontSize="18"
              fontFamily="Poppins, system-ui, sans-serif"
              fontStyle="italic"
              fontWeight="600"
              fill="#2a5d0e"
            >
              {title}
            </text>
          </g>

          {/* multiplier chip */}
          <g filter="url(#wm-softShadow)">
            <rect
              x="92"
              y="64"
              width="88"
              height="38"
              rx="19"
              fill="#000"
              opacity=".18"
            />
            <rect
              x="96"
              y="68"
              width="80"
              height="30"
              rx="15"
              fill="url(#wm-chip)"
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <rect
              x="99"
              y="70"
              width="74"
              height="12"
              rx="8"
              fill="url(#wm-chipGloss)"
            />
            <text
              x="136"
              y="89"
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
          <g filter="url(#wm-softShadow)">
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="url(#wm-inner)"
              filter="url(#wm-innerShadow)"
            />
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="none"
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="2"
            />
          </g>

          {/* faint watermelon watermark */}
          <g opacity=".17" transform="translate(74,145)">
            <circle cx="60" cy="60" r="46" fill="#8cd66d" />
            <g stroke="#fff" strokeOpacity=".45" strokeWidth="6" fill="none">
              <path d="M60 16v88M16 60h88M28 30c12 10 38 10 52 0M28 90c12-10 38-10 52 0" />
            </g>
            <path
              d="M30 76a32 18 0 1 0 60 0 32 18 0 1 0-60 0Z"
              fill="#ffd2cf"
              stroke="#ff9aa0"
              strokeWidth="4"
            />
          </g>

          {/* ===== Pot / Divider / My ===== */}
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

          {/* crisp divider */}
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

          {/* ========= BOTTOM (exact-like) ========= */}
          <rect
            x="18"
            y="322"
            width="236"
            height="2"
            fill="#fff"
            opacity=".18"
          />
          <ellipse
            cx="136"
            cy="346"
            rx="78"
            ry="12"
            fill="#000"
            opacity=".22"
          />
          <g>
            <circle cx="88" cy="340" r="18" fill="url(#wm-gMain)" />
            <circle cx="136" cy="342" r="20" fill="url(#wm-gMain)" />
            <circle cx="184" cy="340" r="18" fill="url(#wm-gMain)" />
            <g opacity=".85" filter="url(#wm-edgeGlow)">
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
            <g opacity=".35">
              <circle cx="96" cy="330" r="2" fill="#fff" />
              <circle cx="136" cy="332" r="2.3" fill="#fff" />
              <circle cx="176" cy="330" r="2" fill="#fff" />
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

export default WatermelonPot;
