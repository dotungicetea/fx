/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import NftDetailModal from "../modals/nft-detail-modal";
import MyNftCard from "./my-cards/cards";
import SortFilter from "./my-cards/sort-filter";
import { pathname } from "@/constants/nav";
import useMediaQuery from "../hooks/media-query";
import MyCardLoading from "../loading/my-card-loading";
import { getCurrencyType, handleSortMyCard } from "@/utils/my-account";
import { listSortTypesInMyAccount, statusValues } from "@/constants/my-account";
import { SelectComponent } from "../custom/select";
import { NftCardsType } from "@/types/my-account-type";
import clsx from "clsx";
import { filterOrderStatus } from "@/constants";

const NftCards = ({ nftList }: NftCardsType) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [myNfts, setMyNfts] = useState<any[]>();
  const [cardIdShow, setCardIdShow] = useState<number | null>(null);
  const [statusCheck, setStatusCheck] = useState<string>("");
  const [rarityCheck, setRarityCheck] = useState<string[]>([]);
  const [typeCheck, setTypeCheck] = useState<string[]>([]);
  const [currencyType, setCurrencyType] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("");
  const [searchCard, setSearchCard] = useState<string>("");

  const handleShowModal = () => setIsShowModal(true);
  const handleHideModal = () => setIsShowModal(false);

  const handleShowFilter = () => setIsShowFilter(true);
  const handleHideFilter = () => setIsShowFilter(false);

  useEffect(() => {
    setMyNfts(nftList);
    const result = getCurrencyType(nftList);
    setCurrencyType(result);
  }, [nftList]);

  const handelFilter = (id?: string) => {
    let myNftsFilter = [...(nftList || [])];
    myNftsFilter = myNftsFilter?.filter((nft) => {
      if (!statusCheck) return true;
      if (
        !nft?.event_type &&
        statusCheck?.toLowerCase() === statusValues?.UNLISTED
      )
        return true;
      return filterOrderStatus[nft?.event_type] === statusCheck?.toLowerCase();
    });
    if (rarityCheck?.length) {
      myNftsFilter = myNftsFilter?.filter((nft) =>
        rarityCheck?.some(
          (rarity) => rarity?.toLowerCase() === nft?.rarity?.toLowerCase()
        )
      );
    }
    if (typeCheck?.length) {
      myNftsFilter = myNftsFilter?.filter((nft) =>
        typeCheck?.some(
          (type) => type?.toLocaleLowerCase() === nft?.symbol?.toLowerCase()
        )
      );
    }
    if (searchCard) {
      myNftsFilter = myNftsFilter?.filter((nft) => {
        const regex = new RegExp(searchCard?.toLocaleLowerCase());
        const isSymbol = regex.test(nft?.symbol?.toLowerCase());
        const isName = regex.test(nft?.name?.toLowerCase());
        return isSymbol || isName;
      });
    }
    const resuls = handleSortMyCard(myNftsFilter, sort);
    if (id) {
      const cardById = resuls?.find((res) => res?.nft_id === Number(id));
      setMyNfts(cardById ? [cardById] : []);
    } else {
      setMyNfts(resuls);
    }
  };

  useEffect(() => {
    handelFilter();
  }, [statusCheck, rarityCheck, typeCheck, searchCard]);

  useEffect(() => {
    const resuls = handleSortMyCard(myNfts, sort);
    setMyNfts(resuls);
  }, [sort]);

  const handleShowCard = (id: number) => {
    if (typeof id === "number") {
      setCardIdShow(id);
      handleShowModal();
    }
  };

  const getTotalMiningPower = useMemo(() => {
    let totalMiningPower = 0;
    myNfts?.forEach((nft) => {
      totalMiningPower += nft.mp ? nft.mp : 0;
    });
    return totalMiningPower;
  }, [myNfts]);

  const handleClear = () => {
    setStatusCheck("");
    setRarityCheck([]);
    setTypeCheck([]);
  };

  return (
    <div>
      {!nftList && <MyCardLoading />}
      {typeof nftList !== "undefined" && (
        <div className="lg:flex gap-5">
          {!!nftList?.length ? (
            <>
              {(isShowFilter || isDesktop) && (
                <SortFilter
                  currencyType={currencyType}
                  statusCheck={statusCheck}
                  rarityCheck={rarityCheck}
                  typeCheck={typeCheck}
                  setStatusCheck={setStatusCheck}
                  setRarityCheck={setRarityCheck}
                  setTypeCheck={setTypeCheck}
                  handleHideFilter={handleHideFilter}
                  setSearchCard={setSearchCard}
                />
              )}
              <div className="flex gap-3 justify-between px-5 py-3 lg:hidden">
                <button
                  className="flex gap-1 p-3 btn-fill rounded-[8px] text-[14px] justify-center items-center font-semibold"
                  onClick={() => handleShowFilter()}
                >
                  <Image
                    src="/images/icons/filter_white.svg"
                    width={20}
                    height={20}
                    alt="icon filter"
                  />
                  Sort & Filters
                </button>
                <div className="flex gap-2">
                  <SelectComponent
                    plachoderOptions={{ name: "Sort by", value: "" }}
                    className="bg-white opacity-60 w-[163px] md:w-auto"
                    options={listSortTypesInMyAccount}
                    onChange={setSort}
                  />
                </div>
              </div>
              <div className="relative flex flex-col my-card-list w-full px-5 lg:px-2">
                <div className="absolute hidden lg:block w-[1.5px] h-full top-0 right-5 bg-[#002464] opacity-20" />
                <div className="lg:pr-3">
                  <div className="flex flex-1 max-h-[63px] pb-[12px] pt-3 lg:pr-5 justify-between items-center">
                    <div className="flex flex-nowrap gap-1">
                      Total Mining Power{" "}
                      <span className="font-semibold">
                        {getTotalMiningPower || 0}
                      </span>
                    </div>
                    <div className="lg:flex hidden gap-2">
                      <SelectComponent
                        plachoderOptions={{ name: "Sort by", value: "" }}
                        className="bg-white opacity-60"
                        options={listSortTypesInMyAccount}
                        onChange={setSort}
                      />
                    </div>
                  </div>
                </div>
                <div className="scroll-bg-white overflow-auto list-card">
                  {!!myNfts?.length ? (
                    <div className="lg:pr-[7.5px]">
                      <div
                        className={clsx(
                          "w-fit h-fit mt-5 gap-[12px] pb-5 lg:pr-5 grid grid-cols-2",
                          "sm:flex sm:flex-wrap lg:justify-start lg:flex-1 lg:mt-0"
                        )}
                      >
                        {myNfts?.map((card: any, index) => (
                          <MyNftCard
                            key={index}
                            card={card}
                            handleShowCard={handleShowCard}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full py-10 text-center mx-auto">
                      <Image
                        src="/images/icons/icon_no_record.svg"
                        className="mx-auto"
                        width={100}
                        height={100}
                        alt="no nft"
                      />
                      <p className="text-[18px] mt-3 font-semibold">
                        No items found for this search
                      </p>
                      <div className="flex gap-2 justify-center mt-3">
                        <Link href={`${pathname.MARKETPLACE}`}>
                          <button className="w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold border-[1px] border-[#002464]">
                            Marketplace
                          </button>
                        </Link>
                        <button
                          className="btn-fill w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold"
                          onClick={() => handleClear()}
                        >
                          Back to all items
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <NftDetailModal
                isOpen={isShowModal}
                id={cardIdShow}
                handleHideModal={handleHideModal}
              />
            </>
          ) : (
            <div className="w-full py-10 text-center">
              <Image
                src="/images/icons/icon_no_record.svg"
                className="mx-auto"
                width={120}
                height={120}
                alt="no nft"
              />
              <p className="text-[28px] mt-5 font-semibold">
                Total: 0 NFT Card
              </p>
              <p>You haven&apos;t owned any NFTs yet</p>
              <div className="flex gap-2 justify-center mt-8">
                <Link href={pathname.LUCKYBOX}>
                  <button className="w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold border-[1px] border-[#002464]">
                    Buy Card NFT
                  </button>
                </Link>
                <Link href={pathname.LUCKYBOX}>
                  <button className="btn-fill w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold">
                    Buy Box
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NftCards;
