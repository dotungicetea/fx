import { Dispatch, SetStateAction } from "react";

export interface BoxBuyOpenType {
  isOpen?: boolean;
  data?: any;
  numberBox: any;
  handleNumBox: any;
  disabled?: boolean;
  loading?: boolean;
  isBoxOpen?: boolean;
  isWaiting?: boolean;
  actionPopup?: () => void;
}

export interface LuckyBoxCoundownType {
  totalBox: number;
  openBoxTime?: Date;
  setIsCoundown: Dispatch<SetStateAction<boolean>>;
}

export interface LuckyBoxSoldType {
  boxSold: number;
  totalBox: number;
  boxNum: any;
  reloadData: number;
  setReloadData: any;
  boxList: any[];
  isAllBoxSold: any;
  nextStage: any;
  setBoxList: (value: any) => void;
}

export interface LuckyBoxStageType {
  totalBoxList: any;
  boxNum: any;
  reloadData: number;
  setReloadData: any;
  boxList: any[];
  setBoxList: (value: any) => void;
}

export interface MyRecordType {
  myNftList: any[];
  loading: boolean;
}

export interface NextStageCoundownType {
  openBoxTime?: Date;
  setIsCoundown: Dispatch<SetStateAction<boolean>>;
}
