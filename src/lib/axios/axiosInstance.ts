import { BASE_API_URL } from "@/utils/secrets";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${BASE_API_URL}`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    }

    throw error;
  },
);

export default axiosInstance;
