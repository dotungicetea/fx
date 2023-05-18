/* eslint-disable react-hooks/exhaustive-deps */
import { TooltipContentType, TooltipType } from "@/types/custom";
import { useMemo, useRef, useState } from "react";

const TooltipContent = ({ style, isTop, content }: TooltipContentType) => {
  return (
    <div
      style={style}
      className="absolute h-fit z-10 font-medium text-[10px] leading-[16px] left-[-20px]"
    >
      {!isTop && (
        <div className="w-[14px] h-[14px] overflow-hidden mb-[-4px] ml-5">
          <div className=" h-[10px] w-[10px] bg-white rotate-45 transform origin-bottom-left"></div>
        </div>
      )}
      <div
        style={{ boxShadow: `0px 4px 20px rgba(0, 0, 0, 0.1)` }}
        className="bg-white rounded-lg shadow-sm tooltip text-[#0A1E42] p-[12px] w-[200px] max-w-fit h-fit"
      >
        {content}
      </div>
      {isTop && (
        <div className="w-[14px] h-[14px] overflow-hidden mb-[-4px] ml-5">
          <div className=" h-[10px] w-[10px] bg-white -rotate-45 transform origin-top-left"></div>
        </div>
      )}
    </div>
  );
};

export const Tooltip = ({ children, isTop, content }: TooltipType) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const childRef = useRef<any>();

  const handleOnMouseDown = () => setIsShow(true);
  const handleOnMouseLeave = () => setIsShow(false);

  const getPosition = useMemo(() => {
    const childHeight = childRef?.current?.offsetHeight;
    if (!childHeight) return {};
    if (isTop) {
      return { bottom: `${childHeight}px` };
    } else {
      return { top: `${childHeight}px` };
    }
  }, [childRef?.current?.offsetHeight, isTop]);

  return (
    <div className="relative h-fit flex cursor-pointer">
      <div
        ref={childRef}
        onMouseEnter={() => handleOnMouseDown()}
        onMouseLeave={() => handleOnMouseLeave()}
      >
        {children}
      </div>
      {isShow && (
        <TooltipContent style={getPosition} content={content} isTop={isTop} />
      )}
    </div>
  );
};
