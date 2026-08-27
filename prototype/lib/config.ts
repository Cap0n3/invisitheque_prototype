/**
 * Prototype decisions, gathered in one file.
 *
 * Everything the client is likely to challenge during the workshop lives here:
 * which filters are visible, what is primary vs "Plus de filtres", how the
 * priority bonuses are weighted, how many cards per page. Change it here, not
 * in the components.
 */

import type { MultiFilterKey, ResourceType, TaxonomyKey } from "./types";

/** Result cards revealed per "Charger plus" click. */
export const PAGE_SIZE = 6;

/**
 * Relevance bonuses. NOT a product requirement (spec 12.1): they only make the
 * idea of "priority" tangible during the demo.
 */
export const PRIORITY_BONUSES = {
  upcomingAssociationEvent: 20,
  associationPartner: 10,
  featured: 5,
  /** Added when the search query matches the title. */
  titleMatch: 15,
};

/** Resource types offered as tabs, in display order. */
export const TAB_TYPES: ResourceType[] = [
  "professional",
  "cultural_content",
  "support_space",
  "institution_partner",
  "practical_tool",
  "program_training",
];

/**
 * Candidate types (spec 9.1): present so the client can decide whether they
 * deserve their own tab, or belong under an existing type. Remove from
 * TAB_TYPES to demote them.
 */
export const CANDIDATE_TYPES: ResourceType[] = ["practical_tool", "program_training"];

export interface FilterGroupDef {
  key: MultiFilterKey;
  label: string;
  taxonomy: TaxonomyKey;
}

/** Every multi-select dimension. Labels are French, values come from taxonomy.json. */
export const FILTER_GROUPS: Record<MultiFilterKey, FilterGroupDef> = {
  objectives: { key: "objectives", label: "Objectif", taxonomy: "objectives" },
  disorderCategories: {
    key: "disorderCategories",
    label: "Type de trouble",
    taxonomy: "disorderCategories",
  },
  pricing: { key: "pricing", label: "Tarif", taxonomy: "pricing" },
  countries: { key: "countries", label: "Pays", taxonomy: "countries" },
  consultationModes: {
    key: "consultationModes",
    label: "Mode de consultation",
    taxonomy: "consultationModes",
  },
  professionalFamilies: {
    key: "professionalFamilies",
    label: "Famille d’accompagnement",
    taxonomy: "professionalFamilies",
  },
  specialties: { key: "specialties", label: "Spécialité", taxonomy: "specialties" },
  mediaFormats: { key: "mediaFormats", label: "Format", taxonomy: "mediaFormats" },
  mediaGenres: { key: "mediaGenres", label: "Genre", taxonomy: "mediaGenres" },
  pointsOfView: { key: "pointsOfView", label: "Point de vue", taxonomy: "pointsOfView" },
  supportCategories: {
    key: "supportCategories",
    label: "Type de dispositif",
    taxonomy: "supportCategories",
  },
  institutionCategories: {
    key: "institutionCategories",
    label: "Type d’organisation",
    taxonomy: "institutionCategories",
  },
  deliveryModes: { key: "deliveryModes", label: "Accès", taxonomy: "deliveryModes" },
};

/**
 * Which filters are shown, and where, depending on the selected resource type.
 *
 * - `primary`   : always visible;
 * - `advanced`  : behind the "Plus de filtres" disclosure.
 *
 * This split is exactly what the workshop has to arbitrate.
 */
const GLOBAL_PRIMARY: MultiFilterKey[] = ["objectives", "disorderCategories", "pricing"];

export const FILTER_LAYOUT: Record<
  ResourceType | "all",
  { primary: MultiFilterKey[]; advanced: MultiFilterKey[] }
> = {
  all: { primary: GLOBAL_PRIMARY, advanced: [] },
  professional: {
    primary: GLOBAL_PRIMARY,
    advanced: ["countries", "consultationModes", "professionalFamilies", "specialties"],
  },
  cultural_content: {
    primary: GLOBAL_PRIMARY,
    advanced: ["mediaFormats", "mediaGenres", "pointsOfView"],
  },
  practical_tool: {
    primary: GLOBAL_PRIMARY,
    advanced: ["mediaFormats", "mediaGenres", "pointsOfView"],
  },
  support_space: {
    primary: GLOBAL_PRIMARY,
    advanced: ["supportCategories", "deliveryModes"],
  },
  program_training: {
    primary: GLOBAL_PRIMARY,
    advanced: ["supportCategories", "deliveryModes"],
  },
  institution_partner: {
    primary: GLOBAL_PRIMARY,
    advanced: ["institutionCategories", "deliveryModes"],
  },
};

/**
 * Order in which filters are dropped to build "Ressources susceptibles de vous
 * aider" when nothing matches exactly. First entry is relaxed first.
 * Deliberately dumb (spec 18).
 */
export const RELAX_ORDER: MultiFilterKey[] = [
  "specialties",
  "pointsOfView",
  "mediaGenres",
  "consultationModes",
  "deliveryModes",
  "mediaFormats",
  "supportCategories",
  "institutionCategories",
  "professionalFamilies",
  "countries",
  "pricing",
  "disorderCategories",
  "objectives",
];

export const SORT_OPTIONS = [
  { id: "relevance", label: "Pertinence" },
  { id: "newest", label: "Nouveauté" },
  { id: "reviews", label: "Avis" },
] as const;
