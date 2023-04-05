import { axiosGet, axiosPost } from "./utils";

export const getBoxList = async (data: any) => {
  return axiosPost("nft/box-list", data);
};

export const getBoxNum = async (data: any) => {
  return axiosPost("nft/box-num", data);
};

export const openBox = async (data: any) => {
  return axiosPost("nft/open-box", data);
};

export const getNftList = async (data: any) => {
  return axiosPost("nft/list", data);
};

export const getTotalBoxList = async () => {
  return axiosGet("nft/box-total");
};
