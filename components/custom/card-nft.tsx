import clsx from "clsx";
import Image from "next/image";

interface Props {
  src: string;
  classNameOut?: string;
  className?: string;
  baseMp?: number;
  level?: number;
  rarity?: string;
  symbol?: string;
}

const CardNft = ({
  src,
  className,
  classNameOut,
  baseMp,
  level,
  rarity,
  symbol,
}: Props) => {
  return (
    <div
      className={clsx("relative rounded-[8px] overflow-hidden", classNameOut)}
    >
      <div
        className={clsx(
          "w-[164px] h-[250px]",
          className,
          `${rarity?.toLocaleLowerCase()}-type`
        )}
      >
        <div className="absolute w-[85%] h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src={`/images/nfts/${symbol?.toLocaleLowerCase()}.png`}
            className="w-full h-full max-w-[140px] max-h-[140px]"
            width={140}
            height={140}
            alt="token symbol"
          />
          <p className="text-[18px] leading-[25px] text-center font-semibold text-white">
            {symbol}
          </p>
        </div>
      </div>
      <div className="absolute w-fit top-2 left-2 rounded-[60px] text-white px-[12px] py-[3px] bg-[#FFFFFF33] bg-opacity-20 text-[12px]">{`Lv ${
        level ? level : 0
      }`}</div>
      <div className="absolute w-fit flex gap-1 top-2 right-2 rounded-[60px] text-white px-[12px] py-[3px] bg-[#FFFFFF33] bg-opacity-20 text-[12px]">
        <Image
          src="/images/icons/mining.svg"
          width={14}
          height={14}
          alt="mining icon"
        />
        {baseMp ? baseMp : 0}
      </div>
    </div>
  );
};

export default CardNft;
