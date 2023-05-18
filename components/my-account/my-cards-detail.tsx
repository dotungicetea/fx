/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import CardDetailInMyCardDetail from "./my-cards/my-card-detail/card-detail";
import { decryptOrder, getNftDetailData } from "@/utils/nft";
import ListNft from "./my-cards/my-card-detail/list-nft";
import { useAccount } from "wagmi";
import { NetworkContext } from "../context/network-context";
import { convertDecimalToNum, getUserFromLocal } from "@/utils/network";
import ActionListing from "./my-cards/my-card-detail/action-listing";
import ListingNft from "./my-cards/my-card-detail/listing-nft";
import { orderStatus } from "@/constants";
import ListingDuration from "./my-cards/my-card-detail/listing-duration";
import Image from "next/image";
import { getNftMarketDetail } from "@/services/market";
import { ToastContext } from "../context/toast-context";
import EditListing from "./my-cards/my-card-detail/edit-listing";
import { getCurrentPrice } from "@/utils/market";
import OffersList from "./my-cards/my-card-detail/offer-list";
import NftActivites from "./my-cards/my-card-detail/nft-activities";
import { convertStringToJson } from "@/utils";

const MyCardDetailComponent = () => {
  const router = useRouter();
  const [nftDetail, setNftDetail] = useState<any>();
  const { address } = useAccount();
  const { signature } = useContext(NetworkContext);
  const [listing, setListing] = useState<any>();
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [isListingExpired, setIsListingExpired] = useState<boolean>(false);
  const [isSellNFT, setIsSellNFT] = useState<boolean>(true);
  const [isShowEditListing, setIsShowEditListing] = useState<boolean>(false);
  const [isEditingNft, setIsEditingNft] = useState<boolean>(false);
  const [orders, setOrders] = useState<any>();
  const [activities, setActivities] = useState<any>();
  const { toast } = useContext(ToastContext);

  const handleShowEditListing = () => setIsShowEditListing(true);
  const handleHideEditListing = () => setIsShowEditListing(false);

  const handleShowMakeOffer = () => {};

  const handleGetNftDetail = async () => {
    const nftId = router?.query?.id as string;
    const user = getUserFromLocal();
    if (!nftId || !address || !user?.signature) return;
    const result = await getNftMarketDetail({
      token_id: nftId,
      wallet_address: address,
      signature: user?.signature,
    });
    if (result && result?.data) {
      let data = getNftDetailData(
        result?.data?.data?.metadata,
        nftId,
        result?.data?.data?.tokenOwner
      );
      setNftDetail(data);
      if (result?.data?.data?.listing && result?.data?.data?.listing?.length) {
        setListing(result?.data?.data?.listing);
        setIsSellNFT(false);
      }
      if (result?.data?.data?.order) {
        setOrders(result?.data?.data?.order);
      }
      if (result?.data?.data?.logdata) {
        const logdata = result?.data?.data?.logdata as any;
        const logdataFormat = logdata?.map((data: any) => {
          const detail = data?.detail ? convertStringToJson(data?.detail) : {};
          return { ...data, detail_obj: detail };
        });
        setActivities(logdataFormat);
      }
    }
  };

  useEffect(() => {
    handleGetNftDetail();
  }, [router?.query?.id, address, signature, reloadData]);

  const listingTitle = useMemo(() => {
    if (listing) return "Listing Details";
    return "List NFT for sale";
  }, [listing]);

  const checkIsOwner = useMemo(() => {
    if (!address || !nftDetail?.nft_owner) return false;
    return nftDetail?.nft_owner === address;
  }, [address, nftDetail?.nft_owner]);

  const orderListing = useMemo(() => {
    if (!listing) return null;
    const listingData = [...listing] as any[];
    if (!listingData) return null;
    const listingCreated = listingData?.find(
      (data: any) => data?.event_type === orderStatus.CREATE
    );
    if (!listingCreated) return null;
    listingCreated.order_parameters_obj = decryptOrder(
      listingCreated?.order_parameters
    );
    return listingCreated;
  }, [listing]);

  const currentPrice = useMemo(() => {
    return getCurrentPrice(orderListing);
  }, [orderListing]);

  const validateListingExpired = useMemo(() => {
    const isListingStatus = listing?.some(
      (x: any) =>
        x?.event_type?.toLocaleLowerCase() ===
        orderStatus?.CREATE?.toLocaleLowerCase()
    );
    return isListingExpired && listing && isListingStatus && !isSellNFT;
  }, [isListingExpired, listing, !isSellNFT]);

  return (
    <div className="pb-5">
      <div className="lg:flex items-center justify-between px-5 xl:px-[50px] py-5">
        <div className="text-[32px] font-semibold text-center lg:text-left">
          {listingTitle}
        </div>
        {listing && !isSellNFT && (
          <ActionListing
            listing={listing}
            address={address}
            toast={toast}
            reloadData={reloadData}
            isListing={!!orderListing}
            setIsSellNFT={setIsSellNFT}
            isListingExpired={isListingExpired}
            setReloadData={setReloadData}
            handleShowEditListing={handleShowEditListing}
          />
        )}
      </div>
      {validateListingExpired && (
        <div className="px-5 xl:px-[50px] pb-3">
          <div className="flex gap-[6px] py-3 px-8 items-start bg-[#FFD9D9] rounded-[12px]">
            <Image
              src="/images/icons/cross_x_red_fill.svg"
              className="min-w-[16px] mt-[6px]"
              width={16}
              height={16}
              alt="icon x"
            />
            <span className="text-[14px] leading-[22px]">
              Your listing has expired and is no longer visible on the
              marketplace.
              <br /> If you still wish to sell the item, please cancel the
              expired listing and create a new one.
            </span>
          </div>
        </div>
      )}
      <div className="grid lg:flex gap-5 px-5 xl:px-[50px]">
        <div className="xl:w-[420px] xl:min-w-[420px]">
          <CardDetailInMyCardDetail
            nftDetail={nftDetail}
            currentPrice={currentPrice}
          />
          {listing && !isSellNFT && (
            <ListingDuration
              nftDetail={nftDetail}
              isOwner={checkIsOwner}
              currentPrice={currentPrice}
              listing={listing}
              address={address}
              isEditingNft={isEditingNft}
              currentListing={orderListing}
              setIsListingExpired={setIsListingExpired}
            />
          )}
        </div>
        <div className="w-full">
          {(!listing || isSellNFT) && (
            <ListNft
              id={router?.query?.id}
              nftDetail={nftDetail}
              reloadData={reloadData}
              address={address}
              toast={toast}
              setReloadData={setReloadData}
            />
          )}
          {listing && !isSellNFT && (
            <ListingNft
              nftDetail={nftDetail}
              isOwner={checkIsOwner}
              address={address}
              reloadData={reloadData}
              setReloadData={setReloadData}
              currentPrice={currentPrice}
            />
          )}
          {listing && !isSellNFT && (
            <OffersList
              orders={orders}
              address={address}
              reloadData={reloadData}
              currentPrice={currentPrice}
              isOwner={checkIsOwner}
              isAccept={true}
              id={router?.query?.id}
              toast={toast}
              setReloadData={setReloadData}
              handleShowMakeOffer={handleShowMakeOffer}
            />
          )}
          {listing && !isSellNFT && (
            <EditListing
              currentListing={orderListing}
              address={address}
              reloadData={reloadData}
              nftDetail={nftDetail}
              currentPrice={currentPrice}
              isShowEditListing={isShowEditListing}
              toast={toast}
              setIsEditingNft={setIsEditingNft}
              setReloadData={setReloadData}
              handleShowEditListing={handleShowEditListing}
              handleHideEditListing={handleHideEditListing}
            />
          )}
        </div>
      </div>
      {activities && !!activities?.length && (
        <NftActivites activities={activities} address={address} />
      )}
    </div>
  );
};

export default MyCardDetailComponent;
