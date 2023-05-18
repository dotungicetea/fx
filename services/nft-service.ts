import { axiosGet } from "./utils";

export const getNftDetail = async (id: number | string) => {
  return axiosGet(`nft/${id}`);
};
