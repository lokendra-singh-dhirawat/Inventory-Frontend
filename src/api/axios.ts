import axios from "axios";

const URL = process.env.REACT_APP_API_URL;
const apiClient = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorrage.getItem("accessToken");
});
