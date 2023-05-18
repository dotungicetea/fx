import { DefaultAuthServiceType } from "@/types/service";
import { axiosPost } from "./utils";

export const userRegister = async (data: DefaultAuthServiceType) => {
  return axiosPost("user/register", data);
};
