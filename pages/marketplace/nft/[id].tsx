/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import CardDetailInMyCardDetail from "@/components/my-account/my-cards/my-card-detail/card-detail";
import { decryptOrder, getNftDetailData } from "@/utils/nft";
import { useAccount } from "wagmi";
import { NetworkContext } from "@/components/context/network-context";
import { convertDecimalToNum, getUserFromLocal } from "@/utils/network";
import ListingNft from "@/components/my-account/my-cards/my-card-detail/listing-nft";
import { orderStatus } from "@/constants";
import ListingDuration from "@/components/my-account/my-cards/my-card-detail/listing-duration";
import { getNftMarketDetail } from "@/services/market";
import { ToastContext } from "@/components/context/toast-context";
import { pathname } from "@/constants/nav";
import MakeOfferModal from "@/components/modals/make-offer-modal";
import OffersList from "@/components/my-account/my-cards/my-card-detail/offer-list";
import { convertStringToJson } from "@/utils";
import { getCurrentPrice } from "@/utils/market";
import NftActivites from "@/components/my-account/my-cards/my-card-detail/nft-activities";

const MarketplaceNftDetail = () => {
  const router = useRouter();
  const [nftDetail, setNftDetail] = useState<any>();
  const { address } = useAccount();
  const { signature } = useContext(NetworkContext);
  const [listing, setListing] = useState<any>();
  const [orders, setOrders] = useState<any>();
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [isListingExpired, setIsListingExpired] = useState<boolean>(false);
  const [showMakeOffer, setShowMakeOffer] = useState<boolean>(false);
  const [priceOffer, setPriceOffer] = useState<number | undefined>();
  const [activities, setActivities] = useState<any>();
  const [isShowConfirmPurchase, setIsShowConfirmPurchase] =
    useState<boolean>(false);
  const { toast } = useContext(ToastContext);

  const handleShowMakeOffer = () => setShowMakeOffer(true);
  const handleHideMakeOffer = () => setShowMakeOffer(false);

  const handleShowConfirmPurchase = () => setIsShowConfirmPurchase(true);
  const handleHideConfirmPurchase = () => setIsShowConfirmPurchase(false);

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
      const data = getNftDetailData(
        result?.data?.data?.metadata,
        nftId,
        result?.data?.data?.tokenOwner
      );
      setNftDetail(data);
      if (result?.data?.data?.listing) {
        setListing(result?.data?.data?.listing);
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

  useEffect(() => {
    if (isListingExpired) {
      router?.push(`${pathname?.MARKETPLACE}`);
    }
  }, [isListingExpired]);

  return (
    <div className="pb-5">
      <div className="flex items-center lg:items-start justify-center lg:justify-between px-5 xl:px-[50px] py-5">
        <div className="text-[28px] font-semibold">NFT Details</div>
      </div>
      <div className="grid lg:flex gap-3 lg:gap-5 px-5 xl:px-[50px]">
        <div className="xl:w-[420px] xl:min-w-[420px]">
          <CardDetailInMyCardDetail
            nftDetail={nftDetail}
            currentPrice={currentPrice}
          />
          {listing && (
            <ListingDuration
              nftDetail={nftDetail}
              isOwner={checkIsOwner}
              currentPrice={currentPrice}
              listing={listing}
              address={address}
              isEditingNft={false}
              currentListing={orderListing}
              setIsListingExpired={setIsListingExpired}
            />
          )}
        </div>
        <div className="w-full">
          {listing && (
            <ListingNft
              nftDetail={nftDetail}
              isOwner={checkIsOwner}
              address={address}
              listing={listing}
              currentPrice={currentPrice}
              reloadData={reloadData}
              setReloadData={setReloadData}
              handleShowMakeOffer={handleShowMakeOffer}
            />
          )}
          {listing && (
            <OffersList
              orders={orders}
              address={address}
              reloadData={reloadData}
              currentPrice={currentPrice}
              isOwner={checkIsOwner}
              toast={toast}
              setReloadData={setReloadData}
              handleShowMakeOffer={handleShowMakeOffer}
            />
          )}
        </div>
      </div>
      {activities && !!activities?.length && (
        <NftActivites activities={activities} address={address} />
      )}
      <MakeOfferModal
        listing={listing}
        nftDetail={nftDetail}
        isOpen={showMakeOffer}
        priceOffer={priceOffer}
        address={address}
        reloadData={reloadData}
        currentPrice={currentPrice}
        isShowConfirmPurchase={isShowConfirmPurchase}
        handleHideModal={handleHideMakeOffer}
        setPriceOffer={setPriceOffer}
        setReloadData={setReloadData}
        handleShowModal={handleShowMakeOffer}
        showConfirmPurchase={handleShowConfirmPurchase}
        hideConfirmPurchase={handleHideConfirmPurchase}
      />
    </div>
  );
};

export default MarketplaceNftDetail;
