"use client";
import WalletMenu from "@/components/auth/WalletMenu";
import SimpleSlider from "@/components/public/Carousel";
import GameMenu from "@/components/public/GameMenu";
import HotGamesMenu from "@/components/public/HotGamesMenu";
import Marquee from "@/components/public/Marquee";

const DashboardPage = () => {
  // const { data, error } = useLoadUserQuery();

  return (
    <div className="space-y-4 px-2">
      <Marquee />
      <SimpleSlider />
      <WalletMenu />
      <GameMenu />
      <HotGamesMenu />
    </div>
  );
};

export default DashboardPage;
