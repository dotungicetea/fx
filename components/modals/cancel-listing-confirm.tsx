import { CancelListingConfirmModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";

const CancelListingConfirm = ({
  isOpen,
  isCancelAction,
  isCancelBeforeEdit,
  handleHideModal,
  handleCancelListing,
}: CancelListingConfirmModalType) => {
  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[384px] text-left"
      >
        <div className="text-[24px] leading-[33px] font-semibold text-center">
          {isCancelAction && "Cancel Listing"}
          {isCancelBeforeEdit && "Cancel Current Listing"}
        </div>
        {isCancelAction && (
          <div className="text-[14px] leading-[22px] text-center mt-5">
            If you cancel your listing, it will be removed from the marketplace
            and cannot be fulfilled.{" "}
            <span className="font-bold">Canceling requires a gas fee</span> to
            ensure that it is permanently removed.
          </div>
        )}
        {isCancelBeforeEdit && (
          <div className="text-[14px] leading-[22px] text-center mt-5">
            If you want to change the price. you will be asked to cancel your
            current listings first{" "}
            <span className="font-bold">This will cost gas</span>.
          </div>
        )}
        <div className="text-[14px] leading-[22px] text-center mt-5 font-bold">
          Are you sure you want to cancel your listing?
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            className="h-[40px] max-w-[160px] ml-auto w-full btn-line"
            onClick={() => handleHideModal()}
          >
            No
          </button>
          <button
            className="h-[40px] max-w-[160px] btn-fill"
            onClick={() => handleCancelListing()}
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelListingConfirm;
