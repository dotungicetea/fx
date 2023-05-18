import { cardSize, sizes } from "@/constants";
import { CartNftType } from "@/types/custom";
import { getNumberFormatUs } from "@/utils";
import clsx from "clsx";
import Image from "next/image";

const CardNft = ({
  className,
  classNameOut,
  baseMp,
  level,
  rarity,
  symbol,
  prices,
  size = sizes.MD,
}: CartNftType) => {
  return (
    <div
      className={clsx(
        "relative w-fit rounded-[8px] overflow-hidden",
        classNameOut
      )}
    >
      <div
        className={clsx(className, `${rarity?.toLocaleLowerCase()}-type`)}
        style={{
          width: `${cardSize[size]?.width}px`,
          height: `${cardSize[size]?.height}px`,
        }}
      >
        <div className="absolute w-[85%] h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {!!prices && <div className="h-[24px]" />}
          <Image
            src={`/images/nfts/${symbol?.toLocaleLowerCase()}.png`}
            style={{
              width: `${cardSize[size]?.imgWidth}px`,
              height: `${cardSize[size]?.imgHeight}px`,
              minHeight: `${cardSize[size]?.imgWidth}px`,
              maxHeight: `${cardSize[size]?.imgWidth}px`,
            }}
            className={`w-full h-full max-w-[${cardSize[size]?.imgWidth}px] max-h-[${cardSize[size]?.imgHeight}px]`}
            width={cardSize[size]?.imgWidth}
            height={cardSize[size]?.imgHeight}
            alt="token symbol"
          />
          <p
            className={`text-[${cardSize[size]?.symbolSize}px] leading-[${cardSize[size]?.symbolLineHeight}px] text-center font-semibold text-white`}
          >
            {symbol}
          </p>
          {!!prices && (
            <div className="flex justify-center items-center gap-1 font-semibold mt-2">
              <Image
                src="/images/networks/bsc.png"
                style={{
                  maxWidth: `${cardSize[size]?.priceIconSize}px`,
                  maxHeight: `${cardSize[size]?.priceIconSize}px`,
                }}
                className="w-full h-full"
                width={cardSize[size]?.priceIconSize}
                height={cardSize[size]?.priceIconSize}
                alt="network"
              />
              <span
                style={{ fontSize: `${cardSize[size]?.priceSize}px` }}
                className="text-white"
              >
                {`${getNumberFormatUs(prices)} BUSD`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx(
          "absolute w-fit top-2 left-2 rounded-[60px] text-white py-[3px] bg-[#FFFFFF33] bg-opacity-20 text-[12px]",
          size === sizes.SM ? "px-[10px]" : "px-[12px]"
        )}
      >{`Lv ${level ? level : 0}`}</div>
      <div
        className={clsx(
          "absolute w-fit flex gap-1 top-2 right-2 rounded-[60px] text-white py-[3px] bg-[#FFFFFF33] bg-opacity-20 text-[12px]",
          size === sizes.SM ? "px-[10px]" : "px-[12px]"
        )}
      >
        <Image
          src="/images/icons/mining.svg"
          width={14}
          height={14}
          alt="mining icon"
        />
        {baseMp ? getNumberFormatUs(baseMp) : 0}
      </div>
    </div>
  );
};

export default CardNft;
