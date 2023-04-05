import { axiosPost } from "./utils";

export const userRegister = async (data: any) => {
  return axiosPost("user/register", data);
};
