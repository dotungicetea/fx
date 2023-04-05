import { nftCardTypesInBox } from "@/constants/lucky-box";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

const ButtonReadMore = ({ className }: any) => {
  return (
    <Link
      href={"https://docs.fxbox.io/fxbox-gamefi/lucky-fxbox"}
      target={"_blank"}
    >
      <button
        className={clsx(
          "mt-5 flex items-center gap-[9px] text-[14px] leading-[19px] border-[1px] border-[#0A1E42] py-[8px] px-[12px] rounded-[60px] font-[600]",
          className
        )}
      >
        Read more{" "}
        <Image
          src="/images/icons/long_arrow_right.svg"
          width={25}
          height={10}
          alt="long arrow right"
        />
      </button>
    </Link>
  );
};

const LuckyBoxRule = () => {
  return (
    <div>
      <h2 className="hidden lg:block text-[28px] font-[600]">
        Box Rules & NFT Probabilities
      </h2>
      <div className="lg:grid lg:grid-cols-2 gap-[50px] pt-[3px]">
        <div className="text-[14px]">
          <p className="mt-3 opacity-60">
            FxBox players buy and unlock boxes for NFTs! 90 BUSD can open 1 box
            which generates 1 random NFT and random Mining Power by rarity.
          </p>
          <p className="mt-3 opacity-60">
            The NFT rarity obtained by opening the treasure box is completely
            random and is based on an RNG algorithm which generates your random
            NFT. The probabilities of obtaining NFTs are listed on the table.
          </p>
          <p className="mt-3 opacity-60">
            The opened Cards will be automatically staked and generate Mining
            Power. The more Mining Power you have, the more FXB tokens you can
            earn passively.
          </p>
          <ButtonReadMore className="hidden lg:flex" />
        </div>
        <div className="grid md:grid-cols-2 mt-5 lg:mt-0 gap-[9px]">
          {nftCardTypesInBox?.map((nft: any, index: number) => {
            return (
              <div
                key={index}
                className="bg-white rounded-[4px] px-[12px] py-[8px] flex gap-[10px]"
              >
                <div
                  className={clsx(
                    `${nft?.color}`,
                    "w-[40px] min-w-[40px] h-[56px] rounded-[4px] flex justify-center items-center"
                  )}
                >
                  <Image
                    src="/images/icons/any_card.png"
                    width={34}
                    height={39}
                    alt="any card"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-[600] capitalize">
                    {nft?.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-[12px]">
                    <div>
                      <p className="text-[10px] opacity-60">Weight</p>
                      <p className="text-[12px] font-[600]">{nft?.rate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-60">Mining Power</p>
                      <p className="text-[12px] font-[600]">{nft?.mining}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ButtonReadMore className="lg:hidden" />
    </div>
  );
};

export default LuckyBoxRule;
