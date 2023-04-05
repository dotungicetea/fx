import { axiosGet } from "./utils";

export const getNftDetail = async (id: number) => {
  return axiosGet(`nft/${id}`);
};
