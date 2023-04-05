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
  const hourSmall = hourGet < 10 ? "0" + hourGet : hourGet;
  const minuteSmall = minuteGet < 10 ? "0" + minuteGet : minuteGet;
  return (
    yearGet +
    "/" +
    monthGet +
    "/" +
    dateGet +
    " " +
    hourSmall +
    ":" +
    minuteSmall
  );
};

export const getUTCByString = (time: string) => {
  const timeConvert = new Date(time);
  const years = timeConvert.getUTCFullYear();
  const months = timeConvert.getUTCMonth();
  const days = timeConvert.getUTCDate();
  const hours = timeConvert.getUTCHours();
  const minutes = timeConvert.getUTCMinutes();
  const seconds = timeConvert.getUTCSeconds();
  const timeUTC = new Date(
    Date.UTC(years, months, days, hours, minutes, seconds)
  );
  return timeUTC;
};

export const formatTimestampToDate = (timestamp: number, plusTime?: number) => {
  if (!timestamp) return "_";
  const time = plusTime
    ? new Date((timestamp + plusTime) * 1000)
    : new Date(timestamp * 1000);
  if (!time) return "_";
  return formatTimeString(time);
};

export const formatTimestampToDateUTCString = (
  timestamp: number,
  plusTime?: number
) => {
  if (!timestamp) return "_";
  const time = plusTime
    ? new Date((timestamp + plusTime) * 1000)
    : new Date(timestamp * 1000);
  if (!time) return "_";
  const timeString = time.toString();
  const timeUTC = getUTCByString(timeString);
  return formatTimeString(timeUTC);
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
