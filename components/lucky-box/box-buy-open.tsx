/* eslint-disable react-hooks/exhaustive-deps */
import { getBoxesText } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  isOpen?: boolean;
  data?: any;
  numberBox: any;
  handleNumBox: any;
  disabled?: boolean;
  loading?: boolean;
  isBoxOpen?: boolean;
  isWaiting?: boolean;
  actionPopup?: () => void;
}

const BoxBuyOpen = ({
  isOpen,
  data,
  numberBox,
  handleNumBox,
  disabled,
  isBoxOpen,
  loading,
  isWaiting,
  actionPopup,
}: Props) => {
  const handleChangeNumberBox = (numberPlus: number) => {
    const numberBoxPlus = numberBox + numberPlus;
    if (isOpen && numberBox >= data?.purchased && numberPlus > 0) return;
    if (numberBoxPlus <= 0 && numberBox > 0) handleNumBox(0);
    if (isBoxOpen) {
      const boxWaitToOpen = data?.purchased - data?.opened;
      const isOverMaxBox = boxWaitToOpen < numberBoxPlus;
      const boxCanOpen = isOverMaxBox ? boxWaitToOpen : numberBoxPlus;
      const numboxSet =
        boxCanOpen >= 0 ? (boxCanOpen >= 10 ? 10 : boxCanOpen) : 0;
      handleNumBox(numboxSet);
    } else {
      if (numberBoxPlus >= 0) handleNumBox(numberBoxPlus);
    }
  };

  const handleChangeNumberBoxMax = () => {
    if (!data || data?.purchased <= data?.opened) return;
    const boxWaitToOpen = data?.purchased - data?.opened;
    const maxBoxToOpen = boxWaitToOpen >= 10 ? 10 : boxWaitToOpen;
    handleNumBox(maxBoxToOpen);
  };

  const isCannotOpenBox = useMemo(() => {
    if (isOpen && data?.purchased <= 0) return true;
    return false;
  }, [data?.purchased, isOpen]);

  const handleActionPopup = () => {
    if (actionPopup) actionPopup();
  };

  const totalAmount = useMemo(() => {
    const price = data?.price ? data?.price : 0;
    const quantity = numberBox ? numberBox : 0;
    return price * quantity;
  }, [data?.price, numberBox]);

  return (
    <div className="border-[1px] border-[#00246433] bg-white rounded-[8px] pt-[14px] pr-[12px] pb-[16px] pl-[14px] border-opacity-20">
      <h2 className="text-[18px] leading-[25px] font-[600] text-[#2152CB]">
        {isOpen ? "Open Box" : "Buy Box"}
      </h2>
      <div className="flex justify-between mt-[14px]">
        <p className="text-[12px] text-[#0A1E42] leading-[19px] opacity-60">
          {isOpen ? "Purchased" : "Price per box"}
        </p>
        <p className="text-[12px] text-[#0A1E42] leading-[19px] font-[600]">
          {isOpen
            ? getBoxesText(data?.purchased)
            : `${typeof data?.price === "number" ? data?.price : "_"} ${
                data?.sylbol ? data?.sylbol : "_"
              }`}
        </p>
      </div>
      <div className="flex justify-between mt-[14px]">
        <p className="text-[12px] text-[#0A1E42] leading-[19px] opacity-60">
          {isOpen ? "Opened" : "Supported"}
        </p>
        <div
          className={clsx(
            "flex items-center gap-[6px] text-[12px] text-[#0A1E42] leading-[19px] font-[600]",
            isOpen ? "" : "uppercase"
          )}
        >
          {!isOpen && (
            <Image
              src={`/images/networks/${data?.token}.png`}
              width={20}
              height={20}
              alt="logo networks"
            />
          )}
          {isOpen
            ? `${data?.opened}/${getBoxesText(data?.purchased)}`
            : `${data?.token}`}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-[12px] text-[#0A1E42] leading-[19px] opacity-60">
          {isOpen ? "Open" : "Quantity"}
        </p>
        <div className="flex items-center gap-[2px] p-[4px] border-[1px] bg-[#F4F7FF] border-[#0A1E4233] rounded-[4px]">
          <button
            className={clsx(
              "w-[25px] h-[28px] bg-[#0A1E42] rounded-[4px] text-white leading-[25px] font-mono",
              "disabled:opacity-50"
            )}
            onClick={() => handleChangeNumberBox(-1)}
            disabled={
              isCannotOpenBox || (!isBoxOpen && typeof data?.price !== "number")
            }
          >
            -
          </button>
          <p className="text-[14px] mx-[10px] leading-[19px] text-[#0A1E42] font-[600]">
            {numberBox}
          </p>
          <button
            className={clsx(
              "w-[25px] h-[28px] bg-[#0A1E42] rounded-[4px] text-white leading-[25px] font-mono",
              "disabled:opacity-50"
            )}
            onClick={() => handleChangeNumberBox(1)}
            disabled={
              isCannotOpenBox || (!isBoxOpen && typeof data?.price !== "number")
            }
          >
            +
          </button>
          {isOpen && (
            <button
              className={clsx(
                "w-[45px] h-[28px] bg-[#0A1E42] rounded-[4px] text-white leading-[25px] font-mono",
                "disabled:opacity-50"
              )}
              onClick={() => handleChangeNumberBoxMax()}
              disabled={isCannotOpenBox}
            >
              Max
            </button>
          )}
        </div>
      </div>
      <div className="h-[1px] bg-[#0A1E42] opacity-20 my-[12px]" />
      {isOpen ? (
        <div className="text-[10px] text-center text-[#0A1E42] leading-[19px] opacity-60">
          Up to 10 boxes can be opened at once.
        </div>
      ) : (
        <div className="flex justify-between mt-[14px]">
          <p className="text-[12px] text-[#0A1E42] leading-[19px] opacity-60">
            Total amount
          </p>
          <p className="text-[12px] text-[#0A1E42] leading-[19px] font-[600]">
            {`${totalAmount} ${data?.sylbol ? data?.sylbol : "_"}`}
          </p>
        </div>
      )}
      <button
        className={clsx(
          "w-full h-[40px] mt-[12px] text-white text-[14px] rounded-[4px] font-[600] bg-[#002464]",
          "disabled:opacity-50"
        )}
        onClick={() => handleActionPopup()}
        disabled={
          isCannotOpenBox || numberBox <= 0 || disabled || loading || isWaiting
        }
      >
        {isWaiting
          ? "waiting..."
          : isOpen
          ? loading
            ? "Loading..."
            : "Open  Box"
          : "Buy Box"}
      </button>
    </div>
  );
};

export default BoxBuyOpen;
