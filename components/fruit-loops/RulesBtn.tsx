import React from "react";

type RulesBtnProps = {
  label?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  // Gradient colors (top → mid → bottom)
  colors?: { start: string; mid: string; end: string };
  // Optional text color override
  textColor?: string;
  // Optional ring color override (e.g. "#fff8" or "rgba(255,255,255,.35)")
  ringColor?: string;
  // disabled?: boolean; // future use
  disabled?: never; // not implemented yet
};

const SIZES = {
  sm: { h: "h-8", px: "px-3", text: "text-[13px]" },
  md: { h: "h-10", px: "px-5", text: "text-[16px]" },
  lg: { h: "h-12", px: "px-6", text: "text-[18px]" },
};

const RulesBtn: React.FC<RulesBtnProps> = ({
  label = "Rules",
  onClick,
  size = "md",
  className = "",
  colors = { start: "#b36cff", mid: "#8e39f5", end: "#6a17da" }, // default purple
  textColor = "#ffffff",
  ringColor,
}) => {
  const s = SIZES[size];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // Tailwind + inline gradient so color is controllable via props
      className={[
        "relative inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
        s.h,
        s.px,
        "rounded-full font-extrabold tracking-wide",
        s.text,
        "ring-1 [box-shadow:0_8px_16px_rgba(0,0,0,.35)]",
        "hover:brightness-110 active:translate-y-[1px]",
        "focus:outline-none focus:ring-2",
        className,
      ].join(" ")}
      style={{
        // gradient via props
        background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 54%, ${colors.end} 100%)`,
        // ring color override if provided (uses Tailwind ring CSS var)
        ...(ringColor
          ? ({ ["--tw-ring-color"]: ringColor } as React.CSSProperties)
          : {}),
        color: textColor,
      }}
    >
      {/* top glossy highlight */}
      <span
        className="pointer-events-none absolute inset-x-1 top-1 h-[58%] rounded-full
                   bg-[linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,0))]
                   opacity-90"
      />
      {/* subtle inner bevel */}
      <span
        className="pointer-events-none absolute inset-[3px] rounded-full
                   [box-shadow:inset_0_0_0_1px_rgba(255,255,255,.45),inset_0_-10px_14px_rgba(0,0,0,.25)]"
      />
      {/* label */}
      <span className="relative drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]">
        {label}
      </span>
    </button>
  );
};

export default RulesBtn;
