import CircleIconButton from "@/components/fruit-loops/CircleIconButton";
import WheelScreen from "@/components/lucky-time/WheelScreen";
import Link from "next/link";

const LuckyTimePage = () => {
  return (
    <div>
      <WheelScreen />
      {/* Close */}
      <div className="absolute top-12 right-3 z-10">
        <Link href="/dashboard">
          <CircleIconButton
            size={32}
            icon={
              <span className="font-extrabold" style={{ fontSize: 22 }}>
                X
              </span>
            }
            colors={{ start: "#0E0904", mid: "#52320D", end: "#be555c" }}
          />
        </Link>
      </div>
    </div>
  );
};

export default LuckyTimePage;
