import CardNft from "@/components/custom/card-nft";
import { nftCardTypes } from "@/constants/lucky-box";
import { CardItemType } from "@/types/my-account-type";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { pathname } from "@/constants/nav";
import { getNumberFormatUs } from "@/utils";
import { convertDecimalToNum } from "@/utils/network";
import { decryptOrder } from "@/utils/nft";
import { getCurrentPrice } from "@/utils/market";

const MyNftCard = ({ card, handleShowCard }: CardItemType) => {
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

  const isShowUpdate = useMemo(() => {
    const isLegend =
      card?.rarity.toLowerCase() === nftCardTypes.LEGENDARY.toLowerCase();
    const isEpic =
      card?.rarity.toLowerCase() === nftCardTypes.EPIC.toLowerCase();
    return isLegend || isEpic;
  }, [card?.rarity]);

  // const isEndListingTime = useMemo(() => {
  //   const now = new Date().getTime();
  //   let distance = card?.expiration_time * 1000 - now;
  //   if (distance <= 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }, [card?.expiration_time]);

  const getPrices = useMemo(() => {
    // if (isEndListingTime) return 0;
    const order_parameters_obj = decryptOrder(card?.order_parameters);
    const currentPrice = getCurrentPrice({
      order_parameters_obj: order_parameters_obj,
    });
    return currentPrice;
  }, [card?.order_parameters]);

  return (
    <div className="relative card_nft w-[164px] max-w-full h-[250px] rounded-[8px] overflow-hidden">
      <CardNft
        classNameOut="w-full h-full"
        className="w-full h-full cursor-pointer"
        baseMp={baseMp}
        level={level}
        prices={getPrices}
        rarity={card?.rarity}
        symbol={card?.symbol}
      />
      <div className="absolute card_nft_item hidden items-center justify-center w-full h-full top-0 left-0 bg-black bg-opacity-80">
        <div className="flex flex-col gap-2 w-full px-2">
          <button
            className="flex gap-1 items-center justify-center text-[12px] font-semibold py-2 rounded-[4px] w-full bg-[#F4F7FF]"
            onClick={() => handleShowCard(card?.nft_id)}
          >
            <Image
              src="/images/icons/card_detail.svg"
              width={16}
              height={16}
              alt="card detail"
            />
            Detail
          </button>
          {isShowUpdate && (
            <button className="flex gap-1 items-center justify-center text-[12px] font-semibold py-2 rounded-[4px] w-full bg-[#2152CB] text-white">
              <Image
                src="/images/icons/card_upgrade.svg"
                width={16}
                height={16}
                alt="card upgrade"
              />
              Upgrade
            </button>
          )}
          <button className="flex gap-1 items-center justify-center text-[12px] font-semibold py-2 rounded-[4px] w-full bg-[#E34DB1] text-white">
            <Image
              src="/images/icons/card_staking.svg"
              width={16}
              height={16}
              alt="card staking"
            />
            Stake
          </button>
          <Link
            href={`${pathname.MYACCOUNT}${pathname.MYCARDS}/${card?.nft_id}`}
          >
            <button className="flex gap-1 items-center justify-center text-[12px] font-semibold py-2 rounded-[4px] w-full bg-[#1BA53A] text-white">
              <Image
                src="/images/icons/card_sell.svg"
                width={16}
                height={16}
                alt="card sell"
              />
              Sell NFT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyNftCard;
