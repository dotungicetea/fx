import { nftActivity } from "./nav";

export const marketActivityFilter = [
  {
    title: "All",
    value: "",
  },
  {
    title: "Buy",
    value: nftActivity?.BUY,
  },
  {
    title: "Listing",
    value: nftActivity?.LISTING,
  },
  {
    title: "Accept Offer",
    value: nftActivity?.TAKE_OFFER,
  },
  {
    title: "Create Offer",
    value: nftActivity?.OFFER,
  },
];

export const activityView: { [value: string]: any } = {
  [nftActivity?.BUY]: {
    title: nftActivity?.BUY,
    icon: "sell_dark.svg",
    color: "#0A1E42",
  },
  [nftActivity?.LISTING]: {
    title: nftActivity?.LISTING,
    icon: "listing_dark.svg",
    color: "#0A1E42",
  },
  [nftActivity?.CANCEL_LISTING]: {
    title: nftActivity?.CANCEL_LISTING,
    icon: "cross_x_red.svg",
    color: "#EA5D5D",
  },
  [nftActivity?.CANCEL_OFFER]: {
    title: nftActivity?.CANCEL_OFFER,
    icon: "cross_x_red.svg",
    color: "#EA5D5D",
  },
  [nftActivity?.OFFER]: {
    title: "Create Offer",
    icon: "offers_dark.svg",
    color: "#0A1E42",
  },
  [nftActivity?.TAKE_OFFER]: {
    title: nftActivity?.TAKE_OFFER,
    icon: "icon_success_normal.svg",
    color: "#30A666",
  },
};
