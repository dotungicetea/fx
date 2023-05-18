import { DurationListModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import { SelectComponent } from "../custom/select";
import DatePicker from "react-datepicker";
import { useContext, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { dateRanges } from "@/constants/my-account";
import { ToastContext } from "../context/toast-context";
import { toastType } from "@/constants/context";
import { getDatetimeBySelectDateRange } from "@/utils/time";

const DurationListModal = ({
  isOpen,
  dateRange,
  startDatetime,
  endDatetime,
  limitEndDatetime,
  setDateRange,
  setStartDatetime,
  setEndDatetime,
  handleHideModal,
}: DurationListModalType) => {
  const { toast } = useContext(ToastContext);

  const handleSelectDateRange = (value: string) => {
    const rangeDateData = dateRanges?.find((r) => r.value === value);
    const endDatetimebySelect = getDatetimeBySelectDateRange(value, new Date());
    if (limitEndDatetime && endDatetimebySelect) {
      let distance = limitEndDatetime * 1000 - endDatetimebySelect.getTime();
      if (distance < 0) {
        toast(
          "Your offer's duration exceed the expiration date of the NFT listing.",
          toastType.ERROR
        );
        return;
      }
    }
    setDateRange(rangeDateData);
    setStartDatetime(new Date());
    setEndDatetime(endDatetimebySelect);
  };

  const getStartDate = useMemo(() => {
    if (!startDatetime) return "Select";
    const dateFormat = startDatetime?.toLocaleDateString("en-GB");
    if (!dateFormat) return "Select";
    return dateFormat;
  }, [startDatetime]);

  const getEndDate = useMemo(() => {
    if (!endDatetime) return "Select";
    const dateFormat = endDatetime?.toLocaleDateString("en-GB");
    if (!dateFormat) return "Select";
    return dateFormat;
  }, [endDatetime]);

  const getStartTime = useMemo(() => {
    const result = {} as any;
    if (!startDatetime) return result;
    const hour = startDatetime?.getHours();
    result.isPm = hour >= 12 ? true : false;
    const time = startDatetime?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    result.time = time?.slice(0, 5);
    return result;
  }, [startDatetime]);

  const getEndTime = useMemo(() => {
    const result = {} as any;
    if (!endDatetime) return result;
    const hour = endDatetime?.getHours();
    result.isPm = hour >= 12 ? true : false;
    const time = endDatetime?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    result.time = time?.slice(0, 5);
    return result;
  }, [endDatetime]);

  const handleSelectStartTime = (date: Date) => {
    date.setHours(new Date().getHours());
    date.setMinutes(new Date().getMinutes());
    date.setSeconds(new Date().getSeconds());
    date.setMilliseconds(new Date().getMilliseconds());
    setStartDatetime(date);
  };

  const handleSelectEndTime = (date: Date) => {
    date.setHours(new Date().getHours());
    date.setMinutes(new Date().getMinutes());
    date.setSeconds(new Date().getSeconds());
    date.setMilliseconds(new Date().getMilliseconds());
    const date6Month = new Date();
    date6Month.setMonth(new Date().getMonth() + 6);
    if (limitEndDatetime) {
      let distance = limitEndDatetime * 1000 - date.getTime();
      if (distance < 0) {
        const limitDate = new Date(limitEndDatetime * 1000);
        if (
          limitDate?.getFullYear() === date?.getFullYear() &&
          limitDate?.getMonth() === date?.getMonth() &&
          limitDate?.getDate() === date?.getDate()
        ) {
          date.setHours(limitDate.getHours());
          date.setMinutes(limitDate.getMinutes());
          date.setSeconds(limitDate.getSeconds());
          date.setMilliseconds(limitDate.getMilliseconds());
          setEndDatetime(date);
          setStartDatetime(new Date());
          setDateRange({ name: "", value: "" });
          return;
        }
        toast(
          "Your offer's duration exceed the expiration date of the NFT listing.",
          toastType.ERROR
        );
        return;
      }
    }
    let distance = date6Month.getTime() - date.getTime();
    if (distance < 0) {
      toast(
        "The maximum duration for a listing on our marketplace is 6 months. ",
        toastType.ERROR
      );
      return;
    }
    setEndDatetime(date);
    setStartDatetime(new Date());
    setDateRange({ name: "", value: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[536px] text-left"
      >
        <h2 className="text-[28px] leading-[39px] font-[600] text-center">
          Duration
        </h2>
        <div className="w-full overflow-hidden">
          <div className="w-full md:w-[536px]">
            <div className="mb-2 text-[14px] font-semibold">Date Range</div>

            <SelectComponent
              plachoderOptions={{ name: "Please select", value: "" }}
              className="bg-[#F4F7FF] w-full opacity-100"
              options={dateRanges}
              value={dateRange?.value}
              onChange={handleSelectDateRange}
            />

            <div className="md:flex mt-5">
              <div className="w-full md:w-[248px]">
                <p className="mb-2 text-[14px] font-semibold">Starting</p>
                <div className="w-full h-[40px] mt-2 px-[12px] py-[9px] text-[14px] leading-[22px] rounded-[6px] bg-[#F4F7FF] opacity-60">
                  {getStartDate}
                </div>
                <div className="datepicker-listnft h-[272px] mt-2">
                  <DatePicker
                    selected={startDatetime}
                    onChange={handleSelectStartTime}
                    startDate={startDatetime}
                    endDate={endDatetime}
                    minDate={new Date()}
                    maxDate={new Date()}
                    formatWeekDay={(nameOfDay: any) => nameOfDay.substr(0, 3)}
                    inline
                  />
                </div>
                <p className="mb-2 text-[14px] font-semibold">Starting time</p>
                <div className="flex gap-[6px] w-full h-[40px] mt-2 px-[12px] py-[9px] text-[14px] leading-[22px] rounded-[6px] bg-[#F4F7FF]">
                  <Image
                    src="/images/icons/time.svg"
                    className="min-w-[16px]"
                    width={16}
                    height={16}
                    alt="time"
                  />
                  <input
                    className="w-full outline-none border-none bg-transparent"
                    type="time"
                    min={getStartTime?.isPm ? "12:00" : "00:00"}
                    max={getStartTime?.isPm ? "23:59" : "11:59"}
                    value={getStartTime?.time || ""}
                    disabled
                  />
                  <div className="text-[14px] font-semibold cursor-pointer">
                    {getStartTime?.isPm ? "PM" : "AM"}
                  </div>
                </div>
              </div>
              <div className="mx-auto pt-[34px]">-</div>
              <div className="w-full md:w-[248px]">
                <p className="mb-2 text-[14px] font-semibold">Ending</p>
                <div className="w-full h-[40px] mt-2 px-[12px] py-[9px] text-[14px] leading-[22px] rounded-[6px] bg-[#F4F7FF] opacity-60">
                  {getEndDate}
                </div>
                <div className="datepicker-listnft h-[272px] mt-2">
                  <DatePicker
                    selected={endDatetime}
                    onChange={handleSelectEndTime}
                    startDate={startDatetime}
                    endDate={endDatetime}
                    minDate={new Date()}
                    formatWeekDay={(nameOfDay: any) => nameOfDay.substr(0, 3)}
                    inline
                  />
                </div>
                <p className="mb-2 text-[14px] font-semibold">Ending time</p>
                <div className="flex gap-[6px] w-full h-[40px] mt-2 px-[12px] py-[9px] text-[14px] leading-[22px] rounded-[6px] bg-[#F4F7FF]">
                  <Image
                    src="/images/icons/time.svg"
                    className="min-w-[16px]"
                    width={16}
                    height={16}
                    alt="time"
                  />
                  <input
                    className="w-full outline-none border-none bg-transparent"
                    type="time"
                    min={getEndTime?.isPm ? "12:00" : "00:00"}
                    max={getEndTime?.isPm ? "23:59" : "11:59"}
                    value={getEndTime?.time || ""}
                    disabled
                  />
                  <div className="text-[14px] font-semibold cursor-pointer">
                    {getEndTime?.isPm ? "PM" : "AM"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DurationListModal;
