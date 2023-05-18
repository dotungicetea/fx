import { ActionListingType } from "@/types/my-account-type";
import Image from "next/image";
import { Seaport } from "@opensea/seaport-js";
import { toastType } from "@/constants/context";
import { useState } from "react";
import { ethers } from "ethers";
import { orderStatus } from "@/constants";
import { cancelOrder } from "@/services/market";
import { getUserFromLocal } from "@/utils/network";
import clsx from "clsx";
import { MARKET_CONTRACT } from "@/hooks/use-contract";
import CancelListingConfirm from "@/components/modals/cancel-listing-confirm";

const ActionListing = ({
  listing,
  reloadData,
  isListing,
  isListingExpired,
  address,
  toast,
  setIsSellNFT,
  setReloadData,
  handleShowEditListing,
}: ActionListingType) => {
  const [isShowCancelConfirm, setIsShowCancelConfirm] =
    useState<boolean>(false);

  const handleShowCancelConfirm = () => setIsShowCancelConfirm(true);
  const handleHideCancelConfirm = () => setIsShowCancelConfirm(false);

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
      const listingData = [...listing] as any[];
      if (!listingData) return null;
      const listingCreated = listingData?.find(
        (data: any) => data?.event_type === orderStatus.CREATE
      );
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
          toast("Cancel order successfully", toastType.SUCCESS);
          setReloadData(!reloadData);
        }
      }
    } catch (e) {
      toast("Can't cancel this nft", toastType.ERROR);
    }
  };

  return (
    <div className="flex gap-2 justify-center lg:justify-start leading-[18px]">
      {isListing && (
        <button
          className={clsx(
            "flex gap-1 items-center py-[10px] bg-[#EA5D5D] rounded-[4px] text-[14px] leading-[18px] text-white font-semibold",
            "lg:w-[170px] justify-center px-3 lg:px-[24px]"
          )}
          onClick={() => handleShowCancelConfirm()}
        >
          <Image
            src="/images/icons/cross_x_red.svg"
            width={20}
            height={20}
            alt="cross x"
          />
          Cancel listing
        </button>
      )}
      {!isListingExpired && isListing && (
        <button
          className={clsx(
            "flex gap-1 items-center py-[10px] bg-[#002464] rounded-[4px] text-[14px] leading-[18px] text-white font-semibold",
            "lg:w-[170px] justify-center px-3 lg:px-[24px]"
          )}
          onClick={() => handleShowEditListing()}
        >
          <Image
            src="/images/icons/edit.svg"
            width={20}
            height={20}
            alt="edit"
          />
          Edit listing
        </button>
      )}
      {!isListing && (
        <button
          className={clsx(
            "flex gap-1 items-center py-[10px] bg-[#002464] rounded-[4px] text-[14px] leading-[18px] text-white font-semibold",
            "lg:w-[170px] justify-center px-3 lg:px-[24px]"
          )}
          onClick={() => setIsSellNFT(true)}
        >
          <Image
            src="/images/icons/sell.svg"
            width={20}
            height={20}
            alt="edit"
          />
          Sell NFT
        </button>
      )}
      <CancelListingConfirm
        isOpen={isShowCancelConfirm}
        isCancelAction={true}
        handleHideModal={handleHideCancelConfirm}
        handleCancelListing={handleCancelOrder}
      />
    </div>
  );
};

export default ActionListing;
