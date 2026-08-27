/**
 * Prototype data model.
 *
 * Storage is JSON, but the SHAPE is meant to be close to the future domain
 * (see spec section 44). Ids are stable and implementation-friendly, French
 * labels live in data/taxonomy.json only.
 */

export type ResourceType =
  | "professional"
  | "cultural_content"
  | "support_space"
  | "institution_partner"
  // Candidate types (spec 9.1) - to arbitrate with the client.
  | "practical_tool"
  | "program_training";

export type Pricing = "free" | "paid" | "mixed";
export type Country = "CH" | "FR" | "BE" | "CA";
export type ConsultationMode = "in_person" | "remote" | "hybrid";
export type DeliveryMode = "in_person" | "digital" | "hybrid";
export type ProfessionalFamily =
  | "coaching_developpement"
  | "therapies_psy"
  | "bien_etre_corporel";

export interface Specialty {
  id: string;
  label: string;
  description: string;
}

export interface ProfessionalDetails {
  firstName: string;
  lastName: string;
  family: ProfessionalFamily;
  country: Country;
  city: string;
  consultationModes: ConsultationMode[];
  specialties: Specialty[];
  presentation: string;
  contact: {
    website?: string;
    bookingUrl?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: Record<string, string>;
  /** "Offre adhérent·es de l'asso" - member benefit shown as a macaron. */
  discount?: {
    percentage: number;
    description: string;
  };
  upcomingAssociationEvent?: {
    title: string;
    date: string;
  };
}

export interface CulturalContentDetails {
  authors: string[];
  /** Renders "<first author> et cie" in the UI (brief rule). */
  hasMultipleAuthors: boolean;
  format: string;
  genre: string;
  pointOfView: string;
  mainTheme: string;
  description: string;
  proposerOpinion: string;
  links: Array<{ label: string; url: string }>;
}

/** Shared by support spaces, institutions/partners and program/training records. */
export interface PlaceDetails {
  category: string;
  deliveryMode: DeliveryMode;
  country?: Country;
  city?: string;
  presentation: string;
  whyItHelps: string;
  website?: string;
  socialLinks?: Record<string, string>;
}

export interface Resource {
  id: string;
  slug: string;
  resourceType: ResourceType;

  title: string;
  shortDescription: string;
  /** null = neutral CSS placeholder (no real photos in the prototype). */
  image: string | null;

  objectives: string[];
  /** "tous_troubles" means: applies to every disorder. */
  disorderCategories: string[];
  themes: string[];
  /** Precise disease names - search only, never a filter (spec 11.1). */
  searchKeywords: string[];
  pricing: Pricing;

  isFeatured: boolean;
  isVerifiedByAssociation: boolean;
  recommendedBy: string | null;
  isAssociationPartner: boolean;
  hasUpcomingAssociationEvent: boolean;

  baseRelevance: number;
  publishedAt: string;

  // Fake E3 metrics.
  ratingAverage: number | null;
  reviewCount: number;

  externalUrl: string;

  professional?: ProfessionalDetails;
  culturalContent?: CulturalContentDetails;
  place?: PlaceDetails;
}

export interface TaxonomyItem {
  id: string;
  label: string;
  /** Compact label, used where space is tight (tabs). */
  shortLabel?: string;
  /** Optional grouping, e.g. specialties nested under a professional family. */
  parent?: string;
}

export type TaxonomyKey =
  | "resourceTypes"
  | "objectives"
  | "disorderCategories"
  | "pricing"
  | "professionalFamilies"
  | "specialties"
  | "countries"
  | "consultationModes"
  | "mediaFormats"
  | "mediaGenres"
  | "pointsOfView"
  | "supportCategories"
  | "institutionCategories"
  | "deliveryModes";

export type Taxonomy = Record<TaxonomyKey, TaxonomyItem[]>;

/** Every multi-select filter dimension, plus the single-choice resource type. */
export interface FilterState {
  resourceType: ResourceType | null;

  // Global dimensions.
  objectives: string[];
  disorderCategories: string[];
  pricing: string[];
  verifiedOnly: boolean;

  // Professionals.
  countries: string[];
  consultationModes: string[];
  professionalFamilies: string[];
  specialties: string[];

  // Cultural content / practical tools.
  mediaFormats: string[];
  mediaGenres: string[];
  pointsOfView: string[];

  // Support spaces / programs / institutions.
  supportCategories: string[];
  institutionCategories: string[];
  deliveryModes: string[];
}

/** Keys of FilterState that hold a string[] - i.e. every multi-select group. */
export type MultiFilterKey = {
  [K in keyof FilterState]: FilterState[K] extends string[] ? K : never;
}[keyof FilterState];

export type SortMode = "relevance" | "newest" | "reviews";
