import { compareTime } from "@/utils/time";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import LuckyBoxCoundown from "./lucky-box-coundown";
import LuckyBoxSold from "./lucky-box-sold";
import { LuckyBoxStageType } from "@/types/lucky-box";

const currentStage = {
  title: "Stage 1",
  stageIndex: 0,
  openBoxTime: new Date(Date.UTC(2023, 3, 5, 3, 9, 10)),
};
const nextStage = {
  title: "Stage 2",
  stageIndex: 1,
  openBoxTime: new Date(Date.UTC(2023, 10, 2, 8, 2, 10)),
};
const afterNextStage = {
  title: "Stage 3",
  stageIndex: 2,
  openBoxTime: new Date(Date.UTC(2024, 6, 2, 8, 2, 10)),
};

const LuckyBoxStage = ({
  totalBoxList,
  boxNum,
  reloadData,
  setReloadData,
  boxList,
  setBoxList,
}: LuckyBoxStageType) => {
  const [isCoundown, setIsCoundown] = useState<boolean>(true);
  const [stages, setStages] = useState<any>({
    currentStage: currentStage,
    nextStage: nextStage,
  });
  const totalBox = 10000;
  const boxSold = useMemo(() => {
    if (totalBoxList?.total) {
      const totalBoxBuy = Number(totalBoxList?.total);
      const currentStageBoxTotal =
        totalBoxBuy - stages?.currentStage?.stageIndex * totalBox;
      if (currentStageBoxTotal <= 0) return 0;
      if (currentStageBoxTotal >= totalBox) return totalBox;
      return currentStageBoxTotal;
    } else {
      return 0;
    }
  }, [totalBoxList, stages]);

  const isAllBoxSold = useMemo(() => {
    return boxSold === totalBox;
  }, [boxSold, totalBox]);

  useEffect(() => {
    const currentDateTime = new Date();
    const isCoundownTime = compareTime(
      stages?.currentStage?.openBoxTime,
      currentDateTime
    );
    setIsCoundown(isCoundownTime);
  }, [isAllBoxSold, stages]);

  return (
    <div className="mt-5 lg:mt-0">
      <h1
        className={clsx(
          "text-[28px] text-[#0A1E42] leading-[38px] font-[600]",
          "xl:text-[32px] xl:leading-[38px]"
        )}
      >
        {`${stages?.currentStage?.title} Lucky Boxes`}
      </h1>
      <p className="text-[14px] leading-[22px] text-[#0A1E42] xl:mt-2">
        {isAllBoxSold
          ? `All boxes are sold out! Please wait for ${stages?.nextStage?.title}.`
          : isCoundown
          ? "Stay tuned and get ready to grab yourself some NFT currency lucky boxes as the first stage is about to open soon."
          : "Limited boxes are available, so grab your lucky box now!!!"}
      </p>
      {isCoundown ? (
        <LuckyBoxCoundown
          totalBox={totalBox}
          openBoxTime={stages?.currentStage?.openBoxTime}
          setIsCoundown={setIsCoundown}
        />
      ) : (
        <LuckyBoxSold
          boxSold={boxSold}
          totalBox={totalBox}
          boxNum={boxNum}
          reloadData={reloadData}
          setReloadData={setReloadData}
          boxList={boxList}
          setBoxList={setBoxList}
          isAllBoxSold={isAllBoxSold}
          nextStage={stages?.nextStage}
        />
      )}
    </div>
  );
};

export default LuckyBoxStage;
