import { OffersListType } from "@/types/my-account-type";
import { convertDecimalToNum, getUserFromLocal } from "@/utils/network";
import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState } from "react";
import { getNumberFormatUs } from "@/utils";
import { formatTimestampToDate, getExpirationTimeOffer } from "@/utils/time";
import CancelOfferModal from "@/components/modals/cancel-offer-modal";
import { getDifferenceBelow, getFrom, validGetFrom } from "@/utils/market";
import { toastType } from "@/constants/context";
import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";
import { MARKET_CONTRACT, NFT_CONTRACT_VIEW } from "@/hooks/use-contract";
import { decryptOrder } from "@/utils/nft";
import { cancelOrder, fullfillOrder } from "@/services/market";
import AcceptOfferModal from "@/components/modals/accept-offer-modal";
import FinishSoldModal from "@/components/modals/finish-sold-modal";
import Link from "next/link";
import { useRouter } from "next/router";
import { pathname } from "@/constants/nav";

const OffersList = ({
  orders,
  address,
  reloadData,
  currentPrice,
  isOwner,
  isAccept,
  id,
  toast,
  setReloadData,
  handleShowMakeOffer,
}: OffersListType) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [isShowCancelOffer, setIsShowCancelOffer] = useState<boolean>(false);
  const [isShowAcceptOffer, setIsShowAcceptOffer] = useState<boolean>(false);
  const [isShowFinishSold, setIsShowFinishSold] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<any>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  const [orderSelectedIndex, setOrderSelectedIndex] = useState<
    number | undefined
  >();

  const orderSort = useMemo(() => {
    if (!orders || !orders.length) return orders;
    const orderSort = orders?.sort(
      (orderAfter: any, orderBefore: any) =>
        convertDecimalToNum(orderBefore?.end_amount) -
        convertDecimalToNum(orderAfter?.end_amount)
    );
    return orderSort;
  }, [orders]);

  const handleShowCancelOffer = () => setIsShowCancelOffer(true);
  const handleHideCancelOffer = () => setIsShowCancelOffer(false);

  const handleShowAcceptOffer = () => setIsShowAcceptOffer(true);
  const handleHideAcceptOffer = () => setIsShowAcceptOffer(false);

  const handleShowFinishSold = () => setIsShowFinishSold(true);
  const handleHideFinishSold = () => {
    setIsShowFinishSold(false);
    if (isSuccess) router.push(`${pathname?.MYACCOUNT}${pathname?.MYCARDS}`);
  };

  const handleSelectOffer = (index: number) => {
    setOrderSelectedIndex(index);
    handleShowCancelOffer();
  };

  const handleSelectAccept = (index: number) => {
    setOrderSelectedIndex(index);
    handleShowAcceptOffer();
  };

  const isHaveMyOffer = useMemo(() => {
    return orderSort?.some((order: any) => order?.offerer === address);
  }, [address, orderSort]);

  const handleCancelOffer = async () => {
    try {
      if (!address || typeof orderSelectedIndex !== "number") return;
      const windowAny = window as any;
      const provider = new ethers.providers.Web3Provider(windowAny?.ethereum);
      const seaport = new Seaport(provider, {
        overrides: {
          contractAddress: MARKET_CONTRACT,
        },
      });
      const order = orderSort[orderSelectedIndex];
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
          order_id: order?.id,
          wallet_address: address,
          signature: user?.signature,
        });
        if (result) {
          setReloadData(!reloadData);
          handleHideCancelOffer();
          toast("Cancel offer successfully", toastType.SUCCESS);
        }
      }
    } catch (e) {
      handleHideCancelOffer();
      toast("Can't cancel this offer", toastType.ERROR);
    }
  };

  const handleAcceptOffer = async () => {
    handleHideAcceptOffer();
    if (typeof window !== "undefined") {
      try {
        if (!address || typeof orderSelectedIndex === "undefined") return;
        const currentOffer = orderSort[orderSelectedIndex];
        const windowAny = window as any;
        const provider = new ethers.providers.Web3Provider(windowAny?.ethereum);
        const seaport = new Seaport(provider, {
          overrides: {
            contractAddress: MARKET_CONTRACT,
          },
        });
        currentOffer.order_parameters_obj = decryptOrder(
          currentOffer?.order_parameters
        );
        const param = {
          order: {
            parameters: currentOffer?.order_parameters_obj,
            signature: currentOffer?.order_signature,
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
          transactionData?.wait();
        }
        if (transactionData) {
          setTransaction(transactionData);
          handleShowFinishSold();
          setIsSuccess(true);
          setIsProcessing(true);
          const user = getUserFromLocal();
          const paramApi = {
            order_id: currentOffer?.id,
            wallet_address: address,
            signature: user?.signature,
          };
          const result = await fullfillOrder(paramApi as any);
          if (result) {
            setIsSuccess(true);
            handleShowFinishSold();
            setIsProcessing(false);
          } else {
            setIsSuccess(false);
            handleShowFinishSold();
            setIsSuccess(false);
            setIsProcessing(false);
          }
        } else {
          setIsSuccess(false);
          handleShowFinishSold();
        }
      } catch (e) {
        setIsSuccess(false);
        handleShowFinishSold();
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-[8px] mt-5">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsShow(!isShow)}
      >
        <div className="flex gap-1 items-center text-[#2152CB] font-semibold">
          <Image
            src="/images/icons/offers.svg"
            width={20}
            height={20}
            alt="listing icon"
          />
          Offers
        </div>
        <Image
          src="/images/icons/arrow_down.svg"
          className={clsx(isShow ? "rotate-180" : "", "duration-100")}
          width={12}
          height={12}
          alt="arrow down"
        />
      </div>
      {isShow && (
        <>
          <div className="mt-3 max-h-[460px] lg:max-h-[310px] overflow-auto">
            <table className="w-full text-[14px] leading-[22px] border-separate border-spacing-y-1 table-fixed">
              <tr className="font-normal opacity-60 py-1 pr-1 hidden md:table-row">
                <th className="text-left font-normal pl-5 pr-1">Price</th>
                <th className="text-left font-normal pr-1">Difference</th>
                <th className="text-left font-normal pr-1">Expiration</th>
                <th className="text-right font-normal pr-5">From</th>
                {isHaveMyOffer && <th></th>}
              </tr>
              {orderSort &&
                orderSort?.map((order: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className="bg-[#F4F7FF] grid grid-cols-2 gap-3 p-5 rounded-[8px] md:p-0 md:table-row md:pt-1 hover:bg-[#E1E9FF] group align-top"
                    >
                      <td className="md:py-3 md:pl-5 md:pr-1 rounded-l-[8px]">
                        <div className="text-[14px] leading-[22px] opacity-60 md:hidden">
                          Price
                        </div>
                        <div>{`${getNumberFormatUs(
                          convertDecimalToNum(order?.end_amount)
                        )} BUSD`}</div>
                      </td>
                      <td className="md:py-3 md:pr-1">
                        <div className="text-[14px] leading-[22px] opacity-60 md:hidden">
                          Difference
                        </div>
                        <div>
                          {getDifferenceBelow(
                            currentPrice,
                            order?.end_amount,
                            "% below",
                            "% above"
                          )}
                        </div>
                      </td>
                      <td className="md:py-3 md:pr-1">
                        <div className="text-[14px] leading-[22px] opacity-60 md:hidden">
                          Expiration
                        </div>
                        <div className="min-w-[100px]">
                          {getExpirationTimeOffer(order?.expiration_time)}
                        </div>
                        <div className="text-[10px] leading-[16px] opacity-50 group-hover:block hidden">
                          {formatTimestampToDate(order?.expiration_time)}
                        </div>
                      </td>
                      <td
                        className={clsx(
                          "md:text-right md:py-3 md:pr-5 text-[#2152CB]",
                          isHaveMyOffer || isAccept ? "" : "rounded-r-[8px]"
                        )}
                      >
                        <div className="text-[14px] leading-[22px] opacity-60 md:hidden">
                          From
                        </div>
                        {validGetFrom(getFrom(address, order?.offerer)) ? (
                          <div>{getFrom(address, order?.offerer)}</div>
                        ) : (
                          <Link
                            href={`${NFT_CONTRACT_VIEW}?a=${order?.offerer}`}
                            target={"_blank"}
                          >
                            <div className="text-[#2152CB]">
                              {getFrom(address, order?.offerer)}
                            </div>
                          </Link>
                        )}
                      </td>
                      {isAccept ? (
                        <td className="w-full lg:w-fit rounded-r-[8px] md:py-3 md:px-5 text-right col-span-2">
                          <button
                            className="w-full lg:w-auto h-[33px] btn-accept px-4 whitespace-nowrap"
                            onClick={() => handleSelectAccept(index)}
                          >
                            Accept offer
                          </button>
                        </td>
                      ) : (
                        isHaveMyOffer && (
                          <td className="w-full lg:w-fit rounded-r-[8px] md:py-3 md:px-5 text-right col-span-2">
                            {order?.offerer === address && (
                              <button
                                className="w-full lg:w-auto h-[33px] btn-cancel px-4 whitespace-nowrap"
                                onClick={() => handleSelectOffer(index)}
                              >
                                Cancel offer
                              </button>
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
            </table>
            {(!orderSort || !orderSort.length) && (
              <div className="py-[60px]">
                <Image
                  src="/images/icons/icon_no_record.svg"
                  className="mx-auto"
                  width={60}
                  height={60}
                  alt="no listing"
                />
                <div className="mt-3 text-[14px] leading-[22px] text-center">
                  No offer yet
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-2">
            {!isHaveMyOffer && !isAccept && (
              <button
                className="btn-line h-[40px] w-full md:max-w-[200px]"
                onClick={() => handleShowMakeOffer()}
                disabled={isOwner}
              >
                Make Offer
              </button>
            )}
          </div>
          {typeof orderSelectedIndex === "number" && (
            <>
              <CancelOfferModal
                isOpen={isShowCancelOffer}
                order={orderSort[orderSelectedIndex]}
                currentPrice={currentPrice}
                handleCancelOffer={handleCancelOffer}
                handleHideModal={handleHideCancelOffer}
              />

              <AcceptOfferModal
                isOpen={isShowAcceptOffer}
                address={address}
                currentPrice={currentPrice}
                order={orderSort[orderSelectedIndex]}
                handleHideModal={handleHideAcceptOffer}
                handleAcceptOffer={handleAcceptOffer}
              />

              <FinishSoldModal
                isOpen={isShowFinishSold}
                id={id}
                isProcessing={isProcessing}
                transaction={transaction}
                isSuccess={isSuccess}
                handleHideModal={handleHideFinishSold}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OffersList;
