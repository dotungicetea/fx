import { orderStatus } from "@/constants";
import {
  FX_NFT_CONTRACT,
  MARKET_CONTRACT,
  NFT_CONTRACT_VIEW,
} from "@/hooks/use-contract";
import { ListingNftDetailType } from "@/types/my-account-type";
import { getNumberFormatUs, hiddenLongText } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import ConfirmPurchaseModal from "@/components/modals/confirm-purchase-modal";
import FinishPurchaseModal from "@/components/modals/finish-purchase-modal";
import { fullfillOrder } from "@/services/market";
import { getUserFromLocal } from "@/utils/network";
import Link from "next/link";
import { validGetFrom } from "@/utils/market";

const ListingNft = ({
  nftDetail,
  isOwner,
  address,
  listing,
  reloadData,
  currentPrice,
  handleShowMakeOffer,
  setReloadData,
}: ListingNftDetailType) => {
  const [isShowConfirmPurchase, setIsShowConfirmPurchase] =
    useState<boolean>(false);
  const [isShowFinishPurchase, setIsShowFinishPurchase] =
    useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any>();

  const handleShowFinishPurchase = () => setIsShowFinishPurchase(true);
  const handleHideFinishPurchase = () => {
    setIsShowFinishPurchase(false);
    setReloadData(!reloadData);
  };

  const handleShowConfirmPurchase = () => setIsShowConfirmPurchase(true);
  const handleHideConfirmPurchase = () => setIsShowConfirmPurchase(false);

  const handleConfirm = () => {
    handleHideConfirmPurchase();
    handleBuyNft();
  };

  const ownerBy = useMemo(() => {
    if (!address || !nftDetail?.nft_owner) return "--";
    return isOwner ? "you" : hiddenLongText(nftDetail?.nft_owner);
  }, [address, isOwner, nftDetail?.nft_owner]);

  const currentListing = useMemo(() => {
    if (!listing) return null;
    const listingStatusCreated = listing?.find(
      (x: any) => x?.event_type === orderStatus?.CREATE
    );
    if (!listingStatusCreated) return null;
    return listingStatusCreated;
  }, [listing]);

  const handleBuyNft = async () => {
    if (typeof window !== "undefined") {
      try {
        if (!address || !currentListing) return;
        const windowAny = window as any;
        const provider = new ethers.providers.Web3Provider(windowAny?.ethereum);
        const seaport = new Seaport(provider, {
          overrides: {
            contractAddress: MARKET_CONTRACT,
          },
        });
        const param = {
          order: {
            parameters: currentListing?.order_parameters_obj,
            signature: currentListing?.order_signature,
          },
          accountAddress: address,
        };
        const { actions } = await seaport.fulfillOrder(param);
        let transactionData = {} as any;

        for (let action of actions) {
          const approveGasLimit = { gasLimit: "215120" };
          transactionData = await action.transactionMethods.transact(
            approveGasLimit
          );
        }
        if (transactionData) {
          await transactionData?.wait();
          setTransactionData(transactionData);
          const user = getUserFromLocal();
          const paramApi = {
            order_id: currentListing?.id,
            wallet_address: address,
            signature: user?.signature,
          };
          console.log(paramApi);
          return
          const result = await fullfillOrder(paramApi);
          if (result) {
            setIsSuccess(true);
            handleShowFinishPurchase();
          } else {
            setIsSuccess(false);
            handleShowFinishPurchase();
          }
        }
      } catch (e) {
        console.log(e)
        setIsSuccess(false);
        handleShowFinishPurchase();
      }
    }
  };

  return (
    <div>
      <div className="pl-5">
        <div className="flex gap-2 items-end">
          <div className="text-[24px] leading-[33px] font-semibold">
            {nftDetail?.name}
          </div>
          <div className="text-[18px] leading-[33px] font-semibold">{`#${nftDetail?.id}`}</div>
        </div>
        <div className="mt-1 flex gap-[6px]">
          <div className="text-[14px]">Owned by</div>
          {validGetFrom(ownerBy) ? (
            <div className="text-[14px] text-[#2152CB] font-semibold">
              {ownerBy}
            </div>
          ) : (
            <Link
              href={`${NFT_CONTRACT_VIEW}?a=${nftDetail?.nft_owner}`}
              target={"_blank"}
            >
              <div className="text-[14px] text-[#2152CB] font-semibold">
                {ownerBy}
              </div>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 mt-3">
          <div>
            <div className="text-[14px] leading-[22px] opacity-60 text-black">
              Rarity
            </div>
            <div className="flex gap-1 items-center mt-[2px] text-black text-[18px] leading-[25px] font-semibold">
              <div
                className={clsx(
                  `${nftDetail?.rarity?.toLowerCase()}-type`,
                  "w-[10px] h-[10px] min-w-[10px] rounded-full"
                )}
              />
              {nftDetail?.rarity}
            </div>
          </div>
          <div>
            <div className="text-[14px] leading-[22px] opacity-60 text-black">
              NFT Level
            </div>
            <div className="text-black mt-[2px] text-[18px] leading-[25px] font-semibold">{`Lv.${
              nftDetail?.level || 0
            }`}</div>
          </div>
          <div>
            <div className="text-[14px] leading-[22px] opacity-60 text-black">
              Mining Power
            </div>
            <div className="text-black mt-[2px] text-[18px] leading-[25px] font-semibold">
              {nftDetail?.mp || 0}
            </div>
          </div>
          <div>
            <div className="text-[14px] leading-[22px] opacity-60 text-black">
              Stars
            </div>
            <div className="text-black mt-[2px] text-[18px] leading-[25px] font-semibold"></div>
          </div>
        </div>
      </div>
      <div className="mt-5 p-5 bg-white rounded-[12px]">
        <div className="grid xl:flex gap-5 xl:gap-[60px]">
          <div className="lg:w-[180px] lg:min-w-[180px]">
            <div className="flex gap-1 text-[#2152CB] font-semibold">
              <Image
                src="/images/icons/current_price.svg"
                width={20}
                height={20}
                alt="icon current price"
              />
              Current Price
            </div>
            <div className="text-[18px] leading-[25px] font-semibold py-2">{`${
              currentPrice ? getNumberFormatUs(currentPrice) : "--"
            } BUSD`}</div>
            {currentPrice && (
              <>
                <button
                  className="btn-fill w-full h-[40px]"
                  disabled={isOwner}
                  onClick={() => handleShowConfirmPurchase()}
                >
                  Buy Now
                </button>
                <button
                  className="btn-line w-full h-[40px] mt-2"
                  disabled={isOwner}
                  onClick={() => {
                    handleShowMakeOffer && handleShowMakeOffer();
                  }}
                >
                  Make Offer
                </button>
              </>
            )}
          </div>
          <div className="w-full min-w-[200px] mx-auto">
            <div className="grid grid-cols-2 gap-2 p-5 bg-[#F4F7FF] rounded-[8px]">
              <div className="text-[14px] leading-[22px]">Contract Address</div>
              <Link href={`${NFT_CONTRACT_VIEW}`} target={"_blank"}>
                <div className="text-[14px] leading-[22px] font-semibold text-[#2E5ED3] text-right">
                  {hiddenLongText(FX_NFT_CONTRACT)}
                </div>
              </Link>
              <div className="text-[14px] leading-[22px]">Token ID</div>
              {nftDetail?.id ? (
                <Link
                  href={`${NFT_CONTRACT_VIEW}?a=${nftDetail?.id}`}
                  target={"_blank"}
                >
                  <div className="text-[14px] leading-[22px] font-semibold text-[#2E5ED3] text-right">
                    {nftDetail?.id}
                  </div>
                </Link>
              ) : (
                <div className="text-[14px] leading-[22px] font-semibold text-right">
                  --
                </div>
              )}
              <div className="text-[14px] leading-[22px]">Chain</div>
              <div className="text-[14px] leading-[22px] font-semibold text-black text-right">
                BNB Chain
              </div>
              <div className="text-[14px] leading-[22px]">
                Base Mining Power
              </div>
              <div className="text-[14px] leading-[22px] font-semibold text-black text-right">
                {nftDetail?.mp}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmPurchaseModal
        isOpen={isShowConfirmPurchase}
        nftDetail={nftDetail}
        listingPrice={currentPrice}
        handleMakeOffer={handleConfirm}
        handleHideModal={handleHideConfirmPurchase}
      />

      <FinishPurchaseModal
        isOpen={isShowFinishPurchase}
        isSuccess={isSuccess}
        id={nftDetail?.nft_id}
        transaction={transactionData}
        handleHideModal={handleHideFinishPurchase}
      />
    </div>
  );
};

export default ListingNft;
