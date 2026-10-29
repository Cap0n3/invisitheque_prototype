import { BookOpen, Building2, Users, UserRound, Wrench, type LucideIcon } from "lucide-react";
import type { ResourceType } from "./types";

/**
 * One icon per resource type. Cards and detail pages use it as the image
 * placeholder: no real photos in the prototype (spec 40).
 */
export const TYPE_ICON: Record<ResourceType, LucideIcon> = {
  professional: UserRound,
  cultural_content: BookOpen,
  practical_tool: Wrench,
  activity_support: Users,
  organization_place: Building2,
};
