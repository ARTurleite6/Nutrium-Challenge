import { API_URL, DEFAULT_HEADERS } from "./config";
import redaxios from "redaxios";

const apiClient = redaxios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
});

export default apiClient;
