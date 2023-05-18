import { pathname } from "@/constants/nav";
import { OpenBoxModalType } from "@/types/modal-type";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import CardNft from "../custom/card-nft";
import Modal from "../custom/modal-custom";

const OpenBoxModal = ({
  isOpen,
  boxsOpen,
  handleHideModal,
}: OpenBoxModalType) => {
  const [isShowCurrencyCards, setIsShowCurrencyCards] =
    useState<boolean>(false);

  const handleVideoEnded = () => {
    if (isOpen && boxsOpen && boxsOpen?.length > 0) {
      if (document) {
        const listCard = document.getElementsByClassName("card-open") as any;
        if (listCard && listCard?.length === 0) return;
        const middleCardIndex = Number.parseInt(`${listCard?.length / 2}`);
        [...Array(listCard?.length)].forEach((_, index) => {
          listCard[index].style.left = `calc(50% + ${
            (index - middleCardIndex) * 30
          }px)`;
          listCard[index].style.bottom = `calc(50% + ${
            5 -
            (index - middleCardIndex >= 0
              ? index - middleCardIndex
              : middleCardIndex - index) *
              5
          }px)`;
          listCard[index].style.transform = `translate(-50%, 0) rotate(${
            0 + (index - middleCardIndex) * (boxsOpen?.length > 5 ? 10 : 20)
          }deg) scale(1)`;
          listCard[index].style.transitionDelay = `${index * 0.1}s`;
        });
        const delayTime = boxsOpen?.length * 0.1 + 0.7;
        setTimeout(() => {
          setIsShowCurrencyCards(true);
        }, delayTime * 1000);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        handleVideoEnded();
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} isNormalModal={false} onClose={handleHideModal}>
      {!isShowCurrencyCards ? (
        <div className="relative z-10 select-none">
          <div className="open-box-animation" />
          <div>
            {boxsOpen &&
              boxsOpen.map((card: any, index) => {
                return (
                  <div
                    key={index}
                    className="card-open bottom-[50%] left-[50%]"
                  >
                    <CardNft
                      className="w-[120px] h-[180px]"
                      baseMp={card?.base_mp}
                      level={card?.level}
                      rarity={card?.rarity}
                      symbol={card?.symbol}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="father-popup-card relative">
          <div className="relative bg-white rounded-lg popup-card-open">
            <button
              type="button"
              className="absolute scale-[0.8] hover:scale-[0.9] duration-300 top-3 right-2.5 bg-[#0A1E42] rounded-[50%] text-sm p-1.5 ml-auto inline-flex items-center"
              data-modal-hide="popup-modal"
              onClick={() => handleHideModal()}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="text-white"
                  clipRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 pt-10 pb-6 text-center">
              <div>
                <div
                  className={clsx(
                    "flex gap-[12px] justify-center max-w-[894px] flex-wrap pt-3",
                    boxsOpen && boxsOpen?.length > 1 ? "list-card" : ""
                  )}
                >
                  {boxsOpen &&
                    boxsOpen.map((card: any, index) => {
                      return (
                        <CardNft
                          key={index}
                          baseMp={card?.base_mp}
                          level={card?.level}
                          rarity={card?.rarity}
                          symbol={card?.symbol}
                        />
                      );
                    })}
                </div>
                <p className="text-[28px] font-[600] mt-5">Congratulation!</p>
                <p className="text-[14px] opacity-80">
                  {`You’ve opened ${boxsOpen?.length} currency cards`}
                </p>
                <Link href={`${pathname?.MYACCOUNT}${pathname.MYCARDS}`}>
                  <button className="btn-fill w-full max-w-[230px] h-[40px] mt-5 rounded-[4px] text-[14px] leading-[25px]">
                    Go to My Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OpenBoxModal;
