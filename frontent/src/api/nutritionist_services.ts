import type { GroupedNutritionistService, PaginationData } from "../types";
import apiClient from "./apiClient";
import i18n from "../i18n";

export type GetNutritionistServicesResponse = {
  nutritionists: GroupedNutritionistService[];
  pagination: PaginationData;
};

export async function getNutritionistServices(
  searchQuery?: string,
  location?: string,
  page?: number,
  perPage?: number,
): Promise<GetNutritionistServicesResponse> {
  const queryParams: string[] = [];
  let url = "/nutritionist_services";

  if (searchQuery) {
    queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  }

  if (location) {
    queryParams.push(`location=${encodeURIComponent(location)}`);
  }

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (perPage) {
    queryParams.push(`per_page=${perPage}`);
  }

  queryParams.push(`locale=${i18n.language}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const response = await apiClient.get(url);
  return response.data;
}
