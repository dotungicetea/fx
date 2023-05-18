/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkContext } from "../context/network-context";
import { convertDecimalToNum, getUserFromLocal } from "@/utils/network";
import { cancelOrder, getOffersList } from "@/services/market";
import { SelectComponent } from "../custom/select";
import { listSortTypes } from "@/constants/my-account";
import clsx from "clsx";
import Image from "next/image";
import { convertStringToJson, getNumberFormatUs } from "@/utils";
import { getCurrentPrice, getDifferenceBelow } from "@/utils/market";
import CancelOfferModal from "../modals/cancel-offer-modal";
import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";
import { MARKET_CONTRACT } from "@/hooks/use-contract";
import { decryptOrder } from "@/utils/nft";
import { ToastContext } from "../context/toast-context";
import { toastType } from "@/constants/context";
import { handleSortMarket } from "@/utils/my-account";
import RecordLoading from "../loading/record-loading";

const OffersItemComponent = ({
  offer,
  setLastElement,
  handleSelectOffer,
  index,
}: any) => {
  return (
    <tr
      ref={setLastElement}
      className="bg-white md:bg-[#F4F7FF] text-[14px] leading-[22px] grid gap-3 p-5 mb-2 rounded-[12px] md:table-row grid-cols-2"
    >
      <td className="md:py-2 md:pl-5 md:pr-1 rounded-l-[8px] col-span-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              `${offer?.rarity?.toLocaleLowerCase()}-type`,
              "w-[40px] min-w-[40px] h-[58px] pt-1 rounded-[2px]"
            )}
          >
            <Image
              src={`/images/nfts/${offer?.symbol?.toLocaleLowerCase()}.png`}
              className={`max-w-[36}px] max-h-[36px]`}
              width={36}
              height={36}
              alt="token symbol"
            />
            <div className="text-[6px] leading-[7px] text-white text-center">
              {offer?.symbol}
            </div>
          </div>
          <div>
            <div className="font-semibold pb-1">{`${offer?.symbol} (${offer?.name})`}</div>
            <div>{`#${offer?.nft_id}`}</div>
          </div>
        </div>
      </td>
      <td className="md:py-2 md:px-1">
        <div className="opacity-60">Listing Price</div>
        <div>{`${getNumberFormatUs(offer?.listingAmount)} BUSD`}</div>
      </td>
      <td className="md:py-2 md:px-1">
        <div className="opacity-60">Offered Price</div>
        <div>{`${getNumberFormatUs(
          convertDecimalToNum(offer?.offer_end_amount)
        )} BUSD`}</div>
      </td>
      <td className="md:py-2 md:px-1">
        <div className="opacity-60">Difference</div>
        <div>
          {getDifferenceBelow(
            offer?.listing_end_amount,
            offer?.offer_end_amount,
            "% below",
            "% above"
          )}
        </div>
      </td>
      <td className="md:py-2 md:px-1">
        <div className="opacity-60">Status</div>Pending
      </td>
      <td className="md:py-2 md:px-1 md:pr-5 rounded-r-[8px] col-span-2">
        <div className="md:text-right">
          <button
            className="w-full lg:w-auto btn-cancel h-[33px] text-[12px] leading-[16px] px-3"
            onClick={() => handleSelectOffer(index)}
          >
            Cancel offer
          </button>
        </div>
      </td>
    </tr>
  );
};

