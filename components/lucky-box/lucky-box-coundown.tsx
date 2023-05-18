import { LuckyBoxCoundownType } from "@/types/lucky-box";
import { getBoxesText } from "@/utils";
import clsx from "clsx";
import { useEffect, useRef } from "react";

const LuckyBoxCoundown = ({
  totalBox,
  openBoxTime,
  setIsCoundown,
}: LuckyBoxCoundownType) => {
  const daysRef = useRef<any>();
  const hoursRef = useRef<any>();
  const minutesRef = useRef<any>();
  const secondsRef = useRef<any>();

  useEffect(() => {
    if (openBoxTime) {
      const countDownDate = openBoxTime.getTime();
      const intervalId = setInterval(function () {
        const now = new Date().getTime();
        let distance = countDownDate - now;
        if (distance <= 0) {
          clearInterval(intervalId);
          setIsCoundown(false);
          return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (daysRef && daysRef.current) {
          daysRef.current.innerText = days < 10 ? "0" + days : days;
        }
        if (hoursRef && hoursRef.current) {
          hoursRef.current.innerText = hours < 10 ? "0" + hours : hours;
        }
        if (minutesRef && minutesRef.current) {
          minutesRef.current.innerText = minutes < 10 ? "0" + minutes : minutes;
        }
        if (secondsRef && secondsRef.current) {
          secondsRef.current.innerText = seconds < 0 ? "0" + seconds : seconds;
        }
      }, 1000);
    }
  }, [openBoxTime, setIsCoundown]);

  return (
    <div className="xl:flex gap-[4px] text-white mt-[25px]">
      <div
        className={clsx(
          "coundown-box-bg px-[12px] pt-[15px] pb-[14px] w-full rounded-[8px]",
          "xl:w-[168px] xl:min-w-[168px]"
        )}
      >
        <p className="text-[12px] text-white">Total</p>
        <p className="text-[18px] mt-[6px] whitespace-nowrap text-white">
          {getBoxesText(totalBox)}
        </p>
      </div>
      <div
        className={clsx(
          "coundown-bg w-full rounded-[8px] px-[12px] pt-[15px] pb-[12px] flex gap-[4px] mt-1",
          "xl:mt-0"
        )}
      >
        <p className="text-[12px] mr-auto text-white">Stage 1 opens in:</p>
        <div>
          <p
            ref={daysRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Days</p>
        </div>
        <div className="mt-[10px]">:</div>
        <div>
          <p
            ref={hoursRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Hours</p>
        </div>
        <div className="mt-[10px]">:</div>
        <div>
          <p
            ref={minutesRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Minutes</p>
        </div>
        <div className="mt-[10px]">:</div>
        <div>
          <p
            ref={secondsRef}
            className={clsx(
              "flex w-[40px] h-[40px] text-center text-[18px] leading-[25px] text-white bg-[#F4F7FF] bg-opacity-10 rounded-[4px]",
              "lg:w-[49px] lg:h-[49px] justify-center items-center"
            )}
          >
            00
          </p>
          <p className="text-[8px] text-center mt-[2px] text-white">Second</p>
        </div>
      </div>
    </div>
  );
};

export default LuckyBoxCoundown;
