import axios from "axios";
const api_endpoint = process?.env?.NEXT_PUBLIC_API;

export const axiosJsonType = axios.create({
  baseURL: `${api_endpoint}/api/v1/`,
  headers: { "Content-Type": "application/json" },
});
