import { nftActivity } from "@/constants/nav";
import { NftActivitiesType } from "@/types/my-account-type";
import { getNumberFormatUs } from "@/utils";
import { getFrom, validGetFrom } from "@/utils/market";
import { convertDecimalToNum } from "@/utils/network";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { formatTimeString } from "@/utils/time";
import { activityView } from "@/constants/market";
import Link from "next/link";
import { NFT_CONTRACT_VIEW } from "@/hooks/use-contract";

const NftActivites = ({ activities, address }: NftActivitiesType) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  return (
    <div className="px-5 xl:px-[50px]">
      <div className="bg-white p-5 rounded-[8px] mt-5">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsShow(!isShow)}
        >
          <div className="flex gap-1 items-center text-[#2152CB] font-semibold">
            <Image
              src="/images/icons/nft_activities.svg"
              width={20}
              height={20}
              alt="listing icon"
            />
            NFT Activities
          </div>
          <Image
            src="/images/icons/arrow_down.svg"
            className={clsx(isShow ? "rotate-180" : "", "duration-100")}
            width={12}
            height={12}
            alt="arrow down"
          />
        </div>
        {isShow && activities && (
          <div className="mt-3 max-h-[1000px] lg:max-h-[320px] overflow-auto">
            <table className="w-full text-[14px] leading-[22px] border-separate border-spacing-y-1 table-fixed">
              <tr className="font-normal opacity-60 py-1 hidden md:table-row">
                <th className="text-left font-normal pl-5 flex items-center gap-1">
                  Event
                  <Image
                    src="/images/icons/filter.svg"
                    width={16}
                    height={16}
                    alt="filter icon"
                  />
                </th>
                <th className="text-left font-normal">Price</th>
                <th className="text-left font-normal">From</th>
                <th className="font-normal text-left pr-5">To</th>
                <th className="text-right font-normal pr-5">Date</th>
              </tr>
              {activities &&
                !!activities?.length &&
                activities?.map((activity: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className={clsx(
                        "bg-[#F4F7FF] p-5 md:pt-1 grid grid-cols-2 rounded-[8px] md:mt-0 md:table-row hover:bg-[#E1E9FF] group align-top",
                        index > 0 ? "mt-2" : ""
                      )}
                    >
                      <td className="md:py-3 md:pl-5 rounded-l-[8px]">
                        <div className="text-[14px] md:hidden leading-[22px] opacity-60 mb-1">
                          Event
                        </div>
                        <div
                          className="flex gap-1 items-center"
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
                      <td className="md:py-3">
                        <div className="text-[14px] md:hidden leading-[22px] opacity-60 mb-1">
                          Price
                        </div>
                        <div>
                          {`${getNumberFormatUs(
                            convertDecimalToNum(activity?.detail_obj?.price)
                          )} BUSD`}
                        </div>
                      </td>
                      <td
                        className={clsx(
                          "py-3",
                          getFrom(address, activity?.detail_obj?.from) === "you"
                            ? ""
                            : "text-[#2152CB]"
                        )}
                      >
                        <div className="text-[14px] md:hidden leading-[22px] opacity-60 mb-1">
                          From
                        </div>
                        {validGetFrom(
                          getFrom(address, activity?.detail_obj?.from)
                        ) ? (
                          <div>
                            {getFrom(address, activity?.detail_obj?.from)}
                          </div>
                        ) : (
                          <Link
                            href={`${NFT_CONTRACT_VIEW}?a=${activity?.detail_obj?.from}`}
                            target={"_blank"}
                          >
                            <div className="text-[#2152CB]">
                              {getFrom(address, activity?.detail_obj?.from)}
                            </div>
                          </Link>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="text-[14px] md:hidden leading-[22px] opacity-60 mb-1">
                          To
                        </div>
                        {validGetFrom(
                          getFrom(address, activity?.detail_obj?.to)
                        ) ? (
                          <div>
                            {getFrom(address, activity?.detail_obj?.to)}
                          </div>
                        ) : (
                          <Link
                            href={`${NFT_CONTRACT_VIEW}?a=${activity?.detail_obj?.to}`}
                            target={"_blank"}
                          >
                            <div className="text-[#2152CB]">
                              {getFrom(address, activity?.detail_obj?.to)}
                            </div>
                          </Link>
                        )}
                      </td>
                      <td className="py-3 rounded-r-[8px] md:text-right pr-5 col-span-2">
                        <div className="text-[14px] md:hidden leading-[22px] opacity-60 mb-1">
                          Date
                        </div>
                        <div className="flex gap-1 items-center text-[#2152CB] md:justify-end">
                          {formatTimeString(new Date(activity?.created_at))}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default NftActivites;
