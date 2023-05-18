export const hiddenLongText = (
  text: string | undefined | null,
  numberTextShow?: number
) => {
  if (!text) return "";
  const numbTextShow = numberTextShow ? numberTextShow : 4;
  if (2 * numbTextShow >= text.length) return text;
  const before = text.substring(0, 6);
  const after = text.substring(
    text?.length - (numbTextShow ? numbTextShow : 3),
    text?.length
  );
  return before + "..." + after;
};

export const getBoxesText = (numberBox: number | any) => {
  if (!numberBox) return "0 box";
  if (numberBox <= 1) return `${numberBox} box`;
  return `${getNumberFormatUs(numberBox)} boxes`;
};

export const getNumberFormatUs = (
  number: number | string | undefined | null
) => {
  if (!number) return "0";
  if (typeof number === "string")
    return Number(number)?.toLocaleString("en-US");
  return number?.toLocaleString("en-US");
};

export const convertStringToJson = (text: string) => {
  if (!text) return null;
  return JSON.parse(text);
};

export const convertJsonToString = (param: any) => {
  if (!param) return "";
  return JSON.stringify(param);
};

export const formatNumberFloatFix = (number: any, fix: number) => {
  if (!number) return "0";
  const numberTypeNumber = typeof number === "number" ? number : Number(number);
  const numberFixed = numberTypeNumber.toFixed(fix);
  return numberFixed.replace(
    /[.,]0$|[.,]00$|[.,]000$|[.,]0000$|0$|00$|000$|0000$/,
    ""
  );
};