const MyOffers = () => {
  const [offers, setOffers] = useState<any>([]);
  const { address } = useAccount();
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<any>();
  const [lastElement, setLastElement] = useState<any>(null);
  const [isShowCancelOffer, setIsShowCancelOffer] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [offerSelected, setOfferSelected] = useState<any>({});
  const [sort, setSort] = useState<string>("price_asc");
  const [firstView, setFirstView] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useContext(ToastContext);

  const handleShowCancelOffer = () => setIsShowCancelOffer(true);
  const handleHideCancelOffer = () => setIsShowCancelOffer(false);

  const handleSelectOffer = (index: number) => {
    const offer = index >= 0 ? offers[index] : {};
    offer.end_amount = offer?.offer_end_amount;
    offer.expiration_time = offer.order_expire;
    offer.currentPrice = convertDecimalToNum(offer?.listing_end_amount);
    setOfferSelected(offer);
    handleShowCancelOffer();
  };

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPage((no) => no + 1);
      }
    })
  );

  const handleGetOffers = async () => {
    try {
      const user = getUserFromLocal();
      const param = {
        wallet_address: address,
        signature: user?.signature,
        sort_by: handleSortMarket(sort),
        page: page,
        size: 10,
      };
      const result = await getOffersList(param as any);
      if (result?.data) {
        const offersData = result?.data?.data;
        const dataFormat = offersData?.map((offer: any) => {
          const attributes = convertStringToJson(offer?.attributes);
          const symbol =
            attributes?.find(
              (x: any) => x?.trait_type?.toLocaleLowerCase() === "symbol"
            )?.value || null;
          const rarity =
            attributes?.find(
              (x: any) => x?.trait_type?.toLocaleLowerCase() === "rarity"
            )?.value || null;
          const constorder_parameters_obj = decryptOrder(
            offer?.order_parameters
          );
          const listingAmount =
            getCurrentPrice({
              order_parameters_obj: constorder_parameters_obj,
            }) || 0;
          return { ...offer, symbol, rarity, listingAmount };
        });
        result?.data?.data && setOffers([...offers, ...dataFormat]);
        result?.data?.meta && setMeta(result?.data?.meta);
        !firstView && setFirstView(true);
        setLoading(false);
      } else {
        setOffers([]);
        !firstView && setFirstView(true);
        setLoading(false);
      }
    } catch (e) {
      setOffers([]);
      !firstView && setFirstView(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firstView) return;
    if (
      address &&
      (!meta?.last_page || (meta?.last_page && page <= meta?.last_page))
    ) {
      handleGetOffers();
    }
  }, [address, page, reloadData]);

  useEffect(() => {
    if (!firstView) return;
    setPage(1);
    setOffers([]);
    setReloadData(!reloadData);
  }, [sort]);

  useEffect(() => {
    if (firstView) return;
    handleGetOffers();
  }, [address]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  const handleCancelOffer = async () => {
    try {
      if (!address || !offerSelected) return;
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
      const order = offerSelected;
      if (!order) return null;
      order.order_parameters_obj = decryptOrder(order?.order_parameters);
      const receipt = await seaport
        .cancelOrders(
          [order?.order_parameters_obj],
          order?.order_parameters_obj?.offerer
        )
        .transact();
      receipt?.wait();
      const user = getUserFromLocal();
      if (receipt) {
        const result = await cancelOrder({
          order_id: order?.offer_id,
          wallet_address: address,
          signature: user?.signature,
        });
        if (result) {
          setReloadData(!reloadData);
          handleHideCancelOffer();
          setPage(1);
          setMeta(undefined);
          setOffers([]);
          toast("Cancel offer successfully", toastType.SUCCESS);
        }
      }
    } catch (e) {
      handleHideCancelOffer();
      toast("Can't cancel this offer", toastType.ERROR);
    }
  };

  return (
    <div className="py-5 px-5 lg:pl-8 lg:pr-[60px]">
      <div className="md:bg-white rounded-[8px] md:p-5">
        <div className="flex justify-between">
          <div className="text-[18px] leading-[25px] font-semibold pl-3 md:pl-5">
            My Offers
          </div>
          <SelectComponent
            plachoderOptions={{ name: "Sort by", value: "" }}
            className="bg-white md:bg-[#F4F7FF] opacity-60 w-[163px] md:w-auto"
            options={listSortTypes}
            onChange={setSort}
          />
        </div>
        {!!offers?.length ? (
          <div>
            <table className="w-full border-separate border-spacing-y-1 mt-3">
              <tr className="text-[14px] hidden md:table-row leading-[22px] opacity-60">
                <th className="font-normal pl-5 text-left">Event</th>
                <th className="font-normal text-left">Listing Price</th>
                <th className="font-normal text-left">Offered Price</th>
                <th className="font-normal text-left">Difference</th>
                <th className="font-normal text-left">Status</th>
                <th className="font-normal text-right pr-5">Action</th>
              </tr>
              {offers?.map((offer: any, index: number) => {
                return index === offers.length - 1 &&
                  !meta?.last_page &&
                  page <= meta?.last_page ? (
                  <OffersItemComponent
                    offer={offer}
                    index={index}
                    setLastElement={setLastElement}
                    handleSelectOffer={handleSelectOffer}
                  />
                ) : (
                  <OffersItemComponent
                    offer={offer}
                    index={index}
                    setLastElement={setLastElement}
                    handleSelectOffer={handleSelectOffer}
                  />
                );
              })}
            </table>
          </div>
        ) : (
          <>
            {loading ? (
              <RecordLoading />
            ) : (
              <div className="w-full py-10 text-center">
                <Image
                  src="/images/icons/icon_no_record.svg"
                  className="mx-auto"
                  width={100}
                  height={100}
                  alt="no nft"
                />
                <p className="text-[18px] mt-3 font-semibold">No items found</p>
              </div>
            )}
          </>
        )}
      </div>
      <CancelOfferModal
        isOpen={isShowCancelOffer}
        order={offerSelected}
        currentPrice={offerSelected?.currentPrice || 0}
        handleCancelOffer={handleCancelOffer}
        handleHideModal={handleHideCancelOffer}
      />
    </div>
  );
};

export default MyOffers;
