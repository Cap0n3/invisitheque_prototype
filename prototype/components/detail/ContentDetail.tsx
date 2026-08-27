import { DataList, DetailSection, LinkList } from "./DetailSection";
import { formatAuthors, label, labels } from "@/lib/data";
import type { CulturalContentDetails } from "@/lib/types";

export default function ContentDetail({
  details,
  shortDescription,
  disorderCategories,
}: {
  details: CulturalContentDetails;
  /** Both carried by the resource, not the content block ("one concept, one field"). */
  shortDescription: string;
  disorderCategories: string[];
}) {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* Left: the resource at a glance — short description plus the facts. */}
      <DetailSection title="Description">
        <p>{shortDescription}</p>
        <DataList
          rows={[
            {
              label: "Auteur·rice·s",
              value: formatAuthors(details.authors, details.hasMultipleAuthors),
            },
            {
              label: "Maladies ou handicaps concernés",
              value: labels("disorderCategories", disorderCategories).join(", "),
            },
            { label: "Format", value: label("mediaFormats", details.format) },
            { label: "Genre", value: label("mediaGenres", details.genre) },
            { label: "Point de vue", value: label("pointsOfView", details.pointOfView) },
            { label: "Thème principal", value: details.mainTheme },
          ]}
        />
      </DetailSection>

      {/* Right: the brief's "Description longue (400 caractères)", given room to breathe. */}
      <DetailSection title="Description détaillée" className="xl:col-span-2">
        <p className="max-w-prose text-[15px] leading-7 text-pretty">{details.description}</p>
      </DetailSection>

      <DetailSection
        title="L’avis de la personne qui a proposé la ressource"
        className="xl:col-span-2"
      >
        <blockquote className="max-w-prose border-l-2 border-primary pl-4 text-muted-foreground italic">
          {details.proposerOpinion}
        </blockquote>
      </DetailSection>

      <DetailSection title="Consulter la ressource">
        <LinkList links={details.links.map((link) => ({ label: link.label, href: link.url }))} />
      </DetailSection>
    </div>
  );
}
