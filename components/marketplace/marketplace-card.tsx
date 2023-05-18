/* eslint-disable react-hooks/exhaustive-deps */
import { listNftInMarketType } from "@/types/market";
import Image from "next/image";
import { useMemo, useState } from "react";
import SortFilter from "../my-account/my-cards/sort-filter";
import useMediaQuery from "../hooks/media-query";
import MyCardLoading from "../loading/my-card-loading";
import { listSortTypes } from "@/constants/my-account";
import { SelectComponent } from "../custom/select";
import { defaultCurrencyType } from "@/constants";
import MarketplaceCardItem from "./marketplace-card-item";
import { getNumberFormatUs } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { pathname } from "@/constants/nav";
import MarketplaceLoading from "../loading/marketplace-loading";

const FilterValuesShow = ({ value, action }: any) => {
  return (
    <div
      className="flex gap-1 px-3 py-[6px] bg-white rounded-[20px] text-[14px] leading-[22px]"
      onClick={() => action(value)}
    >
      {value}
      <Image
        src="/images/icons/cross_x_small.svg"
        className="min-w-[12px] cursor-pointer"
        width={12}
        height={12}
        alt="cross"
      />
    </div>
  );
};

const MarketplaceCards = ({
  nftList,
  isOwnerCheck,
  rarityCheck,
  typeCheck,
  filterPrices,
  page,
  meta,
  loading,
  setLastElement,
  setSort,
  setIsOwnerCheck,
  setRarityCheck,
  setTypeCheck,
  setFilterPrices,
}: listNftInMarketType) => {
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleShowFilter = () => setIsShowFilter(true);
  const handleHideFilter = () => setIsShowFilter(false);

  const handleCloseFilterPrices = () => setFilterPrices({});

  const handleClear = () => {
    setIsOwnerCheck(false);
    setRarityCheck([]);
    setTypeCheck([]);
    setFilterPrices({});
  };

  const handleCloseFilter = (
    value: any,
    check: any[],
    setCheck: (check: any[]) => void
  ) => {
    const valueIndex = check?.findIndex(
      (rarity) => rarity?.toLocaleLowerCase() === value?.toLocaleLowerCase()
    );
    if (valueIndex >= 0) {
      const clone = [...check];
      clone.splice(valueIndex, 1);
      setCheck(clone);
    }
  };

  const handleCloseFilterRarity = (value: string) =>
    handleCloseFilter(value, rarityCheck, setRarityCheck);

  const handleCloseFilterType = (value: string) =>
    handleCloseFilter(value, typeCheck, setTypeCheck);

  return (
    <div>
      {!nftList && <MyCardLoading />}
      {nftList !== null && (
        <div className="lg:flex gap-5">
          <div className={clsx(isShowFilter || isDesktop ? "" : "hidden")}>
            <SortFilter
              currencyType={defaultCurrencyType}
              rarityCheck={rarityCheck}
              typeCheck={typeCheck}
              filterPrices={filterPrices}
              isOwnerCheck={isOwnerCheck}
              setIsOwnerCheck={setIsOwnerCheck}
              setRarityCheck={setRarityCheck}
              setTypeCheck={setTypeCheck}
              setFilterPrices={setFilterPrices}
              handleHideFilter={handleHideFilter}
              setSearchCard={() => {}}
            />
          </div>
          <div className="flex gap-3 justify-between px-5 py-3 lg:hidden">
            <button
              className={clsx(
                "px-3 py-3 btn-fill flex-nowrap flex rounded-[8px] gap-1 text-[14px] justify-center items-center font-semibold"
              )}
              onClick={() => handleShowFilter()}
            >
              <Image
                src="/images/icons/filter_white.svg"
                width={15}
                height={15}
                alt="icon filter"
              />
              Sort & Filters
            </button>
            <div className="flex gap-2">
              <SelectComponent
                plachoderOptions={{ name: "Sort by", value: "" }}
                className="bg-white opacity-60 w-[163px]"
                options={listSortTypes}
                onChange={setSort}
              />
            </div>
          </div>
          <div className="relative flex flex-col my-card-list w-full px-5 lg:px-2">
            <div className="absolute hidden lg:block w-[1.5px] h-full top-0 right-5 bg-[#002464] opacity-20" />
            <div className="lg:pr-3">
              <div className="flex flex-1 max-h-[63px] pb-[12px] pt-3 lg:pr-5 justify-between items-center">
                <div className="flex flex-nowrap gap-1">
                  Total{" "}
                  <span className="font-semibold">
                    {`${nftList?.length || 0} results`}
                  </span>
                </div>
                <div className="lg:flex gap-2 hidden">
                  <SelectComponent
                    plachoderOptions={{ name: "Sort by", value: "" }}
                    className="bg-white opacity-60"
                    options={listSortTypes}
                    onChange={setSort}
                  />
                </div>
              </div>
            </div>
            {((filterPrices?.max && filterPrices?.min) ||
              !!rarityCheck?.length ||
              !!typeCheck?.length) && (
              <div className="flex flex-wrap gap-2 pb-3">
                {filterPrices?.max && filterPrices?.min && (
                  <FilterValuesShow
                    value={`Price: ${getNumberFormatUs(
                      filterPrices?.min
                    )} ~ ${getNumberFormatUs(filterPrices?.max)} BUSD`}
                    action={handleCloseFilterPrices}
                  />
                )}
                {rarityCheck?.map((item, index) => {
                  return (
                    <FilterValuesShow
                      key={index}
                      value={item}
                      action={handleCloseFilterRarity}
                    />
                  );
                })}
                {typeCheck?.map((item, index) => {
                  return (
                    <FilterValuesShow
                      key={index}
                      value={item}
                      action={handleCloseFilterType}
                    />
                  );
                })}
              </div>
            )}
            {!!nftList?.length ? (
              <div className="scroll-bg-white overflow-auto list-card">
                <div className="lg:pr-[7.5px]">
                  <div
                    className={clsx(
                      "w-fit h-fit mt-5 lg:mt-0 gap-[12px] pb-5 flex-1 lg:pr-5 grid grid-cols-2",
                      "sm:flex sm:flex-wrap lg:justify-start"
                    )}
                  >
                    {nftList?.map((card: any, index) => {
                      return index === nftList.length - 1 &&
                        !meta?.lastPage &&
                        page <= meta?.lastPage ? (
                        <MarketplaceCardItem
                          key={index}
                          card={card}
                          setLastElement={setLastElement}
                        />
                      ) : (
                        <MarketplaceCardItem
                          key={index}
                          card={card}
                          setLastElement={setLastElement}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {!loading ? (
                  <div className="w-full py-10 text-center">
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
                    <div className="flex gap-2 justify-center mt-8">
                      <Link href={`${pathname.MYACCOUNT}${pathname?.MYCARDS}`}>
                        <button className="w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold border-[1px] border-[#002464]">
                          My Cards
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
                ) : (
                  <MarketplaceLoading />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceCards;
