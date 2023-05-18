import { ApproveListingModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import CardNft from "../custom/card-nft";
import { Tooltip } from "@/components/custom/tooltip";

const ApproveListingModal = ({
  isOpen,
  nftDetail,
  listingPrice,
  duration,
  fee,
  potentialEarning,
  handleHideModal,
}: ApproveListingModalType) => {
  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[410px] text-left"
      >
        <div className="text-[28px] font-semibold text-center">
          Approve Listing
        </div>
        <div className="text-[14px] leading-[22px] mt-2 pb-5 text-center">
          Please review and confirm this listing from your wallet.
          <br />
          This action requires gas fee.
        </div>
        <div className="flex gap-5 flex-wrap items-center p-3 bg-[#F4F7FF] rounded-[8px]">
          <div className="w-[120px] min-w-[120px] mx-auto">
            <CardNft
              size="sm"
              baseMp={nftDetail?.bmp || ""}
              level={nftDetail?.level || ""}
              rarity={nftDetail?.rarity}
              symbol={nftDetail?.symbol}
            />
          </div>
          <div className="w-full max-w-[240px] mx-auto">
            <div className="text-[18px] leading-[25px] font-semibold">{`${nftDetail?.name} #${nftDetail?.id}`}</div>
            <div className="grid grid-cols-2 gap-2 text-[14px] leading-[19px] mt-3">
              <div style={{ letterSpacing: -0.2 }}>Listing Price</div>
              <div className="text-right font-semibold truncate">{`${listingPrice} BUSD`}</div>
            </div>
            <Tooltip content={duration}>
            <div className="grid grid-cols-2 gap-2 text-[14px] leading-[19px] mt-2">
              <div style={{ letterSpacing: -0.2 }}>Duration</div>
              <div className="text-right font-semibold truncate">{duration}</div>
            </div>
            </Tooltip>
            <div className="grid grid-cols-2 gap-2 text-[14px] leading-[19px] mt-2">
              <div style={{ letterSpacing: -0.2 }}>Service fee</div>
              <div className="text-right font-semibold">{`${fee}%`}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[14px] leading-[19px] mt-2">
              <div style={{ letterSpacing: -0.2 }}>Potential earnings</div>
              <div className="text-right font-semibold truncate">{`${potentialEarning} BUSD`}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveListingModal;
