import { BuyBoxModalType } from "@/types/modal-type";
import { getBoxesText, getNumberFormatUs } from "@/utils";
import { useMemo } from "react";
import Modal from "../custom/modal-custom";

const BuyBoxModal = ({
  isOpen,
  data,
  numberBox,
  loading,
  handleHideModal,
  handleBuyBox,
}: BuyBoxModalType) => {
  const totalAmount = useMemo(() => {
    const price = data?.price ? data?.price : 0;
    const quantity = numberBox ? numberBox : 0;
    return price * quantity;
  }, [data?.price, numberBox]);

  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div className="px-3 pb-5">
        <h2 className="text-[28px] leading-[39px] font-[600]">Buy Box</h2>
        <p className="mt-2 text-[14px]">
          Please confirm the below information.
        </p>
        <div className="grid gap-3 p-5 mt-5 bg-[#F4F7FF] rounded-[9px]">
          <div className="grid grid-cols-2 gap-5">
            <p className="text-[14px] opacity-60 leading-[22px] text-left">
              Number of boxes
            </p>
            <p className="text-[16px] font-[600] leading-[22px] text-right">
              {getBoxesText(numberBox)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <p className="text-[14px] opacity-60 leading-[22px] text-left">
              Price per box
            </p>
            <p className="text-[16px] font-[600] leading-[22px] text-right">
              {`${
                typeof data?.price === "number"
                  ? getNumberFormatUs(data?.price)
                  : "_"
              } ${data?.sylbol || "_"}`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <p className="text-[14px] opacity-60 leading-[22px] text-left">
              Total amount
            </p>
            <p className="text-[16px] font-[600] leading-[22px] text-right">
              {`${
                typeof totalAmount === "number"
                  ? getNumberFormatUs(totalAmount)
                  : "_"
              } ${data?.sylbol || "_"}`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            className="h-[40px] btn-line rounded-[4px] text-[14px]"
            onClick={() => handleHideModal()}
          >
            Cancel
          </button>
          <button
            className="btn-fill h-[40px] rounded-[4px] text-[14px] disabled:opacity-50"
            disabled={loading}
            onClick={() => handleBuyBox()}
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuyBoxModal;
