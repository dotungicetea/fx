/* eslint-disable react-hooks/exhaustive-deps */
import { orderStatus } from "@/constants";
import { NFT_CONTRACT_VIEW } from "@/hooks/use-contract";
import { ListingDurationType } from "@/types/my-account-type";
import { getNumberFormatUs, hiddenLongText } from "@/utils";
import { validGetFrom } from "@/utils/market";
import { formatTimestampToDate } from "@/utils/time";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  expirationTime: number;
  isEditingNft: boolean;
  setIsListingExpired: (data: boolean) => void;
}

const CoundownAnimation = ({
  expirationTime,
  isEditingNft,
  setIsListingExpired,
}: Props) => {
  const daysRef = useRef<any>();
  const hoursRef = useRef<any>();
  const minutesRef = useRef<any>();
  const secondsRef = useRef<any>();

  let intervalId: any;

  useEffect(() => {
    intervalId && clearInterval(intervalId);
    intervalId = setInterval(function () {
      const now = new Date().getTime();
      let distance = expirationTime * 1000 - now;
      if (distance <= 0) {
        intervalId && clearInterval(intervalId);
        setIsListingExpired(true);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)) || 0;
      const hours =
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) || 0;
      const minutes =
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) || 0;
      const seconds = Math.floor((distance % (1000 * 60)) / 1000) || 0;
      if (daysRef && daysRef.current) {
        daysRef.current.innerText = days < 10 ? "0" + days : days;
      }
      if (hoursRef && hoursRef.current) {
        hoursRef.current.innerText = hours < 10 ? "0" + hours : hours;
      }
      if (minutesRef && minutesRef.current) {
        minutesRef.current.innerText = minutes < 10 ? "0" + minutes : minutes;
      }
      if (secondsRef && secondsRef.current) {
        secondsRef.current.innerText = seconds < 0 ? "0" + seconds : seconds;
      }
    }, 1000);

    if (isEditingNft && intervalId) {
      clearInterval(intervalId);
    }
  }, [isEditingNft]);

  return (
    <div className="coundown-bg w-full rounded-[8px] px-[12px] pt-[15px] pb-[12px] md:flex gap-[4px] mt-3">
      <p className="text-[12px] mr-auto text-center md:text-left text-white">
        Listing ends in
      </p>
      <div className="flex gap-1 mt-1 md:mt-0 justify-center">
        <div>
          <p
            ref={daysRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Days</p>
        </div>
        <div className="mt-[10px]">:</div>
        <div>
          <p
            ref={hoursRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Hours</p>
        </div>
        <div className="mt-[10px]">:</div>
        <div>
          <p
            ref={minutesRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Minutes</p>
        </div>
        <div className="mt-[10px]">:</div>
        <div>
          <p
            ref={secondsRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Second</p>
        </div>
      </div>
    </div>
  );
};

const ListingDuration = ({
  isOwner,
  nftDetail,
  currentPrice,
  listing,
  currentListing,
  address,
  isEditingNft,
  setIsListingExpired,
}: ListingDurationType) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [isCoundown, setIsCoundown] = useState<boolean>(false);

  const orderCreated = useMemo(() => {
    return listing?.find(
      (data: any) => data?.event_type === orderStatus.CREATE
    );
  }, [listing]);

  const ownerBy = useMemo(() => {
    if (!address || !nftDetail?.nft_owner) return "--";
    return isOwner ? "you" : hiddenLongText(nftDetail?.nft_owner);
  }, [address, isOwner, nftDetail?.nft_owner]);

  useEffect(() => {
    if (orderCreated?.expiration_time) {
      const now = new Date().getTime();
      let distance = orderCreated?.expiration_time * 1000 - now;
      if (distance <= 0) {
        setIsListingExpired(true);
        return;
      } else {
        setIsCoundown(true);
      }
    }
  }, [orderCreated?.expiration_time, setIsListingExpired]);

  return (
    <div className="bg-white p-5 rounded-[8px] mt-5">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsShow(!isShow)}
      >
        <div className="flex gap-1 items-center text-[#2152CB] font-semibold">
          <Image
            src="/images/icons/listing.svg"
            width={20}
            height={20}
            alt="listing icon"
          />
          Listing
        </div>
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </div>
      {isShow && currentListing && (
        <div>
          <div className="hidden md:flex gap-1 mt-3 px-5">
            <div className="w-full lg:w-[80px] lg:min-w-[80px] text-[14px] leading-[22px] opacity-60">
              Price
            </div>
            <div className="w-full lg:w-[110px] lg:min-w-[110px] text-[14px] leading-[22px] opacity-60">
              From
            </div>
            <div className="w-full lg:w-full lg:text-[14px] text-right leading-[22px] opacity-60">
              Expiration
            </div>
          </div>
          <div className="grid grid-cols-2 md:flex gap-3 md:gap-1 rounded-[8px] mt-3 px-5 py-3 bg-[#F4F7FF]">
            <div className="w-full lg:w-[80px] lg:min-w-[80px] text-[14px] leading-[22px] font-semibold truncate">
              <div className="text-[14px] md:hidden leading-[22px] opacity-60">
                Price
              </div>
              <div>
                {`${
                  currentPrice ? getNumberFormatUs(currentPrice) : "--"
                } BUSD`}
              </div>
            </div>
            <div className="w-full lg:w-[110px] lg:min-w-[110px] text-[14px] leading-[22px] truncate">
              <div className="text-[14px] md:hidden leading-[22px] opacity-60">
                From
              </div>
              {validGetFrom(ownerBy) ? (
                <div className="truncate">{ownerBy}</div>
              ) : (
                <Link
                  href={`${NFT_CONTRACT_VIEW}?a=${nftDetail?.nft_owner}`}
                  target={"_blank"}
                >
                  <div className="truncate text-[#2152CB]">{ownerBy}</div>
                </Link>
              )}
            </div>
            <div className="w-full lg:w-full lg:text-[14px] md:text-right leading-[22px] truncate">
              <div className="text-[14px] md:hidden leading-[22px] opacity-60">
                Expiration
              </div>
              <div>{formatTimestampToDate(orderCreated?.expiration_time)}</div>
            </div>
          </div>
          {isCoundown && orderCreated?.expiration_time && (
            <CoundownAnimation
              expirationTime={orderCreated?.expiration_time}
              isEditingNft={isEditingNft}
              setIsListingExpired={setIsListingExpired}
            />
          )}
        </div>
      )}
      {isShow && !currentListing && (
        <div className="py-8">
          <Image
            src="/images/icons/icon_no_record.svg"
            className="mx-auto"
            width={60}
            height={60}
            alt="no listing"
          />
          <div className="mt-3 text-[14px] leading-[22px] text-center">
            No listing yet
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDuration;
