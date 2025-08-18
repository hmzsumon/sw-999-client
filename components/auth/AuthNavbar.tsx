"use client";
import { formatBalance } from "@/lib/functions";
import UserIcon from "@/public/images/ui/user.png";
import Logo from "@/public/logo/logo.png";
import {
  openUserSidebar,
  toggleMobileSidebar,
} from "@/redux/features/ui/sidebarSlice";
import { AlignRight } from "lucide-react";
import Image from "next/image";
import { BiRefresh } from "react-icons/bi";
import { IoMdWallet } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const AuthNavbar = () => {
  const dispatch = useDispatch();
  const { isMobileSidebarOpen, isUserSidebarOpen } = useSelector(
    (state: any) => state.sidebar
  );
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div>
      <nav className="bg-[#00352f] border-b  border-b-[#075a51] w-full md:h-[80px] px-2 flex items-center py-3 ">
        <div className="flex gap-2 items-center justify-between w-full">
          <AlignRight
            className="text-white cursor-pointer"
            size={27}
            onClick={() => dispatch(toggleMobileSidebar())}
          />

          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">
              <Image
                src={Logo}
                alt="Logo"
                width={80}
                height={80}
                priority
                className="inline-block mr-2"
              />
            </div>

            <div className="flex space-x-2">
              {/* Balance Info here */}
              <div className="balance-info  text-[#23ffc8] flex items-center px-3 py-1  rounded-sm gap-2">
                <span>
                  <IoMdWallet />
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-xs">৳</span>
                  <span className="text-xs">
                    {formatBalance(user?.m_balance || 0)}
                  </span>
                </span>
                <span className="refresh-icon cursor-pointer text-white hover:text-[#23ffc8] transition-colors duration-300">
                  <BiRefresh />
                </span>
              </div>
              {/* User Info */}
              <div>
                <button
                  className="balance-info flex items-center gap-2 bg-[#075a51] text-white px-2 py-1 rounded-sm"
                  onClick={() => dispatch(openUserSidebar())}
                >
                  {isUserSidebarOpen ? (
                    <span className="text-white">
                      <span>❌ </span>
                    </span>
                  ) : (
                    <Image
                      src={UserIcon}
                      alt="User Icon"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AuthNavbar;
