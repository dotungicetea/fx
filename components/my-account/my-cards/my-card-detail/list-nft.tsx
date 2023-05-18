/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@/components/custom/tooltip";
import DurationListModal from "@/components/modals/duration-list-modal";
import { getNumberFormatUs } from "@/utils";
import { formatTimeType, formatTimeUTCString } from "@/utils/time";
import clsx from "clsx";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Seaport } from "@opensea/seaport-js";
import {
  BUSD_CONTRACT,
  FEE_RECIPIENT,
  FX_NFT_CONTRACT,
  MARKET_CONTRACT,
} from "@/hooks/use-contract";
import { toastType } from "@/constants/context";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import SeaportAbi from "@/types/Seaport.json";
import { getUserFromLocal } from "@/utils/network";
import { createOrderApi } from "@/services/market";
import { ListNftInMyCardType } from "@/types/my-account-type";
import ApproveListingModal from "@/components/modals/approve-listing-modal";
import ListNftSuccessModal from "@/components/modals/list-nft-success-modal";
import { serviceFee } from "@/constants";
var CryptoJS = require("crypto-js");

const ListNft = ({
  id,
  nftDetail,
  reloadData,
  address,
  toast,
  setReloadData,
}: ListNftInMyCardType) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>();
  const [startDatetime, setStartDatetime] = useState<any>();
  const [endDatetime, setEndDatetime] = useState<any>();
  const [showApproveListing, setShowApproveListing] = useState<boolean>(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const handleShowModal = () => setIsShow(true);
  const handleHideModal = () => setIsShow(false);

  const handleShowApproveListing = () => setShowApproveListing(true);
  const handleHideApproveListing = () => setShowApproveListing(false);

  const handleShowApproveSuccess = () => setShowApproveSuccess(true);
  const handleHideApproveSuccess = () => setShowApproveSuccess(false);

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
    if (price === null || price < 1) return "--";
    return getNumberFormatUs(price);
  }, [price]);

  const getPotentialEarnings = useMemo(() => {
    if (price === null || price < 1) return "--";
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

        const startTime = (Date.parse(startDatetime) / 1000).toString();
        const endTime = (Date.parse(endDatetime) / 1000).toString();

        const { executeAllActions } = await seaport.createOrder(
          {
            startTime,
            endTime,
            offer: [
              {
                itemType: ItemType.ERC721,
                token: FX_NFT_CONTRACT,
                identifier: id,
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
          },
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
          handleHideApproveListing();
          handleShowApproveSuccess();
          setIsCreated(true);
        } else {
          toast(result?.data?.message?.errCode, toastType.ERROR);
          handleHideApproveListing();
        }
      } catch (error: any) {
        toast("Can't list nft", toastType.ERROR);
        handleHideApproveListing();
      }
    } else return;
  };

  useEffect(() => {
    if (isCreated && !showApproveSuccess) {
      setReloadData(!reloadData);
      setIsCreated(false);
    }
  }, [isCreated, showApproveSuccess]);

  return (
    <div className="bg-white p-5 rounded-[12px]">
      <div className="hidden md:grid grid-cols-2 gap-5">
        <div className="text-[18px] leading-[25px] font-semibold">
          Set a fixed price
        </div>
        <div className="text-[18px] leading-[25px] font-semibold">Duration</div>
      </div>

      <div className="hidden md:grid grid-cols-2 gap-5 mt-1">
        <p className="text-[14px] leading-[22px]">
          The NFT is listed at the price you set. The lowest price allowed is
          <span className="ml-1 font-semibold">1 BUSD</span>.
        </p>
        <p className="text-[14px] leading-[22px]">
          Set how long your listing will stay active and effective.
        </p>
      </div>

      <div className="hidden md:grid grid-cols-2 gap-5 mt-[12px]">
        <div className="flex flex-nowrap gap-2 rounded-[6px] pr-[10px] items-center bg-[#F4F7FF] border-[1.5px] border-transparent">
          <input
            type="number"
            placeholder="Enter price"
            className={clsx(
              "h-[40px] px-[12px] outline-none border-none bg-transparent w-full text-[14px] leading-[22px]",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            onChange={(e) => handleChangePrice(e?.target?.value)}
          />
          <span className="text-[14px] leading-[19px] font-semibold">BUSD</span>
        </div>
        <div
          className="flex gap-1 h-[40px] px-[12px] cursor-pointer items-center bg-[#F4F7FF] rounded-[6px] border-[1.5px] border-transparent"
          onClick={() => handleShowModal()}
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
      <div className="md:hidden">
        <div className="text-[18px] leading-[25px] font-semibold">
          Set a fixed price
        </div>
        <p className="text-[14px] leading-[22px]">
          The NFT is listed at the price you set. The lowest price allowed is
          <span className="ml-1 font-semibold">1 BUSD</span>.
        </p>
        <div className="flex flex-nowrap gap-2 rounded-[6px] mt-3 pr-[10px] items-center bg-[#F4F7FF] border-[1.5px] border-transparent">
          <input
            type="number"
            placeholder="Enter price"
            className={clsx(
              "h-[40px] px-[12px] outline-none border-none bg-transparent w-full text-[14px] leading-[22px]",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            onChange={(e) => handleChangePrice(e?.target?.value)}
          />
          <span className="text-[14px] leading-[19px] font-semibold">BUSD</span>
        </div>
        <div className="text-[18px] leading-[25px] font-semibold mt-3">
          Duration
        </div>
        <p className="text-[14px] leading-[22px]">
          Set how long your listing will stay active and effective.
        </p>
        <div
          className="flex gap-1 h-[40px] px-[12px] mt-3 cursor-pointer items-center bg-[#F4F7FF] rounded-[6px] border-[1.5px] border-transparent"
          onClick={() => handleShowModal()}
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

      <div className="flex gap-1 flex-nowrap mt-2 p-[12px] bg-[#002464] rounded-[8px]">
        <Image
          src="/images/icons/info.svg"
          className="min-w-[12px] h-fit mt-1"
          width={12}
          height={12}
          alt="icon info"
        />
        <p className="text-white text-[12px] leading-[19px]">
          Buyers can still make offers, and you have the option to accept the
          best offer. If you agree to a buyer&apos;s offer, the NFT will be sold
          for the offered price.
        </p>
      </div>

      <div className="mt-2 px-5 pt-[12px] pb-5 bg-[#F4F7FF] rounded-[8px]">
        <div className="text-[16px] leading-[22px] font-semibold">Summary</div>
        <div className="flex mt-[12px] justify-between text-[14px] leading-[22px]">
          <div className="opacity-60">Listing price</div>
          <p className="font-semibold">{`${getPrice} BUSD`}</p>
        </div>
        <div className="flex mt-[12px] justify-between text-[14px] leading-[22px]">
          <div className="flex gap-[5px] items-center">
            <p className="opacity-60">Service fee</p>
            <Tooltip
              content="All NFT Currency transactions (buy or sell) involves a 3% fee that
          funds the buyback wallet."
            >
              <Image
                src="/images/icons/info_dark.svg"
                width={16}
                height={16}
                alt="icon info dark"
              />
            </Tooltip>
          </div>
          <p className="font-semibold">{`${serviceFee}%`}</p>
        </div>
        <div className="w-full h-[1px] bg-[#002464] opacity-20 mt-[12px]" />
        <div className="flex justify-between mt-[12px] text-[14px] leading-[19px] font-semibold">
          <div className="text-[#2152CB]">Your potential earnings</div>
          <div className="text-[#2152CB]">{`${getPotentialEarnings} BUSD`}</div>
        </div>
      </div>

      <div className="text-right">
        <button
          className="btn-fill mt-[17px] rounded-[4px] text-[14px] leading-[17px] h-[40px] px-[60px]"
          disabled={!price || !startDatetime || !endDatetime}
          onClick={() => createOrder()}
        >
          List NFT Now
        </button>
      </div>

      <DurationListModal
        isOpen={isShow}
        dateRange={dateRange}
        startDatetime={startDatetime}
        endDatetime={endDatetime}
        setDateRange={setDateRange}
        setStartDatetime={setStartDatetime}
        setEndDatetime={setEndDatetime}
        handleHideModal={handleHideModal}
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
    </div>
  );
};

export default ListNft;
