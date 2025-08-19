import React from "react";

type ApplePotProps = {
  pot?: number;
  mine?: number;
  title?: string;
  multiplier?: number | string;
  className?: string;
};

const ApplePot: React.FC<ApplePotProps> = ({
  pot = 0,
  mine = 0,
  title = "Apple",
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
            {/* main red body */}
            <linearGradient id="ap-gMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9EA6" />
              <stop offset="18%" stopColor="#FF6B72" />
              <stop offset="50%" stopColor="#E93A44" />
              <stop offset="80%" stopColor="#C81E28" />
              <stop offset="100%" stopColor="#A7141C" />
            </linearGradient>

            {/* inner rim highlight */}
            <linearGradient id="ap-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".28" />
              <stop offset="100%" stopColor="white" stopOpacity=".14" />
            </linearGradient>

            {/* glossy top overlay */}
            <linearGradient id="ap-glossTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".42" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* purple chip */}
            <linearGradient id="ap-chip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A25BFF" />
              <stop offset="55%" stopColor="#842FF4" />
              <stop offset="100%" stopColor="#6A17DA" />
            </linearGradient>
            <linearGradient id="ap-chipGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".75" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* inner white panel (slightly pink) */}
            <linearGradient id="ap-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FFF4F6" />
              <stop offset="100%" stopColor="#F7EBEE" />
            </linearGradient>

            {/* top pill tag (lighter red) */}
            <linearGradient id="ap-topTag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC5CA" />
              <stop offset="45%" stopColor="#FF8A92" />
              <stop offset="100%" stopColor="#FF6B72" />
            </linearGradient>
            <linearGradient id="ap-topTagGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* shadows/glow */}
            <filter
              id="ap-softShadow"
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
              id="ap-innerShadow"
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
                values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .34 0`}
              />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
            <filter
              id="ap-edgeGlow"
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
            fill="url(#ap-gMain)"
            filter="url(#ap-softShadow)"
          />
          <rect
            x="5"
            y="4"
            width="262"
            height="96"
            rx="22"
            fill="url(#ap-glossTop)"
          />
          <rect
            x="4"
            y="4"
            width="264"
            height="338"
            rx="24"
            fill="none"
            stroke="url(#ap-rim)"
            strokeWidth="2"
            opacity=".9"
          />

          {/* ========= TOP (exact-like) ========= */}
          <g filter="url(#ap-softShadow)">
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
              fill="url(#ap-topTag)"
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <circle
              cx="206"
              cy="15"
              r="12"
              fill="url(#ap-topTag)"
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
              fill="url(#ap-topTag)"
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
              fill="url(#ap-topTagGloss)"
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
              fill="#5e0a0f"
            >
              {title}
            </text>
          </g>

          {/* multiplier chip */}
          <g filter="url(#ap-softShadow)">
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
              fill="url(#ap-chip)"
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
              fill="url(#ap-chipGloss)"
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
          <g filter="url(#ap-softShadow)">
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="url(#ap-inner)"
              filter="url(#ap-innerShadow)"
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

          {/* faint apple watermark */}
          <g opacity=".16" transform="translate(76,148)">
            {/* apple body */}
            <radialGradient id="ap-ap" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFD6D8" />
              <stop offset="55%" stopColor="#FF9AA1" />
              <stop offset="100%" stopColor="#FF6770" />
            </radialGradient>
            <path
              d="M60 35c12-16 36-12 44 6 9 21-6 51-44 51S15 62 24 41c7-16 28-22 36-6Z"
              fill="url(#ap-ap)"
            />
            {/* highlight */}
            <ellipse
              cx="78"
              cy="50"
              rx="14"
              ry="10"
              fill="#fff"
              opacity=".25"
            />
            {/* leaf */}
            <linearGradient id="ap-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A9E887" />
              <stop offset="100%" stopColor="#59B462" />
            </linearGradient>
            <path
              d="M58 22c16-10 36-4 40 4-16 10-36 4-40-4Z"
              fill="url(#ap-leaf)"
            />
            {/* stem */}
            <path
              d="M66 24c0-8 6-12 10-14"
              stroke="#7a3b0a"
              strokeWidth="4"
              strokeLinecap="round"
              opacity=".5"
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
            <circle cx="88" cy="340" r="18" fill="url(#ap-gMain)" />
            <circle cx="136" cy="342" r="20" fill="url(#ap-gMain)" />
            <circle cx="184" cy="340" r="18" fill="url(#ap-gMain)" />
            <g opacity=".85" filter="url(#ap-edgeGlow)">
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

          {/* corner sparkles */}
          <circle cx="12" cy="334" r="2" fill="#fff" opacity=".7" />
          <circle cx="260" cy="16" r="3" fill="#fff" opacity=".7" />
        </svg>
      </div>
    </div>
  );
};

export default ApplePot;
