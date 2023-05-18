import { statusValues } from "./my-account";

export const maxUint256 = 115792089237316200000000000000000000000000000000000000000000;

export const sizes = {
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
};

export const cardSize: { [key: string]: any } = {
  sm: {
    width: 120,
    height: 180,
    imgWidth: 88,
    imgHeight: 88,
    symbolSize: 14,
    symbolLineHeight: 19,
    priceIconSize: 12,
    priceSize: 10,
  },
  md: {
    width: 164,
    height: 250,
    imgWidth: 140,
    imgHeight: 140,
    symbolSize: 18,
    symbolLineHeight: 25,
    priceIconSize: 16,
    priceSize: 12,
  },
  lg: {
    width: 240,
    height: 360,
    imgWidth: 220,
    imgHeight: 220,
    symbolSize: 24,
    symbolLineHeight: 33,
    priceIconSize: 16,
    priceSize: 16,
  },
};

export const serviceFee = 3;

export const orderStatus = {
  FULLFILL: "OrderFulfilled",
  CANCEL: "OrderCancelled",
  CREATE: "OrderCreated",
};

export const filterOrderStatus: { [key: string]: any } = {
  [orderStatus?.FULLFILL]: statusValues?.UNLISTED,
  [orderStatus?.CANCEL]: statusValues?.UNLISTED,
  [orderStatus?.CREATE]: statusValues?.LISTING,
};

export const defaultCurrencyType = [
  {
    name: "US Dollar",
    value: "USD",
  },
  {
    name: "EURO",
    value: "EUR",
  },
  {
    name: "Chinese Yuan",
    value: "CNY",
  },
  {
    name: "Vietnamese Dong",
    value: "VND",
  },
  {
    name: "Indian Rupee",
    value: "INR",
  },
  {
    name: "Malaysian ringgit",
    value: "MYR",
  },
  {
    name: "Singapore dollar",
    value: "SGD",
  },
  {
    name: "Ukrainian Hryvnia",
    value: "UAH",
  },
  {
    name: "Philippine Peso",
    value: "PHP",
  },
  {
    name: "Indonesian Rupiah",
    value: "IDR",
  },
  {
    name: "South African Rand",
    value: "ZAR",
  },
  {
    name: "Russian ruble",
    value: "RUR",
  },
  {
    name: "Swedish Krona",
    value: "SEK",
  },
  {
    name: "UAE Dirham",
    value: "AED",
  },
  {
    name: "Brazilian Real",
    value: "BRL",
  },
];
