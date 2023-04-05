import ButtonCross from "@/components/custom/button-cross";
import { filterTitle, sortFilter } from "@/constants/my-account";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  listCheck: string[];
  handleChange: (value: string, checked: boolean) => void;
  handleFilter: () => void;
  handleClear: () => void;
  handleHideFilter: () => void;
}

const SortFilter = ({
  listCheck,
  handleChange,
  handleFilter,
  handleClear,
  handleHideFilter,
}: Props) => {
  return (
    <div
      className={clsx(
        "fixed lg:relative lg:w-[177px] lg:min-w-[177px] p-5 lg:bg-[#E1E9FF] rounded-[8px]",
        "top-0 left-0 w-full h-full lg:h-fit z-50 bg-white"
      )}
    >
      <div className="block lg:hidden">
        <ButtonCross handleClose={() => handleHideFilter()} />
      </div>
      <div className="flex gap-[10px] text-[24px] lg:text-[16px] justify-center items-center font-semibold">
        <Image
          src="/images/icons/filter.svg"
          className="hidden lg:block"
          width={20}
          height={20}
          alt="icon filter"
        />
        Sort & Filters
      </div>
      {sortFilter?.map((filter: any, index: number) => {
        return (
          <div key={index}>
            <p className="my-[12px] text-[14px] capitalize font-semibold">
              {filter?.name}
            </p>
            {filter?.values?.map((value: any, _index: number) => {
              return (
                <div
                  key={_index}
                  className={clsx(
                    "flex gap-[6px] py-[3px] items-center text-[14px] leading-[22px]",
                    filter?.name === filterTitle?.CURRENCY_TYPE
                      ? "uppercase"
                      : "capitalize"
                  )}
                >
                  <input
                    type={"checkbox"}
                    value={value}
                    checked={listCheck.some((check) => value === check)}
                    onChange={(e) =>
                      handleChange(e?.target?.value, e?.target?.checked)
                    }
                  />
                  {value}
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="block lg:hidden w-full h-[1px] bg-[#002464] bg-opacity-20 mt-5" />
      <button
        className="w-full text-[14px] font-semibold bg-[#002464] text-white py-2 rounded-[4px] mt-5"
        onClick={() => handleFilter()}
      >
        Apply
      </button>
      <button
        className="w-full text-[14px] font-semibold py-2 rounded-[4px] mt-1"
        onClick={() => handleClear()}
      >
        Clear All
      </button>
    </div>
  );
};

export default SortFilter;
