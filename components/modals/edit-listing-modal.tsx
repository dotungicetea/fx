/* eslint-disable react-hooks/exhaustive-deps */
import { EditListingModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  formatTimeType,
  formatTimeUTCString,
  formatTimestampToDate,
} from "@/utils/time";
import Image from "next/image";
import DurationListModal from "./duration-list-modal";
import ApproveListingModal from "./approve-listing-modal";
import ListNftSuccessModal from "./list-nft-success-modal";
import { getNumberFormatUs } from "@/utils";
import { serviceFee } from "@/constants";
import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";
import {
  BUSD_CONTRACT,
  FEE_RECIPIENT,
  FX_NFT_CONTRACT,
  MARKET_CONTRACT,
} from "@/hooks/use-contract";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import SeaportAbi from "@/types/Seaport.json";
import { getUserFromLocal } from "@/utils/network";
import { toastType } from "@/constants/context";
import { cancelOrder, createOrderApi } from "@/services/market";
import CancelListingConfirm from "./cancel-listing-confirm";
import { getDifferenceBelow } from "@/utils/market";
var CryptoJS = require("crypto-js");

const EditListingModal = ({
  isOpen,
  currentPrice,
  currentListing,
  price,
  address,
  nftDetail,
  reloadData,
  setReloadData,
  toast,
  setIsEditingNft,
  setPrice,
  handleShowModal,
  handleHideModal,
}: EditListingModalType) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>();
  const [startDatetime, setStartDatetime] = useState<any>();
  const [endDatetime, setEndDatetime] = useState<any>();
  const [showApproveListing, setShowApproveListing] = useState<boolean>(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState<boolean>(false);
  const [isChangeDuration, setIsChangeDuration] = useState<boolean>(false);
  const [isShowCancelConfirm, setIsShowCancelConfirm] =
    useState<boolean>(false);

  const handleShowModalDuration = () => {
    setIsShow(true);
    handleHideModal();
  };
  const handleHideModalDuration = () => {
    setIsShow(false);
    handleShowModal();
  };

  const handleCloseModal = () => {
    handleHideModal();
    setReloadData(!reloadData);
  };

  const handleShowApproveListing = () => setShowApproveListing(true);
  const handleHideApproveListing = () => setShowApproveListing(false);

  const handleShowApproveSuccess = () => setShowApproveSuccess(true);
  const handleHideApproveSuccess = () => setShowApproveSuccess(false);

  const handleShowCancelConfirm = () => setIsShowCancelConfirm(true);
  const handleHideCancelConfirm = () => setIsShowCancelConfirm(false);

  const handleChangePrice = (value: string) => {
    if (!value) {
      setPrice(null);
      return;
    }
    const numberPrice = Number(value);

    if (numberPrice < 1 || numberPrice > 100000000) {
      setPrice(null);
      return;
    }

    setPrice(numberPrice);
  };

  const getPrice = useMemo(() => {
    if (!price || price < 1) return "--";
    return getNumberFormatUs(price);
  }, [price]);

  const getPotentialEarnings = useMemo(() => {
    if (!price || price < 1) return "--";
    const fee = serviceFee * 0.01 * price;
    return getNumberFormatUs(price - fee);
  }, [price, serviceFee]);

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

  const createOrder = async () => {
    if (typeof window !== "undefined") {
      try {
        const windowAny = window as any;
        const provider = new ethers.providers.Web3Provider(windowAny?.ethereum);
        handleShowApproveListing();

        const seaport = new Seaport(provider, {
          overrides: {
            contractAddress: MARKET_CONTRACT,
          },
        });

        const startTime = isChangeDuration
          ? (Date.parse(startDatetime) / 1000).toString()
          : currentListing?.start_time?.toString();
        const endTime = isChangeDuration
          ? (Date.parse(endDatetime) / 1000).toString()
          : currentListing?.expiration_time?.toString();

        const orderParam: any = {
          startTime,
          endTime,
          offer: [
            {
              itemType: ItemType.ERC721,
              token: FX_NFT_CONTRACT,
              identifier:
                typeof nftDetail?.nft_id === "number"
                  ? nftDetail?.nft_id?.toString()
                  : nftDetail?.nft_id,
            },
          ],
          consideration: [
            {
              amount: ethers.utils
                .parseEther(price?.toString() || "0")
                .toString(),
              token: BUSD_CONTRACT,
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
        setIsEditingNft(true);

        const result = (await createOrderApi({
          input_order: hashText,
          order_hash: orderHash,
          wallet_address: address || "",
          signature: user?.signature,
          order_signature: order.signature,
        })) as any;
        if (result && result?.data?.data) {
          handleHideApproveListing();
          handleShowApproveSuccess();
          handleHideModal();
          setReloadData(!reloadData);
          setIsEditingNft(false);
        } else {
          handleShowModal();
          handleHideApproveListing();
          setIsEditingNft(false);
          toast(result?.data?.message?.errCode, toastType.ERROR);
        }
      } catch (error: any) {
        handleShowModal();
        handleHideApproveListing();
        setIsEditingNft(false);
        toast("Can't list nft", toastType.ERROR);
      }
    } else return;
  };

  const handleCancelOrder = async () => {
    handleHideCancelConfirm();
    try {
      if (!address) return;

      const windowAny = window as any;
      const provider = new ethers.providers.Web3Provider(windowAny?.ethereum);
      const seaport = new Seaport(provider, {
        overrides: {
          contractAddress: MARKET_CONTRACT,
        },
      });
      if (!currentListing) return null;
      const listingCreated = currentListing;
      const receipt = await seaport
        .cancelOrders(
          [listingCreated.order_parameters_obj],
          listingCreated.order_parameters_obj.offerer
        )
        .transact();
      receipt?.wait();
      const user = getUserFromLocal();

      if (receipt) {
        const result = await cancelOrder({
          order_id: listingCreated?.id,
          wallet_address: address,
          signature: user?.signature,
        });
        if (result) {
          createOrder();
          toast("Cancel order successfully", toastType.SUCCESS);
        }
      }
    } catch (e) {
      handleShowModal();
      toast("Can't cancel this nft", toastType.ERROR);
    }
  };

  const handleUpdate = () => {
    if (!price || price == currentPrice || price < 1) {
      toast("Price is invalid", toastType.ERROR);
      return;
    }
    handleHideModal();
    handleShowCancelConfirm();
  };

  const differenceBelow = useMemo(() => {
    if (!currentPrice || !price) return "--";
    return getDifferenceBelow(
      currentPrice,
      price,
      "% below listing price",
      "% above listing price"
    );
  }, [currentPrice, price]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <div
          style={{ width: "calc(90vw - 40px)" }}
          className="md:w-[100vw] max-w-[390px] text-left"
        >
          <div className="text-[28px] leading-[39px] font-semibold text-center">
            Edit Listing
          </div>
          <p className="mt-2 text-[14px] leading-[22px] text-center">
            Changing the price of your listing requires canceling the current
            listing and creating a new one,{" "}
            <span className="font-semibold">
              which requires an additional gas fee.
            </span>
          </p>
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
                    value={price}
                    placeholder="Enter amount"
                    onChange={(e) => handleChangePrice(e?.target?.value)}
                    type="number"
                  />
                  <span className="px-2 py-1 bg-[#0A1E42] rounded-[4px] text-white">
                    BUSD
                  </span>
                </div>
                <div className="text-[10px] leading-[16px] font-normal mt-1">
                  {price ? differenceBelow : ""}
                </div>
              </div>
            </div>
            <div className="flex mt-8 justify-between">
              <div className="flex text-[18px] leading-[25px] font-semibold">
                <span>Duration</span>
              </div>
              <div
                className={clsx(
                  "relative w-[32px] h-[20px] rounded-[12px] cursor-pointer",
                  isChangeDuration ? "bg-[#44454B]" : "bg-[#6681FF]"
                )}
                onClick={() => setIsChangeDuration(!isChangeDuration)}
              >
                <div
                  className={clsx(
                    "absolute w-[18px] h-[18px] bg-white rounded-full duration-100 top-[1px]",
                    isChangeDuration ? "left-[1px]" : "left-[12.5px]"
                  )}
                />
              </div>
            </div>
            {isChangeDuration ? (
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
            ) : (
              <div className="mt-3">
                <div className="text-[14px] leading-[22px]">
                  Use previous listing expiration date
                </div>
                <div className="text-[14px] leading-[22px] font-bold mt-1">{`(${formatTimestampToDate(
                  currentListing?.expiration_time
                )})`}</div>
              </div>
            )}
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
              disabled={
                !price || (isChangeDuration && (!endDatetime || !startDatetime))
              }
              onClick={() => handleUpdate()}
            >
              Update
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

      <ApproveListingModal
        isOpen={showApproveListing}
        nftDetail={nftDetail}
        listingPrice={getPrice}
        duration={getDurationText}
        fee={serviceFee}
        potentialEarning={getPotentialEarnings}
        handleHideModal={handleHideApproveListing}
      />

      <ListNftSuccessModal
        isOpen={showApproveSuccess}
        handleHideModal={handleHideApproveSuccess}
      />

      <CancelListingConfirm
        isOpen={isShowCancelConfirm}
        isCancelBeforeEdit={true}
        handleHideModal={handleHideCancelConfirm}
        handleCancelListing={handleCancelOrder}
      />
    </>
  );
};

export default EditListingModal;
