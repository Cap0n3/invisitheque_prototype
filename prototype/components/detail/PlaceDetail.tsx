import { DataList, DetailSection, LinkList } from "./DetailSection";
import { label } from "@/lib/data";
import type { PlaceDetails } from "@/lib/types";

/**
 * One record structure for « Organisations et lieux » and « Activités et
 * accompagnements » (the brief already grouped support spaces and institutions).
 * Only the category rows differ, driven by the fields the record carries.
 */
export default function PlaceDetail({
  details,
  isAssociationPartner,
}: {
  details: PlaceDetails;
  isAssociationPartner: boolean;
}) {
  const categoryRows = [
    details.organizationType
      ? {
          label: "Type d’organisation",
          value: label("institutionCategories", details.organizationType),
        }
      : null,
    details.placeType
      ? { label: "Type de lieu", value: label("placeCategories", details.placeType) }
      : null,
    details.activityType
      ? { label: "Type d’activité", value: label("activityCategories", details.activityType) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const links = [
    details.website ? { label: "Site internet", href: details.website } : null,
    ...Object.entries(details.socialLinks ?? {}).map(([key, url]) => ({ label: key, href: url })),
  ].filter(Boolean) as Array<{ label: string; href?: string }>;

  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DetailSection title="Présentation">
        <p>{details.presentation}</p>
        <DataList
          rows={[
            ...categoryRows,
            {
              label: "Accès",
              value: [
                label("deliveryModes", details.deliveryMode),
                details.city,
                details.country ? label("countries", details.country) : null,
              ]
                .filter(Boolean)
                .join(" · "),
            },
            {
              label: "Partenaire de l’association",
              value: isAssociationPartner ? "Oui" : "Non",
            },
          ]}
        />
      </DetailSection>

      <DetailSection title="Pourquoi ça peut vous aider ?">
        <p>{details.whyItHelps}</p>
      </DetailSection>

      {links.length > 0 ? (
        <DetailSection title="Liens">
          <LinkList links={links} />
        </DetailSection>
      ) : null}
    </div>
  );
}
