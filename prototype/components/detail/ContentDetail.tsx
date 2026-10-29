import {
  Banknote,
  BookOpen,
  ExternalLink,
  Eye,
  Handshake,
  Hash,
  HeartPulse,
  PenLine,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailBody, DetailList, DetailSection, Highlight, InfoRow } from "./DetailLayout";
import { formatAuthors, joinFr, label, labels } from "@/lib/data";
import type { CulturalContentDetails, Resource } from "@/lib/types";

/**
 * Fiche « Contenus et médias » and « Outils pratiques » (same record
 * structure). Same layout as the professional fiche: reading column, then
 * the practical facts and the association's own signals in the aside.
 */
export default function ContentDetail({
  resource,
  details,
}: {
  resource: Resource;
  details: CulturalContentDetails;
}) {
  const [primaryLink, ...otherLinks] = details.links;
  const hasExtras = details.createdByAssociation || resource.isAssociationPartner;

  return (
    <DetailBody
      main={
        <>
          <DetailSection title="Description">
            <p className="max-w-prose leading-relaxed text-pretty">{details.description}</p>
          </DetailSection>

          {/* The peer voice gets its own card: it is what distinguishes the Invisithèque. */}
          <DetailSection title="L’avis de la personne qui a proposé la ressource">
            <blockquote className="max-w-prose border-l-2 border-primary pl-4 text-muted-foreground italic">
              {details.proposerOpinion}
              {resource.recommendedBy ? (
                <footer className="mt-2 text-xs not-italic">— {resource.recommendedBy}</footer>
              ) : null}
            </blockquote>
          </DetailSection>

          {primaryLink ? (
            <DetailSection id="contact" title="Consulter la ressource">
              <div className="flex flex-col gap-2">
                {/* Outbound links: new tab on purpose, so the Invisithèque is not lost. */}
                <Button asChild size="lg" className="w-full">
                  <a href={primaryLink.url} target="_blank" rel="noopener noreferrer">
                    {primaryLink.label}
                    <ExternalLink aria-hidden="true" />
                    <span className="sr-only">(ouvre un nouvel onglet)</span>
                  </a>
                </Button>
                {otherLinks.map((link) => (
                  <Button key={link.label} asChild size="lg" variant="outline" className="w-full">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <ExternalLink aria-hidden="true" />
                      <span className="sr-only">(ouvre un nouvel onglet)</span>
                    </a>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                La ressource est hébergée par son éditeur·rice ou sa plateforme. L’Invisithèque n’en
                assure ni la vente ni la diffusion.
              </p>
            </DetailSection>
          ) : null}
        </>
      }
      aside={
        <>
          <DetailSection title="Informations pratiques">
            <DetailList>
              <InfoRow
                icon={PenLine}
                label="Auteur·rice·s"
                value={formatAuthors(details.authors, details.hasMultipleAuthors)}
              />
              <InfoRow icon={BookOpen} label="Format" value={label("mediaFormats", details.format)} />
              <InfoRow icon={Tag} label="Genre" value={label("mediaGenres", details.genre)} />
              <InfoRow icon={Eye} label="Point de vue" value={label("pointsOfView", details.pointOfView)} />
              <InfoRow icon={Hash} label="Thème principal" value={details.mainTheme} />
              <InfoRow
                icon={HeartPulse}
                label="Maladies ou handicaps concernés"
                value={joinFr(labels("disorderCategories", resource.disorderCategories))}
              />
              <InfoRow icon={Banknote} label="Tarif" value={label("pricing", resource.pricing)} />
            </DetailList>
          </DetailSection>

          {hasExtras ? (
            <DetailSection title="Éléments complémentaires">
              {details.createdByAssociation ? (
                <Highlight tone="accent" icon={Sparkles} title="Créé par Les Invisibles">
                  Ce contenu a été produit par l’association elle-même.
                </Highlight>
              ) : null}
              {resource.isAssociationPartner ? (
                <Highlight tone="partner" icon={Handshake} title="Partenaire des Invisibles">
                  Cette ressource est proposée par un·e partenaire de l’association.
                </Highlight>
              ) : null}
            </DetailSection>
          ) : null}
        </>
      }
    />
  );
}
