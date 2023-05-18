/* eslint-disable react-hooks/exhaustive-deps */
import { toastType } from "@/constants/context";
import { ToastContextType, ToastShowType } from "@/types/context-type";
import clsx from "clsx";
import Image from "next/image";
import { createContext, useEffect, useState } from "react";

export const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

interface Props {
  children: any;
}

export const ToastContextProvider = ({ children }: Props) => {
  const [toastsShow, setToastShow] = useState<ToastShowType[]>([]);
  let id: number | null | any = null;

  useEffect(() => {
    if (toastsShow && toastsShow?.length) {
      id && clearTimeout(id);
      id = setTimeout(() => {
        setToastShow([]);
      }, 8000);
    }
  }, [toastsShow]);

  const toast = (message: string, type: string) => {
    const data = { message, type };
    const cloneData = [...toastsShow];
    cloneData.push(data);
    setToastShow(cloneData);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed z-[60] w-fit max-w-full px-5 top-[68px] right-0">
        {toastsShow?.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(
                "toast-animation flex flex-wrap gap-[6px] text-[14px] rounded-[12px]",
                item?.type === toastType.SUCCESS
                  ? "bg-[#CEFFBD]"
                  : "bg-[#FFD9D9]"
              )}
            >
              <Image
                src={`/images/icons/icon_${item?.type}.svg`}
                className="w-[16px] min-w-[16px] h-[16px] mt-[3px]"
                width={16}
                height={16}
                alt={`icon ${item?.type}`}
              />
              {item?.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
