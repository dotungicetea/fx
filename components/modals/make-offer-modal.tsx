/* eslint-disable react-hooks/exhaustive-deps */
import { MakeOfferModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState } from "react";
import DurationListModal from "./duration-list-modal";
import { formatTimeType, formatTimeUTCString } from "@/utils/time";
import ConfirmPurchaseModal from "./confirm-purchase-modal";
import FinishPurchaseModal from "./finish-purchase-modal";
import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";
import SeaportAbi from "@/types/Seaport.json";
import {
  BUSD_CONTRACT,
  FEE_RECIPIENT,
  FX_NFT_CONTRACT,
  MARKET_CONTRACT,
} from "@/hooks/use-contract";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { serviceFee } from "@/constants";
import { getUserFromLocal } from "@/utils/network";
import { createOrderApi } from "@/services/market";
import { useContext } from "react";
import { ToastContext } from "../context/toast-context";
import { toastType } from "@/constants/context";
import { getDifferenceBelow } from "@/utils/market";
import { errorMessageCode } from "@/constants/error";
import { orderStatus } from "@/constants";
var CryptoJS = require("crypto-js");

const MakeOfferModal = ({
  isOpen,
  listing,
  nftDetail,
  priceOffer,
  currentPrice,
  address,
  reloadData,
  isShowConfirmPurchase,
  setPriceOffer,
  handleHideModal,
  handleShowModal,
  setReloadData,
  showConfirmPurchase,
  hideConfirmPurchase,
}: MakeOfferModalType) => {
  const { toast } = useContext(ToastContext);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>();
  const [startDatetime, setStartDatetime] = useState<any>();
  const [endDatetime, setEndDatetime] = useState<any>();
  const [isShowFinishPurchase, setIsShowFinishPurchase] =
    useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleShowFinishPurchase = () => setIsShowFinishPurchase(true);
  const handleHideFinishPurchase = () => setIsShowFinishPurchase(false);

  const currentListing = useMemo(() => {
    const listingCreated = listing?.find(
      (data: any) => data?.event_type === orderStatus?.CREATE
    );
    return listingCreated ? listingCreated : {};
  }, [listing]);

  const handleShowConfirmPurchase = () => {
    if (priceOffer == currentPrice) {
      toast(
        "Offered price must be different from current listing price.",
        toastType.ERROR
      );
      return;
    }
    handleHideModal();
    showConfirmPurchase();
  };

  const handleHideConfirmPurchase = () => {
    handleShowModal();
    hideConfirmPurchase();
  };

  const handleShowModalDuration = () => {
    setIsShow(true);
    handleHideModal();
  };
  const handleHideModalDuration = () => {
    setIsShow(false);
    handleShowModal();
  };

  const handleChangePrice = (value: string) => {
    if (!value) {
      setPriceOffer(undefined);
      return;
    }
    const numberPrice = Number(value);
    if (numberPrice < 1 || numberPrice > 100000000) {
      setPriceOffer(undefined);
      return;
    }
    setPriceOffer(numberPrice);
  };

  const getDurationText = useMemo(() => {
    if (dateRange?.value) {
      return dateRange.name;
    }
    if (startDatetime && endDatetime) {
      const startTime = formatTimeType(startDatetime, true);
      const endTime = formatTimeType(endDatetime, true);
      return `${startTime} - ${endTime}`;
    }
    return "Please select";
  }, [dateRange]);

  const handleMakeOffer = async () => {
    if (typeof window !== "undefined") {
      setErrorMessage("");
      try {
        const windowAny = window as any;
        const metamaskProvider = windowAny?.ethereum?.providers?.find((p: any) => p.isMetaMask);
        if (metamaskProvider && typeof windowAny?.ethereum.setSelectedProvider === 'function') {
          windowAny?.ethereum.setSelectedProvider(metamaskProvider);
        }
        
        const provider = new ethers.providers.Web3Provider(windowAny?.ethereum);

        const seaport = new Seaport(provider, {
          overrides: {
            contractAddress: MARKET_CONTRACT,
          },
        });

        const startTime = (Date.parse(startDatetime) / 1000).toString();
        const endTime = (Date.parse(endDatetime) / 1000).toString();

        if (priceOffer == currentPrice) {
          toast(
            "Offered price must be different from current listing price.",
            toastType.ERROR
          );
        }

        const orderParam: any = {
          startTime,
          endTime,
          offer: [
            {
              amount: ethers.utils
                .parseEther(priceOffer?.toString() || "0")
                .toString(),
              token: BUSD_CONTRACT,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC721,
              token: FX_NFT_CONTRACT,
              identifier:
                typeof nftDetail?.nft_id === "number"
                  ? nftDetail?.nft_id?.toString()
                  : nftDetail?.nft_id,
            },
          ],
          fees: [
            {
              recipient: FEE_RECIPIENT,
              basisPoints: serviceFee * 100,
            },
          ],
        };

        const { executeAllActions } = await seaport.createOrder(
          orderParam,
          address
        );

        const order = (await executeAllActions()) as any;
        order.wait && order.wait();

        const signer = provider.getSigner();

        const seaportContract = new ethers.Contract(
          MARKET_CONTRACT,
          SeaportAbi.abi,
          signer
        );
        const orderHash = await seaportContract.getOrderHash(order.parameters);

        var hashText = CryptoJS.AES.encrypt(
          JSON.stringify(order.parameters),
          process.env.NEXT_PUBLIC_HASH_KEY
        ).toString();
        const user = getUserFromLocal();

        const result = (await createOrderApi({
          input_order: hashText,
          order_hash: orderHash,
          wallet_address: address || "",
          signature: user?.signature,
          order_signature: order.signature,
        })) as any;
        if (result && result?.data?.data) {
          handleHideModal();
          hideConfirmPurchase();
          handleShowFinishPurchase();
          setIsSuccess(true);
          setReloadData(!reloadData);
        } else {
          handleHideModal();
          hideConfirmPurchase();
          handleShowFinishPurchase();
          setIsSuccess(false);
          result?.data?.message?.errCode === errorMessageCode?.myOrderExist &&
            setErrorMessage(
              "Submitting a new offer will replace the previous one, as only one offer is allowed per NFT at a time."
            );
        }
      } catch (e) {
        handleHideModal();
        hideConfirmPurchase();
        handleShowFinishPurchase();
        setIsSuccess(false);
      }
    }
  };

  const differenceBelow = useMemo(() => {
    if (!currentPrice || !priceOffer) return "--";
    return getDifferenceBelow(
      currentPrice,
      priceOffer,
      "% below listing price",
      "% above listing price"
    );
  }, [currentPrice, priceOffer]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleHideModal}>
        <div
          style={{ width: "calc(90vw - 40px)" }}
          className="md:w-[100vw] max-w-[440px] md:px-5 text-left"
        >
          <div className="text-[28px] leading-[39px] font-semibold text-center">
            {`Make an offer for #${nftDetail?.nft_id}`}
          </div>
          {priceOffer && (
            <p className="mt-2 text-[14px] leading-[22px] text-center">
              You currently have an active offer for this NFT. Submitting a new
              offer will replace the previous one, as only one offer is allowed
              per NFT at a time.
            </p>
          )}
          <div className="mt-5 p-5 bg-[#F4F7FF] rounded-[8px]">
            <div className="text-[18px] leading-[25px] font-semibold">
              Set new price
            </div>
            <div className="grid grid-cols-2 mt-3 items-center">
              <div className="text-[14px] leading-[22px] whitespace-nowrap">
                Current listing price
              </div>
              <div className="text-[14px] leading-[22px] font-semibold text-right">{`${
                currentPrice || "--"
              } BUSD`}</div>
            </div>
            <div className="grid md:grid-cols-2 mt-2 items-center">
              <div className="text-[14px] leading-[22px]">
                New Listing Price
              </div>
              <div className="text-[14px] leading-[22px] font-semibold text-right">
                <div className="flex w-full items-center gap-2 p-1 border border-[#0A1E4233] rounded-[4px] bg-white">
                  <input
                    className={clsx(
                      "w-full outline-none border-none pl-2",
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                    value={priceOffer}
                    placeholder="Enter amount"
                    onChange={(e) => handleChangePrice(e?.target?.value)}
                    type="number"
                  />
                  <span className="px-2 py-1 bg-[#0A1E42] rounded-[4px] text-white">
                    BUSD
                  </span>
                </div>
                <div className="text-[10px] leading-[16px] font-normal mt-1">
                  {priceOffer ? differenceBelow : ""}
                </div>
              </div>
            </div>
            <div className="flex mt-8 justify-between">
              <div className="flex text-[18px] leading-[25px] font-semibold">
                <span>Duration</span>
              </div>
            </div>
            <div
              className="flex gap-1 h-[40px] px-[12px] cursor-pointer items-center bg-white mt-5 rounded-[6px] border-[1.5px] border-transparent"
              onClick={() => handleShowModalDuration()}
            >
              <Image
                src="/images/icons/calendar.svg"
                width={16}
                height={16}
                alt="calendar icon"
              />
              <p className="w-full text-[14px] leading-[22px] truncate">
                {getDurationText}
              </p>
              <Image
                src="/images/icons/arrow_down.svg"
                width={14}
                height={14}
                alt="arrow down"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <button
              className="btn-line h-[40px]"
              onClick={() => handleHideModal()}
            >
              Cancel
            </button>
            <button
              className="btn-fill h-[40px]"
              disabled={!priceOffer || !startDatetime || !endDatetime}
              onClick={() => handleShowConfirmPurchase()}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <DurationListModal
        isOpen={isShow}
        dateRange={dateRange}
        startDatetime={startDatetime}
        endDatetime={endDatetime}
        limitEndDatetime={currentListing?.expiration_time}
        setDateRange={setDateRange}
        setStartDatetime={setStartDatetime}
        setEndDatetime={setEndDatetime}
        handleHideModal={handleHideModalDuration}
      />

      <ConfirmPurchaseModal
        isOpen={isShowConfirmPurchase}
        nftDetail={nftDetail}
        listingPrice={currentPrice}
        handleMakeOffer={handleMakeOffer}
        handleHideModal={handleHideConfirmPurchase}
      />

      <FinishPurchaseModal
        isOpen={isShowFinishPurchase}
        isSuccess={isSuccess}
        id={nftDetail?.nft_id}
        errorMessage={errorMessage}
        handleHideModal={handleHideFinishPurchase}
      />
    </>
  );
};

export default MakeOfferModal;
