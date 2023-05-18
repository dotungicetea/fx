import { TabType } from "@/types/global-type";
import clsx from "clsx";
import Link from "next/link";

const Tab = ({
  tabsContent,
  tabNumber,
  className,
  isButton,
  hrefButton,
  lineClassName,
  handleChangeTab,
}: TabType) => {
  return (
    <div>
      {isButton && (
        <Link href={hrefButton || "/"}>
          <button
            className={clsx(
              "btn-fill w-[200px] h-[40px] block items-center mx-auto text-[14px] mt-3",
              "lg:float-right lg:-mt-3 lg:mr-8 lg:mx-0"
            )}
          >
            View all activities
          </button>
        </Link>
      )}
      <div
        className={clsx(
          "grid lg:flex mt-5 lg:mt-10 gap-[40px]",
          `grid-cols-${tabsContent?.length | 0}`,
          className
        )}
      >
        {tabsContent &&
          !!tabsContent?.length &&
          tabsContent?.map((tab, index) => {
            return (
              <button
                key={index}
                className={clsx(
                  "font-[600] relative text-[#0A1E42]",
                  tabNumber === index
                    ? "text-[#0A1E42] after:content-[''] after:w-[100%] after:absolute after:left-0 after:bottom-[-12px] after:h-[3px] after:bg-[#0A1E42] after:rounded-[20px]"
                    : "opacity-50"
                )}
                onClick={() => handleChangeTab(index)}
              >
                {tab}
              </button>
            );
          })}
      </div>
      <div
        className={clsx(
          "mt-[10px] h-[1px] w-[full] bg-[#002464] bg-opacity-20",
          lineClassName
        )}
      />
    </div>
  );
};

export default Tab;
