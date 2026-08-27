import { DataList, DetailSection, LinkList } from "./DetailSection";
import { label } from "@/lib/data";
import type { PlaceDetails, ResourceType } from "@/lib/types";

/**
 * The brief groups support spaces and institutions/partners into a single
 * record structure; programs/trainings (a candidate type) reuse it.
 */
export default function PlaceDetail({
  details,
  resourceType,
  isAssociationPartner,
}: {
  details: PlaceDetails;
  resourceType: ResourceType;
  isAssociationPartner: boolean;
}) {
  const categoryTaxonomy =
    resourceType === "institution_partner" ? "institutionCategories" : "supportCategories";

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
            { label: "Type", value: label(categoryTaxonomy, details.category) },
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
