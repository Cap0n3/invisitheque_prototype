/**
 * Prototype data model.
 *
 * Storage is JSON, but the SHAPE is meant to be close to the future domain
 * (see spec section 44). Ids are stable and implementation-friendly, French
 * labels live in data/taxonomy.json only.
 */

/** The five resource categories validated by the client (October 2026 feedback). */
export type ResourceType =
  | "professional"
  | "cultural_content"
  | "practical_tool"
  | "activity_support"
  | "organization_place";

export type Pricing = "free" | "paid" | "mixed";
/** "other" = international resource, no single country (client: « Autre »). */
export type Country = "CH" | "FR" | "BE" | "CA" | "other";
export type ConsultationMode = "in_person" | "remote" | "hybrid";
export type DeliveryMode = "in_person" | "digital" | "hybrid";

export interface Specialty {
  id: string;
  label: string;
  description: string;
}

export interface ProfessionalDetails {
  firstName: string;
  lastName: string;
  country: Country;
  city: string;
  consultationModes: ConsultationMode[];
  specialties: Specialty[];
  /** « Thématiques abordées » - ids from taxonomy.professionalTopics. */
  topics: string[];
  presentation: string;
  /** Video interview recorded by the association, shown in « Éléments complémentaires ». */
  interviewUrl?: string;
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
  /** Produced by Les Invisibles - drives the « Uniquement les contenus créés par
   *  Les Invisibles » checkbox. Distinct from pointOfView "association", which
   *  any association can carry. */
  createdByAssociation: boolean;
  format: string;
  genre: string;
  pointOfView: string;
  mainTheme: string;
  description: string;
  proposerOpinion: string;
  links: Array<{ label: string; url: string }>;
}

/**
 * Shared by « Organisations et lieux » and « Activités et accompagnements ».
 * The category fields say what the record is: an organisation, a physical place
 * (possibly both - an association running a respite house), or an activity.
 */
export interface PlaceDetails {
  /** taxonomy.institutionCategories - organisations. */
  organizationType?: string;
  /** taxonomy.placeCategories - physical, non-medical places. */
  placeType?: string;
  /** taxonomy.activityCategories - activities and support services. */
  activityType?: string;
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
  /** Optional grouping (unused today, kept for the production taxonomy_term.parent). */
  parent?: string;
}

export type TaxonomyKey =
  | "resourceTypes"
  | "objectives"
  | "disorderCategories"
  | "pricing"
  | "specialties"
  | "professionalTopics"
  | "countries"
  | "consultationModes"
  | "mediaFormats"
  | "mediaGenres"
  | "pointsOfView"
  | "institutionCategories"
  | "placeCategories"
  | "activityCategories"
  | "deliveryModes";

export type Taxonomy = Record<TaxonomyKey, TaxonomyItem[]>;

/** Every multi-select filter dimension, plus the single-choice resource type. */
export interface FilterState {
  resourceType: ResourceType | null;

  // Global dimensions.
  objectives: string[];
  disorderCategories: string[];
  pricing: string[];
  partnersOnly: boolean;
  /** « Uniquement les contenus créés par Les Invisibles » (Contenus et médias only). */
  associationContentOnly: boolean;

  // Professionals (countries is shared with places and activities).
  countries: string[];
  consultationModes: string[];
  specialties: string[];

  // Cultural content / practical tools.
  mediaFormats: string[];
  mediaGenres: string[];
  pointsOfView: string[];

  // Organisations and places / activities and support services.
  institutionCategories: string[];
  placeCategories: string[];
  activityCategories: string[];
  deliveryModes: string[];
}

/** Keys of FilterState that hold a string[] - i.e. every multi-select group. */
export type MultiFilterKey = {
  [K in keyof FilterState]: FilterState[K] extends string[] ? K : never;
}[keyof FilterState];

export type SortMode = "relevance" | "newest" | "reviews";
