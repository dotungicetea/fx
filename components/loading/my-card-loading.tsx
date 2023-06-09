const MyCardLoading = () => {
  return (
    <div className="animate-pulse flex space-x-4 p-5">
      <div className="rounded-[8px] bg-slate-400 h-[100px] w-[100px]"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-400 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-400 rounded col-span-2"></div>
            <div className="h-2 bg-slate-400 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-400 rounded"></div>
          <div className="h-2 bg-slate-400 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-400 rounded col-span-2"></div>
            <div className="h-2 bg-slate-400 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCardLoading;
