import clsx from "clsx";
import {
  FilterOwner,
  FilterPrices,
  FilterRarity,
  FilterStatus,
  FilterType,
} from "./sort-filter-component";
import { SortFilterInMycardType } from "@/types/my-account-type";
import Image from "next/image";

const SortFilter = ({
  currencyType,
  statusCheck,
  rarityCheck,
  typeCheck,
  isOwnerCheck,
  filterPrices,
  setStatusCheck,
  setRarityCheck,
  setTypeCheck,
  handleHideFilter,
  setSearchCard,
  setFilterPrices,
  setIsOwnerCheck,
}: SortFilterInMycardType) => {
  return (
    <div
      className={clsx(
        "fixed top-0 left-0 z-40 w-full h-[100vh]",
        "lg:relative lg:w-[212px] lg:h-fit lg:min-w-[212px] lg:pl-3 lg:py-3"
      )}
    >
      <div className="w-full h-full bg-white rounded-[8px] py-3 pl-5 pr-1 overflow-hidden">
        <Image
          src="/images/icons/cross_x.svg"
          className="float-right mr-3 lg:hidden"
          width={32}
          height={32}
          alt="cross x"
          onClick={() => {
            handleHideFilter && handleHideFilter();
          }}
        />
        <div className="text-[24px] lg:text-[16px] font-semibold text-center lg:text-left">
          Filters
        </div>
        <div className="my-card-filter">
          {setIsOwnerCheck && (
            <FilterOwner
              isOwnerCheck={isOwnerCheck}
              setIsOwnerCheck={setIsOwnerCheck}
            />
          )}
          {setFilterPrices && (
            <FilterPrices
              filterPrices={filterPrices}
              setFilterPrices={setFilterPrices}
            />
          )}
          {setStatusCheck && (
            <FilterStatus
              statusCheck={statusCheck}
              setStatusCheck={setStatusCheck}
            />
          )}
          {setRarityCheck && (
            <FilterRarity
              rarityCheck={rarityCheck}
              setRarityCheck={setRarityCheck}
            />
          )}
          {setTypeCheck && (
            <FilterType
              currencyType={currencyType}
              typeCheck={typeCheck}
              setTypeCheck={setTypeCheck}
              setSearchCard={setSearchCard}
            />
          )}
        </div>
      </div>
      <div className="absolute hidden lg:block w-full h-[60px] left-0 bottom-0 bg-gradient-to-t from-[#F4F7FF] to-transparent pointer-events-none" />
    </div>
  );
};

export default SortFilter;
