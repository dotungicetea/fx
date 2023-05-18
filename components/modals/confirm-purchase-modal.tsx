import { ConfirmPurchaseModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import CardNft from "../custom/card-nft";
import clsx from "clsx";

const ConfirmPurchaseModal = ({
  isOpen,
  nftDetail,
  listingPrice,
  handleMakeOffer,
  handleHideModal,
}: ConfirmPurchaseModalType) => {
  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[410px] text-left"
      >
        <div className="text-[28px] font-semibold text-center">
          Confirm Purchase
        </div>
        <div className="text-[14px] leading-[22px] mt-2 pb-5 text-center">
          Please review and confirm your purchase of the NFT listed below. This
          action requires gas fee.
        </div>
        <div className="flex gap-5 flex-wrap p-3 bg-[#F4F7FF] rounded-[8px]">
          <div className="w-[120px] min-w-[120px] mx-auto">
            <CardNft
              size="sm"
              baseMp={nftDetail?.bmp || ""}
              level={nftDetail?.level || ""}
              rarity={nftDetail?.rarity}
              symbol={nftDetail?.symbol}
              prices={listingPrice}
            />
          </div>
          <div className="w-full max-w-[240px] pt-3 mx-auto">
            <div className="text-[18px] leading-[25px] font-semibold">{`${nftDetail?.name} #${nftDetail?.id}`}</div>
            <div className="grid grid-cols-2 gap-2 text-[14px] leading-[19px] mt-3">
              <div style={{ letterSpacing: -0.2 }}>Listing Price</div>
              <div className="text-right font-semibold truncate">{`${listingPrice} BUSD`}</div>
              <div style={{ letterSpacing: -0.2 }}>Rarity</div>
              <div className="flex gap-1 items-center justify-end text-right font-semibold truncate">
                <div
                  className={clsx(
                    "w-[12px] min-w-[12px] h-[12px] rounded-full",
                    `${nftDetail?.rarity?.toLowerCase()}-type`
                  )}
                />
                {nftDetail?.rarity}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            className="btn-line w-full h-[40px]"
            onClick={() => handleHideModal()}
          >
            Cancel
          </button>
          <button
            className="btn-fill w-full h-[40px]"
            onClick={() => handleMakeOffer()}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmPurchaseModal;
