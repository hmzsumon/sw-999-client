import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className="flex flex-col h-full ">
        <div className="w-full h-screen bg-[url('/images/fruit-loops/bg_2.webp')] bg-cover bg-center bg-no-repeat px-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
