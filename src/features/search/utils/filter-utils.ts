// features/search/utils/filter-utils.ts
import { FILTER_MAPPING } from "../constants";
import { SearchFilters } from "../types";

export const buildFilterQuery = (
  filters: SearchFilters,
  currentParams: string,
) => {
  const params = new URLSearchParams(currentParams);

  Object.entries(filters).forEach(([key, val]) => {
    const urlKey = FILTER_MAPPING[key as keyof SearchFilters];
    val ? params.set(urlKey, val) : params.delete(urlKey);
  });

  return params.toString();
};
