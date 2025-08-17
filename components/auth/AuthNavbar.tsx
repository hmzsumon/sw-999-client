"use client";
import Logo from "@/public/logo/logo.png";
import { toggleMobileSidebar } from "@/redux/features/ui/sidebarSlice";
import { AlignRight } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";

const AuthNavbar = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <nav className="bg-[#00352f] border-b  border-b-[#075a51] w-full md:h-[80px] p-2 flex items-center ">
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
              <div className="balance-info  text-[#23ffc8] flex items-center px-3 py-2 w-40 rounded-sm gap-1">
                <span className="currency-symbol">৳</span>
                <span className="balance">0</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AuthNavbar;
