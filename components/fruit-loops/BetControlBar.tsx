import { MdRestartAlt } from "react-icons/md";
import ChipPicker from "./ChipPicker";
import CircleIconButton from "./CircleIconButton";
import GlassBar from "./GlassBar";
import RulesBtn from "./RulesBtn";

export default function BetControlBar() {
  return (
    <div
      className="
      fixed left-1/2 -translate-x-1/2 bottom-3 z-50
      w-[min(100%-5px,1046px)]   /* gutter + max width */
      pb-[env(safe-area-inset-bottom)] /* iOS safe area */
    "
    >
      <GlassBar
        height={{ base: 150, md: 100 }} /* Responsive height */
        radius={18}
        gradient={{
          start: "#FFE09A",
          mid1: "#FFD067",
          mid2: "#FFB33B",
          mid3: "#FFA224",
          end: "#FF8D15",
        }}
        ringColor="rgba(255,255,255,.22)"
        bottomBeam={{
          color: "#fff0b3",
          height: 3,
          offset: 12,
          opacity: 0.8,
          blur: 0.5,
        }}
        paddingX={12}
        contentClassName="flex flex-col md:flex-row items-center md:justify-between justify-center gap-y-2 w-full"
      >
        {/* Left: Balance + Deposit */}
        <div className="flex items-center gap-4 order-2 md:order-1">
          <RulesBtn
            size="md"
            label="BDT:0.00"
            colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          />
          <RulesBtn
            size="md"
            label="Deposit"
            colors={{ start: "#9cff6a", mid: "#6bdc46", end: "#36b12a" }}
          />
        </div>

        {/* Right: Chips + Reset */}
        <div className="flex items-center gap-4 order-1 md:order-2">
          <ChipPicker />
          <CircleIconButton
            size={60}
            Icon={MdRestartAlt} /* আইকন সরাসরি দিন */
            iconColor="#fff"
            colors={{ start: "#66e3ff", mid: "#2aa7ff", end: "#0a6cff" }}
            aria-label="Reset"
          />
        </div>
      </GlassBar>
    </div>
  );
}
