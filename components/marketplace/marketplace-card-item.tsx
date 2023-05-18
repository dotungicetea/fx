import { MarketplaceCardItemType } from "@/types/market";
import { useContext, useMemo } from "react";
import CardNft from "../custom/card-nft";
import { convertDecimalToNum } from "@/utils/network";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { pathname } from "@/constants/nav";
import { getCurrentPrice } from "@/utils/market";
import { WalletContext } from "../context/wallet-context";
import { useAccount } from "wagmi";
import { getNumberFormatUs } from "@/utils";

const MarketplaceCardItem = ({
  card,
  setLastElement,
}: MarketplaceCardItemType) => {
  const { showModalConnectWallet } = useContext(WalletContext);
  const { address } = useAccount();

  const baseMp = useMemo(() => {
    const mp = card?.attributes.find(
      (attribute: any) => attribute?.trait_type?.toLowerCase() === "mp"
    );
    return mp ? mp?.value : 0;
  }, [card]);

  const level = useMemo(() => {
    const lv = card?.attributes.find(
      (attribute: any) => attribute?.trait_type?.toLowerCase() === "level"
    );
    return lv ? lv?.value : 0;
  }, [card]);

  const currentPrice = useMemo(() => {
    return getCurrentPrice(card);
  }, [card]);

  return (
    <div
      className="group hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-[8px]"
      ref={setLastElement}
    >
      <div>
        <CardNft
          classNameOut="w-full h-full"
          className="w-full h-full"
          baseMp={baseMp}
          level={level}
          rarity={card?.rarity}
          symbol={card?.symbol}
          prices={currentPrice}
        />
      </div>
      <div className="h-[64px] px-2 py-3 max-w-[164px]">
        <div className="group-hover:hidden">
          <div className="flex gap-1 text-[14px] leading-[19px]">
            <span className="font-semibold truncate">
              {card?.order_item?.name}
            </span>
            <span>{`#${card?.order_item?.nft_id}`}</span>
          </div>
          <div className="flex text-[12px] leading-[19px]">
            <span className="opacity-60 min-w-[60px]">Last offer</span>
            <span className="font-semibold truncate">{`${
              card?.offer_item?.end_amount
                ? getNumberFormatUs(
                    convertDecimalToNum(card?.offer_item?.end_amount)
                  )
                : "--"
            } BUSD`}</span>
          </div>
        </div>
        <Link
          href={
            address
              ? `${pathname?.MARKETPLACE}${pathname?.NFT}/${card?.order_item?.nft_id}`
              : {}
          }
        >
          <button
            className={clsx(
              "hidden group-hover:flex justify-center items-center rounded-[4px] text-white w-full h-[40px] bg-[#2152CB] gap-1 text-[12px] leading-[16px]",
              "disabled:opacity-70"
            )}
            onClick={() => {
              !address && showModalConnectWallet();
            }}
          >
            <Image
              src="/images/icons/sell.svg"
              className="min-w-[16px]"
              width={16}
              height={16}
              alt="sell icon"
            />
            Buy
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MarketplaceCardItem;
