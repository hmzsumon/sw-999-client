import React from "react";

const LuckyTimeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className="flex flex-col h-full ">
        <div className="w-full relative h-screen bg-[url('/images/lucky-time/bg_1.png')] bg-cover bg-center bg-no-repeat px-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LuckyTimeLayout;
