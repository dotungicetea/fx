/* eslint-disable react-hooks/exhaustive-deps */
import { AcceptOfferModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import { getDifferenceBelow, getFrom } from "@/utils/market";
import { getNumberFormatUs } from "@/utils";
import { convertDecimalToNum } from "@/utils/network";
import { formatTimestampToDate } from "@/utils/time";
import { serviceFee } from "@/constants";
import { Tooltip } from "../custom/tooltip";
import Image from "next/image";
import { useMemo } from "react";

const AcceptOfferModal = ({
  isOpen,
  order,
  address,
  currentPrice,
  handleHideModal,
  handleAcceptOffer,
}: AcceptOfferModalType) => {

  const getPotentialEarnings = useMemo(() => {
    if (order?.end_amount === null || order?.end_amount < 1) return "--";
    const price = convertDecimalToNum(order?.end_amount);
    const fee = serviceFee * 0.01 * price;
    return getNumberFormatUs(price - fee);
  }, [order?.end_amount, serviceFee]);

  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[410px] text-left"
      >
        <div className="text-[28px] font-semibold text-center">
          Accept this offer
        </div>
        <div className="text-[14px] leading-[22px] mt-2 pb-5 text-center">
          When you accept an offer for your NFT, the sale will be completed, and
          accepting the offer will require a gas fee.
        </div>
        <div className="p-5 bg-[#F4F7FF] rounded-[8px] mt-5">
          <div className="text-[18px] leading-[25px] font-semibold">
            Offer from{" "}
            <span className="text-[#2152CB]">
              {getFrom(address, order?.offerer)}
            </span>
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-3">
            <div className="w-[130px] min-w-[130px]">Offered price</div>
            <div className="w-full text-right font-semibold">{`${getNumberFormatUs(
              convertDecimalToNum(order?.end_amount)
            )} BUSD`}</div>
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-2">
            <div className="w-[130px] min-w-[130px]">Difference</div>
            <div className="w-full text-right font-semibold truncate">
              {getDifferenceBelow(
                currentPrice,
                order?.end_amount,
                "% below your listing price",
                "% above your listing price"
              )}
            </div>
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-2">
            <div className="w-[130px] min-w-[130px]">Expiration</div>
            <div className="w-full text-right font-semibold truncate">
              {formatTimestampToDate(order?.expiration_time)}
            </div>
          </div>
          <div className="text-[18px] mt-5 leading-[25px] font-semibold">
            You earnings
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-2">
            <div className="w-[130px] min-w-[130px] flex gap-1 items-center">
              Service fee
              <Tooltip
                content="All NFT Currency transactions (buy or sell) involves a 3% fee that
          funds the buyback wallet."
              >
                <Image
                  src="/images/icons/info_dark.svg"
                  width={12}
                  height={12}
                  alt="icon info dark"
                />
              </Tooltip>
            </div>
            <div className="w-full text-right font-semibold truncate">
              {`${serviceFee}%`}
            </div>
          </div>
          <div className="flex gap-1 text-[14px] leading-[22px] mt-2">
            <div className="w-[130px] min-w-[130px]">Total earnings</div>
            <div className="w-full text-right font-semibold truncate text-[#2152CB]">
              {`${getPotentialEarnings} BUSD`}
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
            onClick={() => handleAcceptOffer()}
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptOfferModal;
