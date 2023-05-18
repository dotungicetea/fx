import {
  ServiceCreateOrderType,
  ServiceCancelOrderType,
  ServiceNFTMarketDetailType,
  ServiceGetNftMarketType,
  ServiceFullFillOrderType,
  ServiceMarketLogType,
  ServiceOffersListType,
} from "@/types/service";
import { axiosPost } from "./utils";

export const createOrderApi = async (data: ServiceCreateOrderType) => {
  return axiosPost("market/order/create", data);
};

export const getNftMarketDetail = async (data: ServiceNFTMarketDetailType) => {
  return axiosPost(`market/item`, data);
};

export const cancelOrder = async (data: ServiceCancelOrderType) => {
  return axiosPost(`market/order/cancel`, data);
};

export const getNftInMarketplace = async (data: ServiceGetNftMarketType) => {
  return axiosPost(`market/order/list`, data);
};

export const fullfillOrder = async (data: ServiceFullFillOrderType) => {
  return axiosPost(`market/order/fullfill`, data);
};

export const getMarketLog = async (data: ServiceMarketLogType) => {
  return axiosPost(`market/logs`, data);
};

export const getOffersList = async (data: ServiceOffersListType) => {
  return axiosPost(`market/offers`, data);
};
