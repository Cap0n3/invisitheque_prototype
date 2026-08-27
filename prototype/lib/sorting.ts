/**
 * Sorting (spec 12). The relevance model is deliberately transparent so the
 * client can see *why* a resource climbs: weights live in config.PRIORITY_BONUSES.
 */

import { PRIORITY_BONUSES } from "./config";
import { matchesTitle } from "./search";
import type { Resource, SortMode } from "./types";

export interface RelevanceBreakdown {
  score: number;
  reasons: string[];
}

export function getRelevance(resource: Resource, query = ""): RelevanceBreakdown {
  let score = resource.baseRelevance;
  const reasons: string[] = [];

  if (resource.hasUpcomingAssociationEvent) {
    score += PRIORITY_BONUSES.upcomingAssociationEvent;
    reasons.push("Cercle mieux-être à venir");
  }
  if (resource.isAssociationPartner) {
    score += PRIORITY_BONUSES.associationPartner;
    reasons.push("Partenaire des Invisibles");
  }
  if (resource.isFeatured) {
    score += PRIORITY_BONUSES.featured;
    reasons.push("Sélection de l’association");
  }
  if (matchesTitle(resource, query)) {
    score += PRIORITY_BONUSES.titleMatch;
    reasons.push("Correspond au titre");
  }

  return { score, reasons };
}

export function sortResources(list: Resource[], mode: SortMode, query = ""): Resource[] {
  const sorted = [...list];

  switch (mode) {
    case "newest":
      sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      break;
    case "reviews":
      // Reviews belong to phase E3; the data here is fake on purpose.
      sorted.sort(
        (a, b) =>
          (b.ratingAverage ?? 0) - (a.ratingAverage ?? 0) || b.reviewCount - a.reviewCount,
      );
      break;
    case "relevance":
    default:
      sorted.sort(
        (a, b) =>
          getRelevance(b, query).score - getRelevance(a, query).score ||
          a.title.localeCompare(b.title, "fr"),
      );
      break;
  }

  return sorted;
}

/**
 * Why a resource is highlighted on the home page ("À la une").
 * null = nothing special. The result grid itself stays uniform.
 */
export function getHighlightReason(resource: Resource): string | null {
  if (resource.hasUpcomingAssociationEvent) return "Cercle mieux-être à venir";
  if (resource.isAssociationPartner) return "Partenaire des Invisibles";
  if (resource.isFeatured) return "Sélection de l’association";
  return null;
}
