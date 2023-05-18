import CardNft from "@/components/custom/card-nft";
import { CardDetailInMyCardType } from "@/types/my-account-type";

const CardDetailInMyCardDetail = ({
  nftDetail,
  currentPrice,
}: CardDetailInMyCardType) => {
  return (
    <div className="bg-white rounded-[12px] w-full px-5 pt-[40px] pb-[27px]">
      <div className="w-fit mx-auto">
        <CardNft
          size="lg"
          baseMp={nftDetail?.bmp || ""}
          level={nftDetail?.level || ""}
          rarity={nftDetail?.rarity}
          symbol={nftDetail?.symbol}
          prices={currentPrice}
        />
        <div className="flex items-center justify-between mt-[15px]">
          <p className="text-[14px] leading-[22px]">Card ID</p>
          <p className="text-[18px] leading-[25px] font-semibold">{`#${nftDetail?.id}`}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetailInMyCardDetail;
