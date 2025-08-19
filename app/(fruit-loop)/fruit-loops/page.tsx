import ApplePot from "@/components/fruit-loops/ApplePot";
import ChipBoard from "@/components/fruit-loops/ChipBoard";
import MangoPot from "@/components/fruit-loops/MangoPot";
import PlayButton from "@/components/fruit-loops/PlayButton";
import WatermelonPot from "@/components/fruit-loops/WatermelonPot";
import Wheel from "@/components/fruit-loops/Wheel";

const FruitLoopsPage = () => {
  return (
    <div className="relative">
      <Wheel />
      <div className="absolute top-[35%] md:top-[75%] flex flex-col items-center justify-center w-full ">
        <div className=" grid grid-cols-3 gap-1">
          <MangoPot />
          <WatermelonPot />
          <ApplePot />
        </div>
      </div>

      <div className="absolute top-[140%] md:top-[120%] md:left-[40%] w-full flex flex-col items-center justify-center">
        <PlayButton label="Spin" className="" />
      </div>

      <div className="absolute  top-[180%] md:top-[220%] w-full transform md:-translate-x-1/2 md:left-[50%]">
        <ChipBoard />
      </div>
    </div>
  );
};

export default FruitLoopsPage;
