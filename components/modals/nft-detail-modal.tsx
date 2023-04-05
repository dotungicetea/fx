/* eslint-disable react-hooks/exhaustive-deps */
import { getNftDetail } from "@/services/nft-service";
import { NftDetailModalType } from "@/types/modal-type";
import { formatTimestampToDateUTC, formatTimeType } from "@/utils/time";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import { ToastContext } from "../context/toast-context";
import CardNft from "../custom/card-nft";
import Modal from "../custom/modal-custom";
import { nftCardTypes } from "@/constants/lucky-box";
import Link from "next/link";
import { NFT_CONTRACT_VIEW } from "@/hooks/use-contract";

const NftDetailModal = ({
  isOpen,
  id,
  handleHideModal,
}: NftDetailModalType) => {
  const [nft, setNft] = useState<any>();
  const { toast } = useContext(ToastContext);

  const getTimeMinted = (time: number | Date) => {
    if (!time) return "0000-00-00 00:00:00";
    const timeConvertDate =
      typeof time === "number" ? formatTimestampToDateUTC(time) : time;
    const timeFormat = formatTimeType(timeConvertDate, true);
    return timeFormat;
  };

  const isShowUpdate = useMemo(() => {
    const isLegend =
      nft?.rarity.toLowerCase() === nftCardTypes.LEGENDARY.toLowerCase();
    const isEpic =
      nft?.rarity.toLowerCase() === nftCardTypes.EPIC.toLowerCase();
    return isLegend || isEpic;
  }, [nft?.rarity]);

  const handleGetNft = async () => {
    if (typeof id === "number") {
      try {
        const result = await getNftDetail(id);
        if (result && result?.data) {
          const data = {} as any;
          const rarity = result.data?.attributes?.find(
            (att: any) => att?.trait_type === "Rarity"
          )?.value;
          const mp = result.data?.attributes?.find(
            (att: any) => att?.trait_type === "MP"
          )?.value;
          const level = result.data?.attributes?.find(
            (att: any) => att?.trait_type === "Level"
          )?.value;
          const symbol = result.data?.attributes?.find(
            (att: any) => att?.trait_type === "Symbol"
          )?.value;
          data.image = result.data?.image;
          data.rarity = rarity;
          data.bmp = mp;
          data.mp = mp;
          data.level = level;
          data.id = id;
          data.symbol = symbol;
          data.minted = result?.data?.open_time
            ? getTimeMinted(result?.data?.open_time)
            : "_";
          data.status = "Mining";
          setNft(data);
        }
      } catch (e) {
        toast(`Can't load nft detail`, "error");
      }
    }
  };

  useEffect(() => {
    isOpen && handleGetNft();
  }, [id, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setNft(null);
    }
  }, [isOpen]);

  if (!nft) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 50px)" }}
        className="md:w-[100vw] max-w-[410px]"
      >
        <div className="w-[180px] h-[274px] mx-auto">
          <CardNft
            src={nft?.image || ""}
            className="w-[180px] h-[274px]"
            baseMp={nft?.bmp || ""}
            level={nft?.level || ""}
            rarity={nft?.rarity}
            symbol={nft?.symbol}
          />
        </div>
        {isShowUpdate && (
          <button className="flex gap-1 mt-[12px] mx-auto items-center justify-center text-[12px] font-semibold py-2 rounded-[4px] w-[180px] bg-[#2152CB] text-white">
            <Image
              src={"/images/icons/card_upgrade.svg"}
              width={16}
              height={16}
              alt="card upgrade"
            />
            Upgrade
          </button>
        )}
        <p className="text-[28px] font-semibold text-center mt-[14px]">
          NFT Information
        </p>
        <div className="flex flex-col gap-3 bg-[#F4F7FF] mt-[12px] px-[28px] py-5 rounded-[9px]">
          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">Token ID</p>
            <Link href={`${NFT_CONTRACT_VIEW}?a=${nft?.id}`} target={"_blank"}>
              <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px] text-[#2152CB]">
                {nft?.id ? nft?.id : "_"}
                <Image
                  src="/images/icons/icon_open.svg"
                  width={15}
                  height={15}
                  alt="icon open"
                />
              </p>
            </Link>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">Rarity</p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px]">
              {nft?.rarity}
              <div
                className={`w-[12px] min-w-[12px] h-[12px] rounded-[50%] ${
                  nft?.rarity ? nft.rarity?.toLowerCase() : ""
                }-type`}
              />
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">
              Currency Type
            </p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px]">
              {nft?.symbol}
            </p>
          </div>

          {/* <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">Minted</p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px] text-[#2152CB]">
              {nft?.minted}
              <Image
                src="/images/icons/icon_open.svg"
                width={15}
                height={15}
                alt="icon open"
              />
            </p>
          </div> */}

          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">
              Current Level
            </p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px]">
              {nft?.level || 0}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">
              Mining Power
            </p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px]">
              {nft?.mp}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">
              Basic Mining Power
            </p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px]">
              {nft?.bmp || 0}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[14px] leading-[22px] opacity-60">Status</p>
            <p className="flex items-center gap-[6px] font-semibold text-[16px] leading-[22px]">
              {nft?.status || 0}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NftDetailModal;
