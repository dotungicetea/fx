import { convertDecimalToNum } from "./network";

export const getDifferenceBelow = (
  currentPrice: number | null | undefined | any,
  offerPrice: number | null | undefined | string,
  subTextBelow?: string,
  subTextAbove?: string
) => {
  if (!currentPrice || !offerPrice) return "--";
  const offerPriceNumb =
    typeof offerPrice === "number"
      ? offerPrice
      : convertDecimalToNum(offerPrice);
  const difference = ((currentPrice - offerPriceNumb) / currentPrice) * 100;
  const differenceRound = Math.round(difference);
  const differenceNumb =
    differenceRound >= 0 ? differenceRound : differenceRound * -1;
  const subText =
    subTextBelow && subTextAbove
      ? differenceRound >= 0
        ? subTextBelow
        : subTextAbove
      : "";
  return subText ? `${differenceNumb}` + subText : `${differenceNumb}`;
};

export const getFrom = (myAddress: string | undefined, offerer: string) => {
  if (!offerer || !myAddress) return "--";
  if (myAddress === offerer) return "you";
  const subString = offerer.substring(offerer?.length - 4, offerer?.length);
  return subString;
};

export const validGetFrom = (value: string) => {
  if (value === "you" || value === "--") return true;
  return false;
};

export const getCurrentPrice = (orderListing: any) => {
  if (
    !orderListing ||
    !orderListing?.order_parameters_obj ||
    !orderListing?.order_parameters_obj?.consideration ||
    !orderListing?.order_parameters_obj?.consideration?.length
  )
    return null;
  let price = 0;
  orderListing?.order_parameters_obj?.consideration?.forEach((value: any) => {
    price += convertDecimalToNum(value?.startAmount);
  });
  return price;
};
