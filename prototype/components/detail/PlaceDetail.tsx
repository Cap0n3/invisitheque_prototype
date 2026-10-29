import {
  AtSign,
  Banknote,
  Building2,
  CalendarHeart,
  Globe,
  Handshake,
  Landmark,
  MapPin,
  Monitor,
  Users,
} from "lucide-react";
import {
  ContactRow,
  DetailBody,
  DetailList,
  DetailSection,
  Highlight,
  InfoRow,
} from "./DetailLayout";
import { label } from "@/lib/data";
import { wellbeingCirclesHref } from "@/lib/url";
import type { PlaceDetails, Resource } from "@/lib/types";

const SOCIAL_MEDIA: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X / Twitter",
};

/**
 * One record structure for « Organisations et lieux » and « Activités et
 * accompagnements ». Same layout as the professional fiche; only the
 * category rows differ, driven by the fields the record carries.
 */
export default function PlaceDetail({
  resource,
  details,
}: {
  resource: Resource;
  details: PlaceDetails;
}) {
  const socials = Object.entries(details.socialLinks ?? {});
  const where = [details.city, details.country ? label("countries", details.country) : ""]
    .filter(Boolean)
    .join(", ");
  const hasContact = !!details.website || socials.length > 0;
  const hasExtras = resource.isAssociationPartner || resource.hasUpcomingAssociationEvent;

  return (
    <DetailBody
      main={
        <>
          <DetailSection title="Présentation">
            <p className="leading-relaxed">{details.presentation}</p>
          </DetailSection>

          <DetailSection title="Pourquoi ça peut vous aider ?">
            <p className="leading-relaxed">{details.whyItHelps}</p>
          </DetailSection>

          {hasContact ? (
            <DetailSection id="contact" title="Contact et liens">
              <DetailList>
                {details.website ? (
                  <ContactRow
                    icon={Globe}
                    label="Site internet"
                    value="Consulter le site"
                    href={details.website}
                    external
                  />
                ) : null}
                {socials.map(([key, url]) => (
                  <ContactRow
                    key={key}
                    icon={AtSign}
                    label={SOCIAL_MEDIA[key] ?? key}
                    value="Voir le profil"
                    href={url}
                    external
                  />
                ))}
              </DetailList>
              <p className="text-xs text-muted-foreground">
                Les coordonnées sont fournies directement par l’organisation. L’Invisithèque ne gère
                ni les inscriptions ni les réservations.
              </p>
            </DetailSection>
          ) : null}
        </>
      }
      aside={
        <>
          <DetailSection title="Informations pratiques">
            <DetailList>
              {details.organizationType ? (
                <InfoRow
                  icon={Building2}
                  label="Type d’organisation"
                  value={label("institutionCategories", details.organizationType)}
                />
              ) : null}
              {details.placeType ? (
                <InfoRow
                  icon={Landmark}
                  label="Type de lieu"
                  value={label("placeCategories", details.placeType)}
                />
              ) : null}
              {details.activityType ? (
                <InfoRow
                  icon={Users}
                  label="Type d’activité"
                  value={label("activityCategories", details.activityType)}
                />
              ) : null}
              <InfoRow icon={Monitor} label="Accès" value={label("deliveryModes", details.deliveryMode)} />
              {where ? <InfoRow icon={MapPin} label="Lieu" value={where} /> : null}
              <InfoRow icon={Banknote} label="Tarif" value={label("pricing", resource.pricing)} />
            </DetailList>
          </DetailSection>

          {hasExtras ? (
            <DetailSection title="Éléments complémentaires">
              {resource.isAssociationPartner ? (
                <Highlight tone="partner" icon={Handshake} title="Partenaire des Invisibles">
                  {resource.title} est partenaire de l’association Les Invisibles.
                </Highlight>
              ) : null}
              {resource.hasUpcomingAssociationEvent ? (
                <Highlight
                  tone="event"
                  icon={CalendarHeart}
                  title="Cercle mieux-être à venir"
                  link={{ label: "Consulter les prochaines dates", href: wellbeingCirclesHref() }}
                >
                  Un Cercle mieux-être des Invisibles y est prévu prochainement.
                </Highlight>
              ) : null}
            </DetailSection>
          ) : null}
        </>
      }
    />
  );
}
