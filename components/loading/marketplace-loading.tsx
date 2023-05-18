import clsx from "clsx";

const MarketplaceLoading = () => {
  return (
    <div
      className={clsx(
        "w-full mt-5 lg:mt-0 gap-[12px] pb-5 flex-1 lg:pr-5 grid grid-cols-2",
        "sm:flex sm:flex-wrap lg:justify-start",
        "animate-pulse h-[250px] max-h-[250px] min-h-[250px] overflow-hidden"
      )}
    >
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
      <div className="rounded-[8px] bg-slate-400 h-[250px] w-full max-w-[164px]"></div>
    </div>
  );
};

export default MarketplaceLoading;
