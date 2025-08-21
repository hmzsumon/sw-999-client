"use client";
import ApplePot from "@/components/fruit-loops/ApplePot";
import BetControlBar from "@/components/fruit-loops/BetControlBar";
import CircleIconButton from "@/components/fruit-loops/CircleIconButton";
import MangoPot from "@/components/fruit-loops/MangoPot";
import RulesBtn from "@/components/fruit-loops/RulesBtn";
import WatermelonPot from "@/components/fruit-loops/WatermelonPot";
import Wheel from "@/components/fruit-loops/Wheel";
import { startSpinning } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const FruitLoopsPage = () => {
  const dispatch = useDispatch();
  const winner = useSelector((s: any) => s.fruitLoops.fruitLoopsResults?.[0]);
  const winKey = useSelector((s: any) => s.fruitLoops.winKey);

  return (
    <div className=" flex flex-col items-center justify-center relative h-full">
      <div className="absolute top-0 left-0 w-full h-full">
        <Wheel />
      </div>

      <div className="absolute top-[0%] -right-4 p-2">
        <Link href="/dashboard">
          <CircleIconButton
            size={42}
            icon={
              <span className="font-extrabold" style={{ fontSize: 22 }}>
                X
              </span>
            }
            colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          />
        </Link>
      </div>

      <div className="absolute top-[30%] md:top-[80%] md:left-0 w-full flex flex-col items-center z-20 justify-center">
        <RulesBtn
          size="lg"
          label="Spin"
          colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          onClick={() => dispatch(startSpinning())}
        />
      </div>

      <div className="absolute top-[30%] md:top-[30%]  flex flex-col items-center justify-center w-full ">
        <div className=" grid grid-cols-3 gap-1">
          <MangoPot
            pot={95}
            mine={15}
            isWinner={winner === "Mango"}
            winKey={winKey}
          />
          <WatermelonPot
            pot={110}
            mine={20}
            isWinner={winner === "Watermelon"}
            winKey={winKey}
          />
          <ApplePot
            pot={100}
            mine={25}
            isWinner={winner === "Apple"}
            winKey={winKey}
          />
        </div>
      </div>

      <div className="absolute flex  bottom-14  w-full transform md:-translate-x-1/2 md:left-[50%] z-10">
        <BetControlBar />
      </div>
    </div>
  );
};

export default FruitLoopsPage;
