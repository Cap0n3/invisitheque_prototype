import { DataList, DetailSection, LinkList } from "./DetailSection";
import { formatAuthors, label } from "@/lib/data";
import type { CulturalContentDetails } from "@/lib/types";

export default function ContentDetail({ details }: { details: CulturalContentDetails }) {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DetailSection title="Description">
        <p>{details.description}</p>
        <DataList
          rows={[
            {
              label: "Auteur·rice·s",
              value: formatAuthors(details.authors, details.hasMultipleAuthors),
            },
            { label: "Format", value: label("mediaFormats", details.format) },
            { label: "Genre", value: label("mediaGenres", details.genre) },
            { label: "Point de vue", value: label("pointsOfView", details.pointOfView) },
            { label: "Thème principal", value: details.mainTheme },
          ]}
        />
      </DetailSection>

      <DetailSection title="L’avis de la personne qui a proposé la ressource">
        <blockquote className="border-l-2 border-primary pl-4 text-muted-foreground italic">
          {details.proposerOpinion}
        </blockquote>
      </DetailSection>

      <DetailSection title="Consulter la ressource">
        <LinkList links={details.links.map((link) => ({ label: link.label, href: link.url }))} />
      </DetailSection>
    </div>
  );
}
