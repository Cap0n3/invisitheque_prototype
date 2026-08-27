import { DataList, DetailSection, LinkList } from "./DetailSection";
import { formatAuthors, label, labels } from "@/lib/data";
import type { CulturalContentDetails } from "@/lib/types";

export default function ContentDetail({
  details,
  shortDescription,
  disorderCategories,
  recommendedBy,
}: {
  details: CulturalContentDetails;
  /** All three carried by the resource, not the content block ("one concept, one field"). */
  shortDescription: string;
  disorderCategories: string[];
  recommendedBy: string | null;
}) {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* Left rail: the resource at a glance, then how to reach it. */}
      <div className="space-y-4">
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

        <DetailSection title="Consulter la ressource">
          <LinkList links={details.links.map((link) => ({ label: link.label, href: link.url }))} />
        </DetailSection>
      </div>

      {/* Right: the brief's "Description longue (400 caractères)", closed by the
          proposer's avis — the peer voice gets the last word. */}
      <DetailSection title="Description détaillée" className="xl:col-span-2">
        <p className="max-w-prose text-[15px] leading-7 text-pretty">{details.description}</p>

        <figure className="max-w-prose space-y-2 border-t pt-4">
          <figcaption className="text-xs tracking-wide text-muted-foreground uppercase">
            L’avis de la personne qui a proposé la ressource
          </figcaption>
          <blockquote className="border-l-2 border-primary pl-4 text-muted-foreground italic">
            {details.proposerOpinion}
            {recommendedBy ? (
              <footer className="mt-2 text-xs not-italic">— {recommendedBy}</footer>
            ) : null}
          </blockquote>
        </figure>
      </DetailSection>
    </div>
  );
}
