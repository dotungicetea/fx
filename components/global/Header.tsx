/* eslint-disable react-hooks/exhaustive-deps */
import { hiddenLongText } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import useMediaQuery from "../hooks/media-query";
import ConnectWalletModal from "../modals/connect-wallet-modal";

interface Props {
  setIsShow: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ setIsShow }: Props) => {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const [isConnectedAccount, setIsConnectedAccount] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    setIsConnectedAccount(isConnected);
  }, [isConnected]);

  const handleShowModal = () => setIsShowModal(true);

  const handleHideModal = () => setIsShowModal(false);

  const isOpen = useMemo(() => {
    if (isConnectedAccount && !!isShowModal) {
      handleHideModal();
      return false;
    }
    return isShowModal;
  }, [isShowModal, isConnectedAccount]);

  return (
    <>
      <ConnectWalletModal
        isOpen={isOpen}
        connectors={[connectors[0], connectors[2]]}
        isLoading={isLoading}
        pendingConnector={pendingConnector}
        handleHideModal={handleHideModal}
        connectAsync={connectAsync}
        disconnect={disconnect}
      />
      <div
        className={clsx(
          "flex fixed lg:relative w-full py-[12px] px-3 z-40 bg-[#002464]",
          "lg:px-[60px] lg:bg-transparent"
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
                {hiddenLongText(address, isDesktop ? 8 : 4)}
                <div className="absolute bg-white px-3 py-2 rounded-[12px] top-11 left-0 submenu-item">
                  <button
                    className="border-[1px] border-[#94ADF2] text-[14px] leading-[18px] font-[600] text-white px-4 py-2 rounded-[6px] bg-[#002464]"
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
              onClick={() => handleShowModal()}
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
    </>
  );
};

export default Header;
