/**
 * Single entry point to the static JSON data.
 * No fetch, no API: the prototype ships its dataset.
 */

import resourcesJson from "@/data/resources.json";
import taxonomyJson from "@/data/taxonomy.json";
import type { Resource, ResourceType, Taxonomy, TaxonomyItem, TaxonomyKey } from "./types";

export const resources = resourcesJson as Resource[];
export const taxonomy = taxonomyJson as Taxonomy;

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getTaxonomy(key: TaxonomyKey): TaxonomyItem[] {
  return taxonomy[key] ?? [];
}

/** French label for a taxonomy id, falling back to the raw id. */
export function label(key: TaxonomyKey, id: string | undefined | null): string {
  if (!id) return "";
  return getTaxonomy(key).find((item) => item.id === id)?.label ?? id;
}

export function labels(key: TaxonomyKey, ids: string[] = []): string[] {
  return ids.map((id) => label(key, id));
}

export function typeLabel(type: ResourceType): string {
  return label("resourceTypes", type);
}

/** Compact label for tabs, falling back to the full label. */
export function typeTabLabel(type: ResourceType): string {
  const item = getTaxonomy("resourceTypes").find((entry) => entry.id === type);
  return item?.shortLabel ?? item?.label ?? type;
}

/**
 * The 2 to 4 metadata chips shown on a result card.
 * One function so the client can rework card density in a single place.
 */
export function getCardMeta(resource: Resource): string[] {
  const meta: string[] = [];

  if (resource.professional) {
    const { country, city, consultationModes, family } = resource.professional;
    meta.push(`${city}, ${label("countries", country)}`);
    meta.push(...labels("consultationModes", consultationModes).slice(0, 1));
    meta.push(label("professionalFamilies", family));
  }

  if (resource.culturalContent) {
    meta.push(label("mediaFormats", resource.culturalContent.format));
    meta.push(label("mediaGenres", resource.culturalContent.genre));
  }

  if (resource.place) {
    const { category, deliveryMode, city } = resource.place;
    meta.push(label(resource.resourceType === "institution_partner" ? "institutionCategories" : "supportCategories", category));
    meta.push(label("deliveryModes", deliveryMode));
    if (city) meta.push(city);
  }

  meta.push(label("pricing", resource.pricing));

  // Deduplicate: two dimensions can carry the same label
  // (a documentary has format "Documentaire" and genre "Documentaire").
  return [...new Set(meta.filter(Boolean))].slice(0, 4);
}

/**
 * "Sophie Aebi et cie" - display rule from the brief. The flag drives the
 * rendering: the data may list only the first author of a collective work.
 */
export function formatAuthors(authors: string[], hasMultipleAuthors: boolean): string {
  if (authors.length === 0) return "";
  if (hasMultipleAuthors) return `${authors[0]} et cie`;
  return authors.join(" et ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
