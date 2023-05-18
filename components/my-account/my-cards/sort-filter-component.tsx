/* eslint-disable react-hooks/exhaustive-deps */
import { InputSearch } from "@/components/custom/input";
import { Tooltip } from "@/components/custom/tooltip";
import {
  filterIsOwner,
  filterRarity,
  filterStatus,
} from "@/constants/my-account";
import {
  FilterIsOwnerInMycardType,
  FilterPricesInMycardType,
  FilterRarityInMycardType,
  FilterStatusInMycardType,
  FilterTypeInMycardType,
} from "@/types/my-account-type";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export const FilterStatus = ({
  statusCheck,
  setStatusCheck,
}: FilterStatusInMycardType) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  return (
    <div>
      <p
        className="flex justify-between cursor-pointer select-none my-[12px] text-[14px] capitalize font-semibold"
        onClick={() => setIsShow(!isShow)}
      >
        Status
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </p>
      {isShow &&
        filterStatus?.map((status: any, _index: number) => {
          return (
            <div
              key={_index}
              className="flex gap-[6px] my-1 items-center text-[12px] leading-[22px]"
            >
              <input
                type={"radio"}
                name="status"
                value={status?.value}
                checked={statusCheck === status?.value}
                onChange={(e) =>
                  setStatusCheck && setStatusCheck(e?.target?.value)
                }
              />
              {status?.name}
            </div>
          );
        })}
    </div>
  );
};

export const FilterRarity = ({
  rarityCheck,
  setRarityCheck,
}: FilterRarityInMycardType) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  const handleChange = (value: string) => {
    if (!rarityCheck) return;
    const indexValue = rarityCheck.findIndex((rarity) => rarity === value);
    if (indexValue >= 0) {
      const cloneRarity = [...rarityCheck];
      cloneRarity.splice(indexValue, 1);
      setRarityCheck && setRarityCheck(cloneRarity);
    } else {
      setRarityCheck && setRarityCheck([...rarityCheck, value]);
    }
  };

  return (
    <div>
      <p
        className="flex justify-between cursor-pointer select-none my-[12px] text-[14px] capitalize font-semibold"
        onClick={() => setIsShow(!isShow)}
      >
        Rarity
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </p>
      {isShow &&
        filterRarity?.map((rarity: any, _index: number) => {
          return (
            <div
              key={_index}
              className="flex gap-[6px] my-1 items-center text-[12px] leading-[22px]"
            >
              <input
                type={"checkbox"}
                value={rarity?.value}
                checked={rarityCheck?.some((check) => rarity?.value === check)}
                onChange={(e) => handleChange(e?.target?.value)}
              />
              <div
                className={clsx(
                  `${rarity?.value?.toLowerCase()}-type`,
                  "w-[10px] h-[10px] rounded-full"
                )}
              />
              {rarity?.name}
            </div>
          );
        })}
    </div>
  );
};

export const FilterType = ({
  currencyType,
  typeCheck,
  setTypeCheck,
  setSearchCard,
}: FilterTypeInMycardType) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  const handleChange = (value: string) => {
    if (!typeCheck) return;
    const indexValue = typeCheck?.findIndex((type) => type === value);
    if (indexValue >= 0) {
      const cloneType = [...typeCheck];
      cloneType.splice(indexValue, 1);
      setTypeCheck && setTypeCheck(cloneType);
    } else {
      setTypeCheck && setTypeCheck([...typeCheck, value]);
    }
  };

  const handleChangeInput = (value: string) => {
    setTypeCheck && setTypeCheck([]);
    setSearchCard && setSearchCard(value);
  };

  return (
    <div>
      <p
        className="flex justify-between cursor-pointer select-none my-[12px] text-[14px] capitalize font-semibold"
        onClick={() => setIsShow(!isShow)}
      >
        Currency Type
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </p>
      {isShow && currencyType && currencyType?.length >= 5 && (
        <InputSearch
          isForm
          className="w-full before:top-1 border-[1px] border-[#D3D3D3]"
          padding="py-1 pl-2 pr-4 text-[12px]"
          searchSizes="sm"
          placeholder="Name or symbol"
          bg={"#ffffff"}
          border="1px solid #D3D3D3"
          onChange={handleChangeInput}
        />
      )}
      <div className="h-2" />
      {isShow &&
        currencyType?.map((type: any, _index: number) => {
          return (
            <div
              key={_index}
              className="flex gap-[6px] my-1 items-center text-[12px] leading-[22px]"
            >
              <input
                type={"checkbox"}
                value={type?.value}
                checked={typeCheck?.some((check) => type?.value === check)}
                onChange={(e) => handleChange(e?.target?.value)}
              />
              <Tooltip content={type?.name} isTop>
                <div className="truncate">{type?.value}</div>
              </Tooltip>
            </div>
          );
        })}
    </div>
  );
};

