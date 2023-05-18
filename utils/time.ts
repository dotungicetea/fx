import { dateRangeType } from "@/constants/my-account";

export const compareTime = (firstDate: Date | null, lastDate: Date | null) => {
  if (!firstDate) return false;
  const firstDateToTime = firstDate.getTime();
  if (!lastDate) return false;
  const lastDateToTime = lastDate.getTime();
  return firstDateToTime - lastDateToTime > 0;
};

export const formatTimeString = (date: Date) => {
  const yearGet = date.getFullYear();
  const monthGet = date.getMonth() + 1;
  const dateGet = date.getDate();
  const hourGet = date.getHours();
  const minuteGet = date.getMinutes();
  const secondGet = date.getSeconds();
  const hourSmall = hourGet < 10 ? "0" + hourGet : hourGet;
  const minuteSmall = minuteGet < 10 ? "0" + minuteGet : minuteGet;
  const secondSmall = secondGet < 10 ? "0" + secondGet : secondGet;
  return (
    yearGet +
    "/" +
    monthGet +
    "/" +
    dateGet +
    " " +
    hourSmall +
    ":" +
    minuteSmall +
    ":" +
    secondSmall
  );
};

export const formatTimeStringAt = (date: Date, isSecond?: boolean) => {
  const yearGet = date.getFullYear();
  const dateGet = date.getDate();
  const hourGet = date.getHours();
  const minuteGet = date.getMinutes();
  const secondGet = date.getSeconds();
  const monthString = date.toLocaleString("default", { month: "long" });
  var ampm = hourGet >= 12 ? "PM" : "AM";
  return (
    monthString +
    " " +
    dateGet +
    "," +
    yearGet +
    " at " +
    hourGet +
    ":" +
    minuteGet +
    (isSecond ? ":" + secondGet : "") +
    ` ${ampm}`
  );
};

export const getUTCByDatetime = (date: Date) => {
  const years = date.getUTCFullYear();
  const months = date.getUTCMonth();
  const days = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const timeUTC = new Date(
    Date.UTC(years, months, days, hours, minutes, seconds)
  );
  return timeUTC;
};

export const getUTCByString = (time: string) => {
  const timeConvert = new Date(time);
  const timeUTC = getUTCByDatetime(timeConvert);
  return timeUTC;
};

export const formatTimestampToDate = (
  timestamp: number,
  plusTime?: number,
  isAt?: boolean
) => {
  if (!timestamp) return "_";
  const time = plusTime
    ? new Date((timestamp + plusTime) * 1000)
    : new Date(timestamp * 1000);
  if (!time) return "_";
  return isAt ? formatTimeStringAt(time) : formatTimeString(time);
};

export const formatTimestampToDateUTCString = (
  timestamp: number,
  plusTime?: number,
  isAt?: boolean
) => {
  if (!timestamp) return "_";
  const time = plusTime
    ? new Date((timestamp + plusTime) * 1000)
    : new Date(timestamp * 1000);
  if (!time) return "_";
  const timeString = time.toString();
  const timeUTC = getUTCByString(timeString);
  return isAt ? formatTimeStringAt(timeUTC) : formatTimeString(timeUTC);
};

export const formatTimestampToDateUTC = (
  timestamp: number,
  plusTime?: number
) => {
  if (!timestamp) return null;
  const time = plusTime
    ? new Date((timestamp + plusTime) * 1000)
    : new Date(timestamp * 1000);
  if (!time) return null;
  const timeString = time.toString();
  const timeUTC = getUTCByString(timeString);
  return timeUTC;
};

const formatNumberToTwoDigits = (number: number) => {
  if (!number) return "00";
  if (number < 10) return "0" + number;
  return number;
};

export const formatTimeType = (
  time: string | Date | any,
  isGetTime?: boolean
) => {
  if (!time) return "_";
  const dateTime = typeof time === "string" ? new Date(time) : time;
  if (!dateTime) return "_";
  const year = dateTime.getFullYear();
  const month = formatNumberToTwoDigits(dateTime.getMonth() + 1);
  const date = formatNumberToTwoDigits(dateTime.getDate());
  const hour = formatNumberToTwoDigits(dateTime.getHours());
  const minute = formatNumberToTwoDigits(dateTime.getMinutes());
  const second = formatNumberToTwoDigits(dateTime.getSeconds());
  let timeReturn = year + "/" + month + "/" + date;
  timeReturn = isGetTime
    ? timeReturn + " " + hour + ":" + minute + ":" + second
    : timeReturn;
  return timeReturn;
};

export const formatTimeUTCString = (date: string | Date | any) => {
  if (!date) return "";
  const dateTime = typeof date === "string" ? new Date(date) : date;
  const yearGet = formatNumberToTwoDigits(dateTime.getUTCFullYear());
  const monthGet = formatNumberToTwoDigits(dateTime.getUTCMonth() + 1);
  const dateGet = formatNumberToTwoDigits(dateTime.getUTCDate());
  const hourGet = formatNumberToTwoDigits(dateTime.getUTCHours());
  const minuteGet = formatNumberToTwoDigits(dateTime.getUTCMinutes());
  const secondGet = formatNumberToTwoDigits(dateTime.getUTCSeconds());
  return (
    yearGet +
    "/" +
    monthGet +
    "/" +
    dateGet +
    " " +
    hourGet +
    ":" +
    minuteGet +
    ":" +
    secondGet
  );
};

export const getDatetimeBySelectDateRange = (key: string, date: Date) => {
  switch (key) {
    case dateRangeType.SEVENDAY:
      return new Date(date.setDate(date.getDate() + 7));
    case dateRangeType.FIFTEENDAY:
      return new Date(date.setDate(date.getDate() + 15));
    case dateRangeType.ONEMONTH:
      return new Date(date.setMonth(date.getMonth() + 1));
    case dateRangeType.TWOMONTH:
      return new Date(date.setMonth(date.getMonth() + 2));
    case dateRangeType.SIXMONTH:
      return new Date(date.setMonth(date.getMonth() + 6));
  }
};

export const getExpirationTimeOffer = (time: number) => {
  const currentTime = new Date().getTime() / 1000;
  const diffTime = time - currentTime;
  if (diffTime < 0) return "--";
  const day = Number.parseInt((diffTime / 86400)?.toString());
  if (day > 0) return day > 1 ? `${day} days` : `${day} day`;
  const hour = Number.parseInt((diffTime / 3600)?.toString());
  if (hour > 0) return hour > 1 ? `${hour} hours` : `${hour} hour`;
  const minute = Number.parseInt((diffTime / 60)?.toString());
  return minute > 1 ? `${minute} minutes` : `${minute} minute`;
};
