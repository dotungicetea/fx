import { nftCardTypesInBox } from "@/constants/lucky-box";
import clsx from "clsx";
import Image from "next/image";
import useMediaQuery from "../hooks/media-query";

const RankCardItem = ({ nftType }: any) => {
  return (
    <div className="flex gap-2 text-white mt-4 items-center">
      <div
        className={clsx(
          "w-[24px] min-w-[24px] h-[24px] rounded-[50%]",
          `${nftType.type}-type`
        )}
      />
      <div>
        <div className="text-[12px] leading-[13px] capitalize text-white">
          {nftType?.title}
        </div>
        <div className="text-[8px] leading-[12px] opacity-80 text-white">
          {nftType?.rate}
        </div>
      </div>
    </div>
  );
};

const LuckyBoxTypes = () => {
  const isDesktop = useMediaQuery("(min-width: 1100px)");

  return (
    <div
      className={clsx(
        "flex w-full h-fit xl:h-full lucky-box-bg-light gap-3 items-end justify-between px-3 py-5 rounded-[20px]",
        "xl:px-[30px] box-stage-card lg:max-w-[515px] lg:pt-[90px] lg:pb-[50px]"
      )}
    >
      <div className="box-stage-card-list">
        {isDesktop ? (
          nftCardTypesInBox?.map((nftType: any, index: number) => {
            return <RankCardItem key={index} nftType={nftType} />;
          })
        ) : (
          <>
            <div>
              {nftCardTypesInBox?.map((nftType: any, index: number) => {
                if (index >= 2) return null;
                return <RankCardItem key={index} nftType={nftType} />;
              })}
            </div>
            <div>
              {nftCardTypesInBox?.map((nftType: any, index: number) => {
                if (index < 2) return null;
                return <RankCardItem key={index} nftType={nftType} />;
              })}
            </div>
          </>
        )}
      </div>
      <div className="relative select-none pointer-events-none mt-[30px]">
        <Image
          src="/images/luckybox/cards_nft.png"
          className="absolute top-[-50px] left-[-50px]"
          width={145}
          height={220}
          alt="cards nft"
        />
        <Image
          src="/images/global/box.png"
          className="lg:w-[200px] lg:h-[200px] xl:w-[250px] xl:h-[250px]"
          width={250}
          height={250}
          alt="box"
        />
      </div>
    </div>
  );
};

export default LuckyBoxTypes;
