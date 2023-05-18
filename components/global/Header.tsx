/* eslint-disable react-hooks/exhaustive-deps */
import { hiddenLongText } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import ConnectWalletModal from "../modals/connect-wallet-modal";
import { HeaderType } from "@/types/global-type";
import { WalletContext } from "../context/wallet-context";

const Header = ({ setIsShow }: HeaderType) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { isConnectedAccount, showModalConnectWallet } =
    useContext(WalletContext);

  return (
    <div
      className={clsx(
        "flex fixed w-full top-0 left-0 py-2 px-3 z-40 bg-[#002464]",
        "lg:px-[60px] lg:bg-white header"
      )}
    >
      <div className="flex w-full gap-5">
        <Link href="/" className="block lg:hidden">
          <Image
            src="/images/logo.svg"
            className="mx-auto"
            width={137}
            height={36}
            alt="logo fx-box"
          />
        </Link>
        {isConnectedAccount ? (
          <div className="relative flex ml-auto items-center gap-2 lg:gap-[12px]">
            <div
              className={clsx(
                "px-[12px] py-[10px] cursor-pointer select-none bg-[#F0F4FF] border-[1.5px] border-[#6681FF] text-[14px] leading-[20px] rounded-[12px]",
                "submenu-button font-semibold"
              )}
            >
              {hiddenLongText(address)}
              <div className="absolute bg-white px-3 py-2 rounded-[12px] top-11 left-0 submenu-item">
                <button
                  className="btn-fill border-[1px] border-[#94ADF2] text-[14px] leading-[18px] font-[600] px-4 py-2 rounded-[6px]"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </button>
              </div>
            </div>
            <Image
              src="/images/global/avatar_default.png"
              className="w-[36px] h-[36px] lg:w-[45px] lg:h-[45px]"
              width={45}
              height={45}
              alt="avatar"
            />
          </div>
        ) : (
          <button
            className={clsx(
              "text-[14px] leading-[18px] font-[600] text-white px-3 py-[11px] rounded-[6px] bg-gradient-to-r from-[#6681FF] to-[#2152CB]",
              "lg:px-[40px] ml-auto lg:bg-[#002464] lg:border-[#94ADF2] lg:border-[1px]"
            )}
            onClick={() => showModalConnectWallet()}
          >
            Connect Wallet
          </button>
        )}
        <Image
          src="/images/icons/menu.svg"
          className="lg:hidden"
          width={32}
          height={32}
          alt="menu"
          onClick={() => setIsShow((isShow) => !isShow)}
        />
      </div>
    </div>
  );
};

export default Header;
