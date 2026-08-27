/**
 * Intentionally naive text search (spec 11): lowercase, accent-insensitive
 * substring matching over a few fields. No fuzzy library, no ranking engine.
 *
 * `searchKeywords` carries precise disease names so a user can type
 * "fibromyalgie" even though the filters only expose broad disorder types.
 */

import { label } from "./data";
import type { Resource } from "./types";

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .trim();
}

/** Everything a query can match on, as one normalized string. */
function haystack(resource: Resource): string {
  const parts: string[] = [
    resource.title,
    resource.shortDescription,
    ...resource.themes,
    ...resource.searchKeywords,
    label("resourceTypes", resource.resourceType),
  ];

  if (resource.professional) {
    const p = resource.professional;
    parts.push(p.city, label("countries", p.country), label("professionalFamilies", p.family));
    parts.push(...p.specialties.map((s) => s.label));
  }

  if (resource.culturalContent) {
    const c = resource.culturalContent;
    parts.push(...c.authors, c.mainTheme, label("mediaFormats", c.format), label("mediaGenres", c.genre));
  }

  if (resource.place) {
    const s = resource.place;
    parts.push(s.city ?? "", label("supportCategories", s.category), label("institutionCategories", s.category));
  }

  return normalize(parts.join(" "));
}

export function searchResources(list: Resource[], query: string): Resource[] {
  const q = normalize(query);
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list.filter((resource) => {
    const text = haystack(resource);
    return terms.every((term) => text.includes(term));
  });
}

export function matchesTitle(resource: Resource, query: string): boolean {
  const q = normalize(query);
  return q.length > 0 && normalize(resource.title).includes(q);
}
