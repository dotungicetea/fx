import { formatTimeType, getUTCByString } from "@/utils/time";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { pathname } from "@/constants/nav";
import { MyRecordType } from "@/types/lucky-box";
import MyCardLoading from "../loading/my-card-loading";
import RecordLoading from "../loading/record-loading";

const ButtonMyCard = ({ className }: any) => {
  return (
    <button
      className={clsx(
        "flex gap-[9px] min-w-[96px] lg:h-[30px] px-[8px] py-[6px] border-[1px] border-[#0A1E42] rounded-[60px] items-center text-[12px] font-[600]",
        "flex-nowrap h-[40px]",
        className
      )}
    >
      My Cards
      <Image
        src="images/icons/long_arrow_right.svg"
        width={15}
        height={8}
        alt="arrow right"
      />
    </button>
  );
};

const MyRecords = ({ myNftList, loading }: MyRecordType) => {
  const getTimeRecords = (time: string) => {
    if (!time) return "0000-00-00 00:00:00";
    const timeUTC = getUTCByString(time);
    const timeFormatResult = formatTimeType(timeUTC, true);
    return timeFormatResult;
  };

  return (
    <div>
      {(myNftList && !!myNftList?.length) || loading ? (
        <div>
          <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[6px] text-[14px] opacity-60">
            <p>Time</p>
            <p>Opened</p>
            <p>Results</p>
            <p></p>
          </div>
          {loading ? (
            <RecordLoading />
          ) : (
            <>
              {myNftList?.map((record, index) => {
                return (
                  <div
                    key={index}
                    className={clsx(
                      "grid grid-cols-[1fr_100px] gap-x-[6px] gap-y-[12px] items-center px-5 py-[6px] bg-white rounded-[6px] mt-[6px]",
                      "lg:grid-cols-3 xl:grid-cols-4 lg:gap-[6px]"
                    )}
                  >
                    <div>
                      <p className="text-[14px] opacity-60 lg:hidden">Time</p>
                      <div className="flex items-center gap-[6px] text-[14px] text-[#2152CB] font-[600]">
                        {getTimeRecords(record[0]?.updated_at)}
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] opacity-60 lg:hidden">Opened</p>
                      <div className="text-[14px] font-[600]">
                        {record?.length}
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[14px] opacity-60 lg:hidden">
                        Results
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="relative w-[160px] h-[48px]">
                          {record?.map((item: any, index: number) => {
                            return (
                              <Image
                                key={index}
                                className={`absolute top-0 border-[1px] border-white rounded-[2px]`}
                                style={{ left: `${index * 20}px` }}
                                src={item?.image}
                                width={31}
                                height={48}
                                alt="card"
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <Link href={`${pathname?.MYACCOUNT}${pathname?.MYCARDS}`}>
                      <ButtonMyCard />
                    </Link>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <div className="text-center mt-[100px]">
          <Image
            src="/images/icons/icon_no_record.svg"
            className="mx-auto"
            width={100}
            height={100}
            alt="no record"
          />
          <p>You haven&apos;t opened any NFTs yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyRecords;
