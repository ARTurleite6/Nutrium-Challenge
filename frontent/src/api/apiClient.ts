import { API_URL, DEFAULT_HEADERS } from "./config";
import axios from "axios";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
});

export default apiClient;
