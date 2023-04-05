/* eslint-disable react-hooks/exhaustive-deps */
import { pathname } from "@/constants/nav";
import Image from "next/image";
import Link from "next/link";
import useMediaQuery from "../hooks/media-query";

const stages = [
  {
    name: "Stage 1",
    totalBoxes: 10,
    opened: 2,
  },
];

interface Props {
  boxNum: any;
}

const MyBoxes = ({ boxNum }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const getRemainBoxes = (total: number | string, opened: number | string) => {
    const totalBoxes = total
      ? typeof total === "string"
        ? Number(total)
        : total
      : 0;
    const openedBoxes = opened
      ? typeof opened === "string"
        ? Number(opened)
        : opened
      : 0;
    const remain = totalBoxes - openedBoxes;
    if (remain < 0) return 0;
    return remain;
  };

  return (
    <div>
      <div className="grid-cols-5 px-5 hidden lg:grid gap-[6px] text-[14px] opacity-60">
        <p>Stage</p>
        <p>Total boxes</p>
        <p>Opened</p>
        <p>Remain</p>
        <p>Action</p>
      </div>
      {isDesktop
        ? stages?.map((stage, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-5 gap-[6px] text-[14px] items-center p-5 bg-white rounded-[6px] mt-[6px]"
              >
                <p>{stage?.name}</p>
                <p>{boxNum?.total ? boxNum?.total : 0}</p>
                <p>{boxNum?.opened ? boxNum?.opened : 0}</p>
                <p>{getRemainBoxes(boxNum?.total, boxNum?.opened)}</p>
                <Link href={pathname.LUCKYBOX}>
                  <p className="flex items-center gap-[6px] font-semibold leading-[22px] text-[#2152CB]">
                    Open now
                    <Image
                      src="/images/icons/icon_open.svg"
                      width={15}
                      height={15}
                      alt="icon open"
                    />
                  </p>
                </Link>
              </div>
            );
          })
        : stages?.map((stage, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-2 gap-[6px] text-[14px] p-5 bg-white rounded-[6px] mt-[6px]"
              >
                <div>
                  <p className="text-[14px] opacity-60">Stage</p>
                  <p className="mb-2">{stage?.name}</p>
                  <p className="text-[14px] opacity-60">Action</p>
                  <Link href={pathname.LUCKYBOX}>
                    <p className="flex items-center gap-[6px] font-semibold leading-[22px] text-[#2152CB]">
                      Open now
                      <Image
                        src="/images/icons/icon_open.svg"
                        width={15}
                        height={15}
                        alt="icon open"
                      />
                    </p>
                  </Link>
                </div>
                <div>
                  <p className="text-[14px] opacity-60">Total boxes</p>
                  <p className="mb-2">{boxNum?.total}</p>
                  <p className="text-[14px] opacity-60">Remain</p>
                  <p className="mb-2">
                    {getRemainBoxes(boxNum?.total, boxNum?.opened)}
                  </p>
                  <p className="text-[14px] opacity-60">Opened</p>
                  <p>{boxNum?.opened}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default MyBoxes;
