import {
  Banknote,
  BookOpen,
  Building2,
  Eye,
  MapPin,
  Monitor,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { consultationModesText, label, placeCategoryLabels } from "@/lib/data";
import type { Resource } from "@/lib/types";

export interface HeroMeta {
  icon: LucideIcon;
  label: string;
}

/**
 * The chips under the title: where, how, what kind, how much.
 * Same spirit as getCardMeta, with icons and without the 4-item cap.
 */
export function getHeroMeta(resource: Resource): HeroMeta[] {
  const meta: HeroMeta[] = [];

  if (resource.professional) {
    const { city, country, consultationModes, specialties } = resource.professional;
    meta.push({ icon: MapPin, label: `${city}, ${label("countries", country)}` });
    meta.push({ icon: Monitor, label: consultationModesText(consultationModes) });
    // The brief caps a professional at 3 specialties.
    meta.push(...specialties.slice(0, 3).map((item) => ({ icon: Tag, label: item.label })));
  }

  if (resource.culturalContent) {
    const { format, genre, pointOfView } = resource.culturalContent;
    meta.push({ icon: BookOpen, label: label("mediaFormats", format) });
    meta.push({ icon: Tag, label: label("mediaGenres", genre) });
    meta.push({ icon: Eye, label: label("pointsOfView", pointOfView) });
  }

  if (resource.place) {
    const place = resource.place;
    const CategoryIcon = resource.resourceType === "activity_support" ? Users : Building2;
    meta.push(...placeCategoryLabels(place).map((item) => ({ icon: CategoryIcon, label: item })));
    meta.push({ icon: Monitor, label: label("deliveryModes", place.deliveryMode) });
    const where = [place.city, place.country ? label("countries", place.country) : ""]
      .filter(Boolean)
      .join(", ");
    if (where) meta.push({ icon: MapPin, label: where });
  }

  meta.push({ icon: Banknote, label: label("pricing", resource.pricing) });

  // Two dimensions can carry the same label (format and genre "Documentaire").
  const seen = new Set<string>();
  return meta.filter((item) => item.label && !seen.has(item.label) && seen.add(item.label));
}
