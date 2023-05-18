import { HASK_KEY } from "@/hooks/use-contract";
import { convertStringToJson } from ".";
import { formatTimeType, formatTimestampToDateUTC } from "./time";
var CryptoJS = require("crypto-js");

const getTimeMinted = (time: number | Date) => {
  if (!time) return "0000-00-00 00:00:00";
  const timeConvertDate =
    typeof time === "number" ? formatTimestampToDateUTC(time) : time;
  const timeFormat = formatTimeType(timeConvertDate, true);
  return timeFormat;
};

export const getNftDetailData = (param: any, id: any,owner: any) => {
  const data = { ...param } as any;
  const attributes =
    typeof param?.attributes === "string"
      ? convertStringToJson(param?.attributes)
      : param?.attributes;
  const rarity = attributes?.find(
    (att: any) => att?.trait_type === "Rarity"
  )?.value;
  const mp = attributes?.find((att: any) => att?.trait_type === "MP")?.value;
  const level = attributes?.find(
    (att: any) => att?.trait_type === "Level"
  )?.value;
  const symbol = attributes?.find(
    (att: any) => att?.trait_type === "Symbol"
  )?.value;
  data.rarity = rarity;
  data.bmp = mp;
  data.mp = mp;
  data.level = level;
  data.id = id;
  data.nft_owner = owner
  data.symbol = symbol;
  data.minted = param?.open_time ? getTimeMinted(param?.open_time) : "_";
  data.status = "Mining";
  return data;
};

export const decryptOrder = (parameters: any) => {
  if (!parameters) return null;
  const bytes = CryptoJS?.AES?.decrypt(parameters, HASK_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return convertStringToJson(originalText);
};
