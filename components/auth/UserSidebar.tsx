"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { closeUserSidebar } from "@/redux/features/ui/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";

import LogoutButton from "./LogoutButton";
import UserBalanceInfo from "./UserBalanceInfo";

const menuItems = [
  {
    id: 1,
    label: "Promotions",
    icon: "/images/icons/promotion.svg",
    href: "/promotions",
  },
  {
    id: 2,
    label: "Home",
    icon: "/images/icons/home.svg",
    href: "/",
  },
  {
    id: 3,
    label: "Casino",
    icon: "/images/icons/games.svg",
    href: "/casino",
  },
  {
    id: 4,
    label: "Live Casino",
    icon: "/images/icons/live-casino.svg",
    href: "/casino/live-casino",
  },
  {
    id: 5,
    label: "Jackpots",
    icon: "/images/icons/jackpots.svg",
    href: "/casino/jackpots",
  },
];

const UserSidebar = () => {
  const isUserSidebarOpen = useSelector(
    (state: any) => state.sidebar.isUserSidebarOpen
  );
  const dispatch = useDispatch();
  return (
    <div className="relative">
      {/* Mobile Sidebar Button + Sheet */}
      <div className=" p-2">
        <Sheet
          open={isUserSidebarOpen}
          onOpenChange={() => dispatch(closeUserSidebar())}
        >
          <SheetContent
            side="right"
            className="w-full border-none bg-[#044243] !top-[68px] md:!top-[80px]  overflow-y-auto  [&>button]:hidden "
          >
            <div className="w-full ">
              <div>
                <UserBalanceInfo />
              </div>
              <div className="absolute left-0 top-[82%] z-10 inset-x-0 ">
                <LogoutButton />
              </div>
            </div>
            {/* Logout Button */}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default UserSidebar;
