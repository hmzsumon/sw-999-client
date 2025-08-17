import PublicNavbar from "@/components/public/PublicNavbar";
import SidebarDesktop from "@/components/public/SidebarDesktop";
import SidebarMobile from "@/components/public/SidebarMobile";
import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div>
        <PublicNavbar />
      </div>

      <div className="wrapper flex flex-col h-full pb-10 ">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2 hidden md:block bg-[#063b36]">
            <SidebarDesktop />
          </div>
          <div className="col-span-2  md:hidden">
            <SidebarMobile />
          </div>
          <div className="col-span-12 md:col-span-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
