import axios from "axios";
export const API_ENDPOINT = process?.env?.NEXT_PUBLIC_API as string;

export const axiosPost = (api: string, data: any) => {
  return axios.post(`${API_ENDPOINT}/api/v1/${api}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const axiosGet = (api: string) => {
  return axios.get(`${API_ENDPOINT}/api/v1/${api}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getMediaUrl = (api: string) => {
  return `${API_ENDPOINT}/api/v1/media/${api}`;
};
