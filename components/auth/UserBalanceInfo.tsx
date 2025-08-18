import CopyToClipboard from "@/lib/CopyToClipboard";
import { formatBalance } from "@/lib/functions";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeUserSidebar } from "@/redux/features/ui/sidebarSlice";
import Divider from "../ui/Divider";

const UserBalanceInfo: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div className="grid">
      <div className="balance-info__frame" />

      <div className="balance-info__inner">
        {/* User Info */}

        <div className="balance-detail balance-detail__link">
          <span className="balance-detail__title">Name</span>
          <span className="balance-detail__text flex items-center gap-1">
            {user?.name}
          </span>
        </div>

        <div className="balance-detail balance-detail__link">
          <span className="balance-detail__title">Email</span>
          <span className="balance-detail__text flex items-center gap-1">
            {user?.email}
            <CopyToClipboard text={user?.email} />
          </span>
        </div>

        <div className="balance-detail balance-detail__link">
          <span className="balance-detail__title">UID</span>
          <span className="balance-detail__text flex items-center gap-1">
            {user?.customerId}
            <CopyToClipboard text={user?.customerId} />
          </span>
        </div>

        <Divider />

        {/* Real Balance */}
        <button
          type="button"
          data-testid="btnRealBalanceDepositDialog"
          data-analytics-action="Real Balance"
          data-analytics-label="Real Balance"
          className="balance-detail balance-detail__link "
        >
          <span className="balance-detail__title">Balance</span>
          <span className="balance-detail__text">
            ৳ {formatBalance(user?.m_balance)}
          </span>
        </button>

        <Divider />

        {/* Deposit Button */}
        <div className="flex w-full items-center justify-between gap-2">
          <Link
            href="/deposit"
            onClick={() => dispatch(closeUserSidebar())}
            className="w-full"
          >
            <button
              type="button"
              className=" balance-info w-full rounded-lg flex items-center justify-center gap-2 text-[#ffc403] p-2 font-bold"
            >
              <span className="button__title">Deposit</span>
            </button>
          </Link>

          <Link
            href={user?.is_bind_wallet ? "/withdraw" : "/withdraw/bind-wallet"}
            onClick={() => dispatch(closeUserSidebar())}
            className="w-full"
          >
            <button
              type="button"
              className=" balance-info w-full rounded-lg flex items-center justify-center gap-2 text-[#ffc403] p-2 font-bold"
            >
              <span className="button__title">withdraw</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBalanceInfo;
