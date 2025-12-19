import axios from "axios";

const apiKey = process.env.API_KEY as string;
const token = process.env.TOKEN;

export const professionalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROFESSIONAL_API,
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${token}`,
    'apiKey': apiKey
  }
})