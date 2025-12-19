import axios from "axios";

export const professionalApi = axios.create({
  baseURL: process.env.PROFESSIONAL_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
})

professionalApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.TOKEN}`;
  config.headers.apiKey = process.env.API_KEY as string;
  return config
})