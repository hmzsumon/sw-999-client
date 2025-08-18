"use client";
import DepositItemCard from "@/components/deposit/DepositItemCard";
import Bkash from "@/public/images/deposit/bkash.png";
import Nagad from "@/public/images/deposit/nagad.png";
import Rocket from "@/public/images/deposit/roket.png";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";

const depositItems = [
  {
    image: Bkash,
    name: "Bkash",
    minimum: 300,
    fee: 0,
    link: "/deposit/bkash",
    isActive: true,
  },
  {
    image: Nagad,
    name: "Nagad",
    minimum: 300,
    fee: 0,
    link: "/deposit/nagad",
    isActive: true,
  },
  {
    image: Rocket,
    name: "Rocket",
    minimum: 300,
    fee: 0,
    link: "/deposit/rocket",
    isActive: false,
  },
];

const DepositPage = () => {
  const router = useRouter();
  return (
    <div className="p-4">
      <div className=" px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              className="text-gray-100 text-sm hover:underline flex items-center gap-1"
              onClick={() => router.back()}
            >
              <FaAngleLeft />
              Back
            </button>
          </div>
          <div>
            <h1 className="text-lg text-white font-bold">Deposit</h1>
          </div>
          <div></div>
        </div>

        <div className="space-y-4 mt-4">
          {depositItems.map((item, index) => (
            <DepositItemCard
              key={index}
              image={item.image}
              name={item.name}
              minimum={item.minimum}
              fee={item.fee}
              isActive={item.isActive}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
