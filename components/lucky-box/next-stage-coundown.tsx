import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface Props {
  openBoxTime?: Date;
  setIsCoundown: Dispatch<SetStateAction<boolean>>;
}

const LuckyBoxCoundown = ({ openBoxTime, setIsCoundown }: Props) => {
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
      }, 10000);
    }
  }, [openBoxTime, setIsCoundown]);

  return (
    <div className="xl:flex gap-[4px] text-white mt-[25px]">
      <p ref={daysRef} className="">
        00
      </p>
      <p ref={hoursRef} className="">
        00
      </p>
      <p ref={minutesRef} className="">
        00
      </p>
    </div>
  );
};

export default LuckyBoxCoundown;
