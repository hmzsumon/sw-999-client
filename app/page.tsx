import SimpleSlider from "@/components/public/Carousel";
import GameMenu from "@/components/public/GameMenu";
import HotGamesMenu from "@/components/public/HotGamesMenu";
import Marquee from "@/components/public/Marquee";
import PublicLayout from "./(public)/layout";

export default function Home() {
  return (
    <PublicLayout>
      <div className="space-y-4 px-2">
        <Marquee />
        <SimpleSlider />
        <GameMenu />
        <HotGamesMenu />
      </div>
    </PublicLayout>
  );
}
