/**
 * Faceted filtering.
 *
 * Semantics (spec 10):
 *   - between two dimensions  : AND
 *   - inside one dimension    : OR
 *
 * Both rules live in `matches()` so they can be changed in one place.
 */

import { FILTER_LAYOUT, RELAX_ORDER } from "./config";
import type { FilterState, MultiFilterKey, Resource, ResourceType } from "./types";

export const EMPTY_FILTERS: FilterState = {
  resourceType: null,
  objectives: [],
  disorderCategories: [],
  pricing: [],
  verifiedOnly: false,
  partnersOnly: false,
  countries: [],
  consultationModes: [],
  professionalFamilies: [],
  specialties: [],
  mediaFormats: [],
  mediaGenres: [],
  pointsOfView: [],
  supportCategories: [],
  institutionCategories: [],
  deliveryModes: [],
};

/**
 * For each filter dimension, the values carried by a resource.
 * Adding a filter = adding one line here plus one entry in FILTER_GROUPS.
 */
const ACCESSORS: Record<MultiFilterKey, (r: Resource) => string[]> = {
  objectives: (r) => r.objectives,
  disorderCategories: (r) => r.disorderCategories,
  // "offre_adherents" is a pseudo-value of the Tarif group: any resource
  // carrying an adherent discount answers to it, on top of its real pricing.
  pricing: (r) => (r.professional?.discount ? [r.pricing, "offre_adherents"] : [r.pricing]),
  countries: (r) => [r.professional?.country, r.place?.country].filter(Boolean) as string[],
  consultationModes: (r) => r.professional?.consultationModes ?? [],
  professionalFamilies: (r) => (r.professional ? [r.professional.family] : []),
  specialties: (r) => r.professional?.specialties.map((s) => s.id) ?? [],
  mediaFormats: (r) => (r.culturalContent ? [r.culturalContent.format] : []),
  mediaGenres: (r) => (r.culturalContent ? [r.culturalContent.genre] : []),
  pointsOfView: (r) => (r.culturalContent ? [r.culturalContent.pointOfView] : []),
  supportCategories: (r) => (r.place ? [r.place.category] : []),
  institutionCategories: (r) => (r.place ? [r.place.category] : []),
  deliveryModes: (r) => (r.place ? [r.place.deliveryMode] : []),
};

export const MULTI_FILTER_KEYS = Object.keys(ACCESSORS) as MultiFilterKey[];

/**
 * A resource tagged "tous_troubles" answers any disorder filter.
 * Same idea the other way round: filtering on "tous_troubles" keeps everything.
 */
function matchesDisorders(resource: Resource, selected: string[]): boolean {
  if (selected.length === 0) return true;
  if (selected.includes("tous_troubles")) return true;
  if (resource.disorderCategories.includes("tous_troubles")) return true;
  return selected.some((value) => resource.disorderCategories.includes(value));
}

function matchesDimension(resource: Resource, key: MultiFilterKey, selected: string[]): boolean {
  if (selected.length === 0) return true;
  if (key === "disorderCategories") return matchesDisorders(resource, selected);
  const values = ACCESSORS[key](resource);
  return selected.some((value) => values.includes(value)); // OR inside a dimension
}

export function matches(resource: Resource, filters: FilterState): boolean {
  if (filters.resourceType && resource.resourceType !== filters.resourceType) return false;
  if (filters.verifiedOnly && !resource.isVerifiedByAssociation) return false;
  if (filters.partnersOnly && !resource.isAssociationPartner) return false;

  // AND between dimensions.
  return MULTI_FILTER_KEYS.every((key) => matchesDimension(resource, key, filters[key]));
}

export function filterResources(list: Resource[], filters: FilterState): Resource[] {
  return list.filter((resource) => matches(resource, filters));
}

/** Counts everything shown as a removable chip, resource type included. */
export function countActiveFilters(filters: FilterState): number {
  const multi = MULTI_FILTER_KEYS.reduce((total, key) => total + filters[key].length, 0);
  return (
    multi +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.partnersOnly ? 1 : 0) +
    (filters.resourceType ? 1 : 0)
  );
}

/**
 * "Ressources susceptibles de vous aider": drop the most restrictive dimensions
 * one by one until something comes back. Deliberately not clever (spec 18).
 */
export function getRelaxedSuggestions(
  list: Resource[],
  filters: FilterState,
): { resources: Resource[]; relaxedKeys: MultiFilterKey[] } {
  let relaxed: FilterState = { ...filters };
  const relaxedKeys: MultiFilterKey[] = [];

  for (const key of RELAX_ORDER) {
    if (relaxed[key].length === 0) continue;
    relaxed = { ...relaxed, [key]: [] };
    relaxedKeys.push(key);

    const found = filterResources(list, relaxed);
    if (found.length > 0) return { resources: found, relaxedKeys };
  }

  // Last resort: keep only the resource type.
  const typeOnly = list.filter(
    (r) => !filters.resourceType || r.resourceType === filters.resourceType,
  );
  return { resources: typeOnly, relaxedKeys };
}

/**
 * A filter is relevant for a resource type when the UI offers it for that type.
 * FILTER_LAYOUT is the single source of truth, so showing and pruning can never
 * disagree.
 */
export function isFilterRelevant(key: MultiFilterKey, type: ResourceType | null): boolean {
  const layout = FILTER_LAYOUT[type ?? "all"];
  return layout.primary.includes(key) || layout.advanced.includes(key);
}

/**
 * When the resource type changes, keep compatible filters and clear the rest.
 */
export function pruneIrrelevantFilters(filters: FilterState): FilterState {
  const next = { ...filters };
  for (const key of MULTI_FILTER_KEYS) {
    if (!isFilterRelevant(key, filters.resourceType)) next[key] = [];
  }
  return next;
}