export const FilterOwner = ({
  isOwnerCheck,
  setIsOwnerCheck,
}: FilterIsOwnerInMycardType) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  return (
    <div>
      <p
        className="flex justify-between cursor-pointer select-none my-[12px] text-[14px] capitalize font-semibold"
        onClick={() => setIsShow(!isShow)}
      >
        Owner
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </p>
      {isShow &&
        filterIsOwner?.map((data: any, _index: number) => {
          return (
            <div
              key={_index}
              className="flex gap-[6px] my-1 items-center text-[12px] leading-[22px]"
            >
              <input
                type={"radio"}
                name="status"
                value={data?.value}
                checked={isOwnerCheck === data?.value}
                onChange={(e) =>
                  setIsOwnerCheck && setIsOwnerCheck(data?.value)
                }
              />
              {data?.name}
            </div>
          );
        })}
    </div>
  );
};

export const FilterPrices = ({
  filterPrices,
  setFilterPrices,
}: FilterPricesInMycardType) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");

  const handleApply = () => {
    const data = {
      max: max,
      min: min,
    };
    setFilterPrices && setFilterPrices(data);
  };

  useEffect(() => {
    if (!min && !max && filterPrices?.max && filterPrices?.min) {
      setFilterPrices && setFilterPrices({});
    }
  }, [min, max, filterPrices?.max, filterPrices?.min]);

  const validInputFilter = useMemo(() => {
    if (!min || !max) return true;
    const minNumb = Number(min);
    const maxNumb = Number(max);
    return (
      maxNumb < minNumb ||
      minNumb < 1 ||
      maxNumb < 1 ||
      minNumb > 100000000 ||
      maxNumb > 100000000
    );
  }, [min, max]);

  useEffect(() => {
    if ((min || max) && !filterPrices?.min && !filterPrices?.max) {
      setMin("");
      setMax("");
    }
  }, [filterPrices?.min, filterPrices?.max]);

  const handleOnChange = (value: string, callBack: (value: string) => void) => {
    if (!!value && (Number(value) > 100000000 || Number(value) < 1)) return;
    callBack(value);
  };

  return (
    <div>
      <p
        className="flex justify-between cursor-pointer select-none my-[12px] text-[14px] capitalize font-semibold"
        onClick={() => setIsShow(!isShow)}
      >
        Price in BUSD
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </p>
      {isShow && (
        <>
          <div className="flex items-center">
            <input
              type="number"
              value={min}
              min={1}
              max={100000000}
              className={clsx(
                "w-full h-[28px] px-2 text-[12px] text-center border border-[#0A1E4233] rounded-[4px] outline-none",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
              onChange={(e) => handleOnChange(e?.target?.value, setMin)}
            />
            <span className="text-[12px] leading-[16px] px-2 font-semibold">
              to
            </span>
            <input
              type="number"
              value={max}
              min={1}
              max={100000000}
              className={clsx(
                "w-full h-[28px] px-2 text-[12px] text-center border border-[#0A1E4233] rounded-[4px] outline-none",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
              onChange={(e) => handleOnChange(e?.target?.value, setMax)}
            />
          </div>
          <button
            className="btn-fill w-full h-[40px] mt-2"
            disabled={validInputFilter}
            onClick={() => handleApply()}
          >
            Apply
          </button>
        </>
      )}
    </div>
  );
};
