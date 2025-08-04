import type { NutritionistService } from "../types";
import apiClient from "./apiClient";

export async function getNutritionistServices(
  searchQuery?: string,
  location?: string,
): Promise<NutritionistService[]> {
  const queryParams: string[] = [];
  let url = "/nutritionist_services";

  if (searchQuery) {
    queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  }

  if (location) {
    queryParams.push(`location=${encodeURIComponent(location)}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const response = await apiClient.get(url);
  return response.data;
}
