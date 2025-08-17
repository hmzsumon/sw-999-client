import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className="flex flex-col h-full ">
        <div className=" ">{children}</div>
      </div>
    </div>
  );
};

export default PublicLayout;
