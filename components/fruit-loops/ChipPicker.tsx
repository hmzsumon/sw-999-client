import { useState } from "react";
import BWChip from "./BWChip";

export default function ChipPicker() {
  const chips = [
    { amount: 10, baseColor: "#191919", faceColor: "#111827" },
    { amount: 50, baseColor: "#2563EB", faceColor: "#1D4ED8" },
    { amount: 100, baseColor: "#EF4444", faceColor: "#DC2626" },
  ];

  const [selected, setSelected] = useState<number>(chips[0].amount);

  return (
    <div className="grid grid-cols-3 gap-2 place-items-center">
      {chips.map((c) => (
        <BWChip
          key={c.amount}
          size={50}
          {...c}
          stripeColor="#fff"
          textColor="#fff"
          selected={selected === c.amount}
          selectedScale={1.08} // হালকা বড় হবে
          animate="pulse" // pulse | breathe | none
          glowColor="rgba(59,130,246,.55)" // সিলেক্টেড গ্লো
          onClick={() => setSelected(c.amount)}
        />
      ))}
    </div>
  );
}
