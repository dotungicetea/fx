import { CancelOfferModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import { getNumberFormatUs } from "@/utils";
import { convertDecimalToNum } from "@/utils/network";
import { getDifferenceBelow } from "@/utils/market";
import { formatTimestampToDate } from "@/utils/time";

const CancelOfferModal = ({
  isOpen,
  order,
  currentPrice,
  handleHideModal,
  handleCancelOffer,
}: CancelOfferModalType) => {
  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[420px] md:px-5 text-left"
      >
        <div className="text-[28px] leading-[39px] font-semibold text-center">
          Cancel Offer
        </div>
        <div className="text-[14px] leading-[22px] mt-2 text-center">
          Please review and confirm this cancelation from your wallet.
        </div>
        <div className="p-5 bg-[#F4F7FF] rounded-[8px] mt-5">
          <div className="text-[18px] leading-[25px] font-semibold">
            Your offers
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-3">
            <div className="w-[140px] min-w-[140px] whitespace-nowrap">Current listing price</div>
            <div className="w-full text-right font-semibold">{`${getNumberFormatUs(
              currentPrice
            )} BUSD`}</div>
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-[10px]">
            <div className="w-[140px] min-w-[140px]">Offered price</div>
            <div className="w-full text-right font-semibold">
              <p>{`${getNumberFormatUs(
                convertDecimalToNum(order?.end_amount)
              )} BUSD`}</p>
              <p className="text-[10px] leading-[16px] font-normal">
                {getDifferenceBelow(
                  currentPrice,
                  order?.end_amount,
                  "% below listing price",
                  "% above listing price"
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-2">
            <div className="w-[140px] min-w-[140px]">Expiration</div>
            <div className="w-full text-right font-semibold truncate">
              {formatTimestampToDate(order?.expiration_time, 0, true)}
            </div>
          </div>
        </div>
        <div className="mt-5 text-[14px] leading-[19px] font-semibold text-center">
          Are you sure you want to cancel your offer?
        </div>
        <div className="flex gap-2 mt-5">
          <button
            className="btn-line w-full h-[40px]"
            onClick={() => handleHideModal()}
          >
            No
          </button>
          <button
            className="btn-fill w-full h-[40px]"
            onClick={() => handleCancelOffer()}
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelOfferModal;
