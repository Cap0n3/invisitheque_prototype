/**
 * Filter state <-> URL query string.
 * Keeps a workshop scenario shareable as a link (spec 41). Nothing fancy.
 *
 * Example: /search?q=fatigue&type=professional&countries=CH&consultationModes=remote
 */

import { TAB_TYPES } from "./config";
import { EMPTY_FILTERS, MULTI_FILTER_KEYS } from "./filters";
import type { FilterState, ResourceType, SortMode } from "./types";

export interface SearchUrlState {
  query: string;
  filters: FilterState;
  sort: SortMode;
}

const SORT_MODES: SortMode[] = ["relevance", "newest", "reviews"];

export function parseSearchParams(params: URLSearchParams): SearchUrlState {
  const filters: FilterState = { ...EMPTY_FILTERS };

  // Unknown values are dropped: a mistyped shared link must not crash the page.
  const type = params.get("type") as ResourceType | null;
  if (type && TAB_TYPES.includes(type)) filters.resourceType = type;

  for (const key of MULTI_FILTER_KEYS) {
    const raw = params.get(key);
    if (raw) filters[key] = raw.split(",").filter(Boolean);
  }

  filters.verifiedOnly = params.get("verified") === "1";

  const sort = params.get("sort");

  return {
    query: params.get("q") ?? "",
    filters,
    sort: SORT_MODES.includes(sort as SortMode) ? (sort as SortMode) : "relevance",
  };
}

export function buildSearchParams(state: SearchUrlState): string {
  const params = new URLSearchParams();

  if (state.query) params.set("q", state.query);
  if (state.filters.resourceType) params.set("type", state.filters.resourceType);

  for (const key of MULTI_FILTER_KEYS) {
    const values = state.filters[key];
    if (values.length > 0) params.set(key, values.join(","));
  }

  if (state.filters.verifiedOnly) params.set("verified", "1");
  if (state.sort !== "relevance") params.set("sort", state.sort);

  return params.toString();
}
