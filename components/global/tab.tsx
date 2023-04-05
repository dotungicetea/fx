import { TabType } from "@/types/global-type";
import clsx from "clsx";

const Tab = ({ tabsContent, tabNumber, handleChangeTab }: TabType) => {
  return (
    <div>
      <div className="grid grid-cols-2 lg:flex mt-5 lg:mt-10 gap-[40px]">
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
      <div className="mt-[10px] mb-5 h-[1px] w-[full] bg-[#002464] bg-opacity-20" />
    </div>
  );
};

export default Tab;
