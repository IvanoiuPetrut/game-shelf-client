import axios from "axios";
import { API_URL } from "@/api";

export default () => {
  return axios.create({
    baseURL: API_URL,
  });
};
