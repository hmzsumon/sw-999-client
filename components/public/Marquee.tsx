"use client";
const Marquee = () => {
  return (
    <div className="px-2">
      <div className="marquee rounded-full px-2 py-[.15rem] flex items-center w-full md:w-1/2 mx-auto mt-2 overflow-hidden">
        {/* Megaphone Icon */}
        <span className="mr-2 text-yellow-400">
          {/* You can use an SVG icon here or import from your icon set */}
          📢
        </span>
        {/* Marquee Content */}
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center animate-marquee whitespace-nowrap">
            {/* Gift Icons */}
            <span className="mr-2 flex">
              <span className="text-red-400 text-[.70rem] mr-1">🎁</span>
              <span className="text-red-400 text-[.70rem] mr-1">🎁</span>
              <span className="text-red-400 text-[.70rem] mr-1">🎁</span>
            </span>
            <span className="text-white font-semibold text-[.70rem]">
              TK999 সর্ব্বোচ্চ অফার:
            </span>
          </div>
        </div>
        <style jsx>{`
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Marquee;
