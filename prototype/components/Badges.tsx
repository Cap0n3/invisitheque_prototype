import { CalendarHeart, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/types";

/**
 * Two distinct signals (spec 9.5 / 9.6) - never merge them:
 * partnership, upcoming wellbeing circle. Neither is a quality mark.
 * Each badge carries its meaning in its text, not in its color alone.
 */
export default function Badges({ resource }: { resource: Resource }) {
  return (
    <>
      {resource.isAssociationPartner ? (
        <Badge className="bg-partner text-partner-foreground">
          <Handshake aria-hidden="true" />
          Partenaire des Invisibles
        </Badge>
      ) : null}

      {resource.hasUpcomingAssociationEvent ? (
        <Badge className="bg-event text-event-foreground">
          <CalendarHeart aria-hidden="true" />
          Cercle mieux-être à venir
        </Badge>
      ) : null}
    </>
  );
}
