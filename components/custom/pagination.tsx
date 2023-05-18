import { PaginationType } from "@/types/global-type";
import clsx from "clsx";
import Image from "next/image";

const Pagination = ({ pages, currentPage, onChange }: PaginationType) => {
  const handleNextPage = () => {
    if (currentPage === pages) return;
    onChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) return;
    onChange(currentPage - 1);
  };

  if (pages <= 1) return null;

  return (
    <div>
      <div className="flex gap-1 items-center">
        {pages > 1 && (
          <button
            className="w-[30px] min-w-[30px] h-[30px] bg-[#001D50] rounded-[4px] flex items-center justify-center"
            onClick={() => handlePreviousPage()}
          >
            <Image
              src="/images/icons/arrow_left_light.svg"
              width={14}
              height={14}
              alt="arrow left"
            />
          </button>
        )}
        {[...Array(pages)]?.map((_, index: number) => {
          if (
            index > 1 &&
            index + 1 !== currentPage &&
            index < pages - 2 &&
            index === currentPage - 2
          )
            return <div className={`${index + 1}`}>...</div>;
          if (
            index < pages - 2 &&
            index > 1 &&
            index + 1 !== currentPage &&
            index === pages - 3
          )
            return <div className={`${index + 1}`}>...</div>;
          if (index > 1 && index < pages - 2 && index + 1 !== currentPage)
            return null;
          return (
            <button
              key={index}
              className={clsx(
                "w-[22px] h-[30px] min-w-[22px] font-semibold rounded-[4px] text-[16px] leading-[22px]",
                currentPage === index + 1 ? "bg-[#001D50] text-white" : ""
              )}
              onClick={() => onChange(index + 1)}
            >
              {index + 1}
            </button>
          );
        })}
        {pages > 1 && (
          <button
            className="w-[30px] min-w-[30px] h-[30px] bg-[#001D50] rounded-[4px] flex items-center justify-center"
            onClick={() => handleNextPage()}
          >
            <Image
              src="/images/icons/arrow_right_light.svg"
              width={14}
              height={14}
              alt="arrow left"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
