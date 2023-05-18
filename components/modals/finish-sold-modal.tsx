import { FinishSoldModalType } from "@/types/modal-type";
import Image from "next/image";
import Modal from "../custom/modal-custom";
import { hiddenLongText } from "@/utils";
import Link from "next/link";
import { NFT_CONTRACT_VIEW, TRANSACTION_HASH } from "@/hooks/use-contract";

const FinishSoldModal = ({
  isOpen,
  id,
  isProcessing,
  transaction,
  isSuccess,
  handleHideModal,
}: FinishSoldModalType) => {
  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[420px] md:px-5 text-left"
      >
        {isSuccess ? (
          <>
            <div className="w-fit mx-auto">
              {isProcessing ? (
                <Image
                  src="/images/icons/loading.svg"
                  className="min-w-[60px] animate-spin"
                  width={60}
                  height={60}
                  alt="icon success"
                />
              ) : (
                <Image
                  src="/images/icons/icon_success_normal.svg"
                  className="min-w-[60px]"
                  width={60}
                  height={60}
                  alt="icon success"
                />
              )}
            </div>
            <div className="text-[28px] mt-3 leading-[39px] font-semibold text-center">
              {`You’ve successfully sold #${id} NFT`}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-3 px-5 pb-2">
              <div className="text-[14px] leading-[22px] opacity-60">
                Status
              </div>
              <div className="text-[14px] leading-[22px] opacity-60 text-right">
                Transaction Hash
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-3 px-5 py-3 bg-[#F4F7FF] rounded-[8px]">
              {isProcessing ? (
                <div className="text-[14px] leading-[22px]">Processing....</div>
              ) : (
                <div className="flex text-[14px] leading-[22px] text-[#30A666] gap-1">
                  <Image
                    src="/images/icons/icon_success_normal.svg"
                    className="min-w-[20px]"
                    width={20}
                    height={20}
                    alt="icon success small"
                  />
                  Completed
                </div>
              )}
              {transaction?.hash ? (
                <Link
                  href={`${TRANSACTION_HASH}/${transaction?.hash}`}
                  target={"_blank"}
                >
                  <div className="text-[14px] leading-[22px] text-right truncate text-[#2152CB]">
                    {hiddenLongText(transaction?.hash)}
                  </div>
                </Link>
              ) : (
                <div className="text-[14px] leading-[22px] text-right truncate">
                  --
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Image
              src="/images/icons/cross_x_red.svg"
              className="min-w-[60px] mx-auto"
              width={60}
              height={60}
              alt="icon success"
            />
            <div className="text-[28px] mt-3 leading-[39px] font-semibold text-center">
              {`Fail to purchase #${id} NFT`}
            </div>
            <div className="text-[14px] leading-[22px] text-center mt-2">
              Purchases may fail due to network issues, high gas fees, or
              because someone else bought NFT before you
            </div>
            <div className="text-center">
              <button
                className="btn-fill w-full max-w-[180px] h-[40px] mx-auto mt-5"
                onClick={() => handleHideModal()}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FinishSoldModal;
