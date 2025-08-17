const CaptchaBox = () => {
  return (
    <div className="" aria-hidden="true">
      <svg width="96" height="32" viewBox="0 0 96 42">
        <rect width="96" height="42" fill="#102f2b" />
        <g stroke="#2c6b62" strokeWidth="1">
          <line x1="0" y1="6" x2="96" y2="18" />
          <line x1="0" y1="22" x2="96" y2="4" />
          <line x1="10" y1="42" x2="96" y2="12" />
          <line x1="0" y1="32" x2="96" y2="32" />
        </g>
        <text
          x="48"
          y="28"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="20"
          fill="#e6f2ef"
          transform="rotate(-2 48 21)"
        >
          22277
        </text>
      </svg>
    </div>
  );
};

export default CaptchaBox;
