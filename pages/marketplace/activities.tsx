import { NetworkContext } from "@/components/context/network-context";
import Pagination from "@/components/custom/pagination";
import RecordLoading from "@/components/loading/record-loading";
import { activityView, marketActivityFilter } from "@/constants/market";
import { nftActivity, pathname } from "@/constants/nav";
import { NFT_CONTRACT_VIEW } from "@/hooks/use-contract";
import { getMarketLog } from "@/services/market";
import { convertStringToJson, getNumberFormatUs } from "@/utils";
import { getFrom, validGetFrom } from "@/utils/market";
import { convertDecimalToNum, getUserFromLocal } from "@/utils/network";
import { formatTimeString } from "@/utils/time";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const MarketplaceActivities = () => {
  const [selectFilter, setSelectFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [activities, setActivities] = useState<any>();
  const { address } = useAccount();
  const { signature } = useContext(NetworkContext);
  const [meta, setMeta] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetActivities = async () => {
    try {
      const user = getUserFromLocal();
      const param = {
        wallet_address: address,
        signature: user?.signature,
        activities: selectFilter
          ? [selectFilter]
          : [
              nftActivity?.BUY,
              nftActivity?.LISTING,
              nftActivity?.OFFER,
              nftActivity?.TAKE_OFFER,
            ],
        page: page,
        size: 10,
      };
      const result = await getMarketLog(param as any);
      if (result?.data?.data?.length) {
        const data = result?.data?.data;
        const dataFormat = data?.map((value: any) => {
          const attributes = convertStringToJson(value?.attributes);
          const detail = convertStringToJson(value?.detail);
          const symbol =
            attributes?.find(
              (x: any) => x?.trait_type?.toLocaleLowerCase() === "symbol"
            )?.value || null;
          const rarity =
            attributes?.find(
              (x: any) => x?.trait_type?.toLocaleLowerCase() === "rarity"
            )?.value || null;
          const price = detail?.price || 0;
          const from = detail?.from || "";
          const to = detail?.to || "";
          return { ...value, symbol, rarity, price, from, to };
        });
        setActivities(dataFormat);
        setLoading(false);
      } else {
        setActivities(undefined);
        setLoading(false);
      }
      if (result?.data?.meta) {
        setMeta(result?.data?.meta);
      }
    } catch (e) {
      setActivities(undefined);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, signature, page, selectFilter]);

  const handleChangePage = (value: number) => {
    setPage(value);
  };

  const handleSelectFilter = (value: string) => {
    setSelectFilter(value);
    setPage(1);
  };

  return (
    <div className="pb-5">
      <div className="px-5 lg:pr-[60px] lg:pl-8 text-[28px] leading-[39px] text-center lg:text-left lg:text-[32px] lg:leading-[44px] font-semibold pt-3">
        Marketplace Activities
      </div>
      <div className="w-full h-[1.5px] bg-black opacity-20 mt-3 mb-5" />
      <div className="lg:pr-[60px] lg:pl-8 px-5">
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            {marketActivityFilter?.map((activity: any, index: number) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    "text-[14px] leading-[19px] px-5 py-2 rounded-[20px] font-semibold cursor-pointer select-none",
                    selectFilter === activity?.value
                      ? "bg-[#002464] text-white"
                      : "bg-white"
                  )}
                  onClick={() => handleSelectFilter(activity?.value)}
                >
                  {activity?.title}
                </div>
              );
            })}
          </div>
          {meta && (
            <div className="hidden lg:block">
              <Pagination
                pages={meta?.last_page}
                currentPage={page}
                onChange={handleChangePage}
              />
            </div>
          )}
        </div>
        <div className="md:bg-white rounded-[8px] md:p-5 mt-3">
          {activities ? (
            <table className="w-full border-separate border-spacing-y-1">
              <tr className="text-[14px] hidden md:table-row leading-[22px] opacity-60">
                <th className="font-normal pl-5 text-left">Event</th>
                <th className="font-normal text-left">NFT</th>
                <th className="font-normal text-left">Price</th>
                <th className="font-normal text-left">From</th>
                <th className="font-normal text-left">To</th>
                <th className="font-normal pr-5 text-right">Date</th>
              </tr>
              {activities?.map((activity: any, index: number) => {
                return (
                  <tr
                    key={index}
                    className={clsx(
                      "bg-white md:bg-[#F4F7FF] rounded-[8px] text-[14px] p-5 md:p-0 mb-2 leading-[20px] grid gap-3 md:table-row",
                      "grid-cols-2"
                    )}
                  >
                    <td className="rounded-l-[8px] hidden md:table-cell h-full py-2 pl-5">
                      <div
                        className="flex gap-1"
                        style={{
                          color: activityView[activity?.activity]?.color,
                        }}
                      >
                        <Image
                          src={`/images/icons/${
                            activityView[activity?.activity]?.icon
                          }`}
                          width={20}
                          height={20}
                          alt="activity"
                        />
                        {activityView[activity?.activity]?.title}
                      </div>
                    </td>
                    <td className="md:py-2 col-span-2">
                      <div className="flex gap-1 items-center">
                        <div
                          className={clsx(
                            `${activity?.rarity?.toLocaleLowerCase()}-type`,
                            "w-[40px] min-w-[40px] h-[58px] pt-1 rounded-[2px]"
                          )}
                        >
                          <Image
                            src={`/images/nfts/${activity?.symbol?.toLocaleLowerCase()}.png`}
                            className={`max-w-[36}px] max-h-[36px]`}
                            width={36}
                            height={36}
                            alt="token symbol"
                          />
                          <div className="text-[6px] leading-[7px] text-white text-center">
                            {activity?.symbol}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold pb-1">{`${activity?.symbol} (${activity?.name})`}</div>
                          <div className="flex items-center gap-1">
                            <div>{`#${activity?.nft_id}`}</div>
                            <div className="flex items-center gap-1">
                              <div
                                className={clsx(
                                  `${activity?.rarity?.toLocaleLowerCase()}-type`,
                                  "w-[10px] min-w-[10px] h-[10px] rounded-full"
                                )}
                              />
                              {activity?.rarity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="rounded-l-[8px] h-full block md:hidden">
                      <div className="opacity-60">Event</div>
                      <div className="flex gap-1">
                        <Image
                          src={`/images/icons/${
                            activityView[activity?.activity]?.icon
                          }`}
                          width={20}
                          height={20}
                          alt="activity"
                        />
                        {activityView[activity?.activity]?.title}
                      </div>
                    </td>
                    <td className="md:py-2">
                      <div className="opacity-60">Price</div>
                      {`${getNumberFormatUs(
                        convertDecimalToNum(activity?.price)
                      )} BUSD`}
                    </td>
                    <td className="md:py-2 text-[#2152CB]">
                      <div className="opacity-60 block md:hidden">From</div>
                      {validGetFrom(getFrom(address, activity?.from)) ? (
                        getFrom(address, activity?.from)
                      ) : (
                        <Link
                          href={`${NFT_CONTRACT_VIEW}?a=${activity?.from}`}
                          target={"_blank"}
                        >
                          {getFrom(address, activity?.from)}
                        </Link>
                      )}
                    </td>
                    <td className="md:py-2 text-[#2152CB] ">
                      <div className="opacity-60 block md:hidden">To</div>
                      {validGetFrom(getFrom(address, activity?.to)) ? (
                        getFrom(address, activity?.to)
                      ) : (
                        <Link
                          href={`${NFT_CONTRACT_VIEW}?a=${activity?.to}`}
                          target={"_blank"}
                        >
                          {getFrom(address, activity?.to)}
                        </Link>
                      )}
                    </td>
                    <td className="rounded-r-[8px] md:py-2 md:pr-5 col-span-2">
                      <div className="opacity-60 block md:hidden">Date</div>
                      <div className="flex md:justify-end gap-1 text-[#2152CB]">
                        {formatTimeString(new Date(activity?.updated_at))}
                        <Image
                          src="/images/icons/icon_open.svg"
                          width={15}
                          height={15}
                          alt="icon open"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </table>
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
                  <p className="text-[18px] mt-3 font-semibold">
                    No items found
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        {meta && (
          <div className="flex justify-center mt-5 lg:hidden">
            <Pagination
              pages={meta?.last_page}
              currentPage={page}
              onChange={handleChangePage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceActivities;
