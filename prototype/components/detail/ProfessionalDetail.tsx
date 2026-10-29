import {
  AtSign,
  Banknote,
  CalendarHeart,
  CirclePlay,
  ExternalLink,
  Globe,
  Handshake,
  Mail,
  MapPin,
  Monitor,
  Phone,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContactRow,
  DetailBody,
  DetailList,
  DetailSection,
  Highlight,
  InfoRow,
} from "./DetailLayout";
import { consultationModesText, formatDate, label, labels } from "@/lib/data";
import { wellbeingCirclesHref } from "@/lib/url";
import type { ProfessionalDetails, Resource } from "@/lib/types";

const SOCIAL_MEDIA: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X / Twitter",
};

/** Fiche « Professionnel·es », laid out after the client's October 2026 mockup. */
export default function ProfessionalDetail({
  resource,
  details,
}: {
  resource: Resource;
  details: ProfessionalDetails;
}) {
  const { contact, socialLinks, discount, upcomingAssociationEvent } = details;
  const fullName = `${details.firstName} ${details.lastName}`;
  const hasExtras =
    !!details.interviewUrl || !!discount || !!upcomingAssociationEvent || resource.isAssociationPartner;

  return (
    <DetailBody
      main={
        <>
          <DetailSection title="Présentation">
            <p className="leading-relaxed">{details.presentation}</p>
          </DetailSection>

          <DetailSection title={`Spécialité${details.specialties.length > 1 ? "s" : ""}`}>
            {/* Expandable rows, as in the client's wireframe; the first one is open. */}
            <Accordion
              type="multiple"
              defaultValue={details.specialties.slice(0, 1).map((item) => item.id)}
              className="gap-2"
            >
              {details.specialties.map((specialty) => (
                <AccordionItem
                  key={specialty.id}
                  value={specialty.id}
                  className="rounded-lg border px-4 data-[state=open]:border-transparent data-[state=open]:bg-accent/60"
                >
                  <AccordionTrigger className="py-3 text-base hover:no-underline">
                    {specialty.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {specialty.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DetailSection>

          {details.topics.length > 0 ? (
            <DetailSection title="Thématiques abordées">
              <ul className="flex flex-wrap gap-2">
                {labels("professionalTopics", details.topics).map((topic) => (
                  <li key={topic}>
                    <Badge
                      variant="outline"
                      className="h-auto border-primary/25 bg-accent/50 px-3 py-1.5 text-sm font-normal text-accent-foreground"
                    >
                      {topic}
                    </Badge>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          <DetailSection id="contact" title={`Contacter ${fullName}`}>
            <DetailList>
              {contact.email ? (
                <ContactRow icon={Mail} label="E-mail" value={contact.email} href={`mailto:${contact.email}`} />
              ) : null}
              {contact.phone ? (
                <ContactRow
                  icon={Phone}
                  label="Téléphone"
                  value={contact.phone}
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                />
              ) : null}
              {contact.website ? (
                <ContactRow
                  icon={Globe}
                  label="Site internet"
                  value="Consulter le site"
                  href={contact.website}
                  external
                />
              ) : null}
              {Object.entries(socialLinks ?? {}).map(([key, url]) => (
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

            {contact.bookingUrl ? (
              <Button asChild size="lg" className="w-full">
                <a href={contact.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Prendre rendez-vous
                  <ExternalLink aria-hidden="true" />
                  <span className="sr-only">(ouvre un nouvel onglet)</span>
                </a>
              </Button>
            ) : null}

            <p className="text-xs text-muted-foreground">
              Les coordonnées sont fournies directement par {fullName}. L’Invisithèque n’intervient
              pas dans la prise de rendez-vous.
            </p>
          </DetailSection>
        </>
      }
      aside={
        <>
          <DetailSection title="Informations pratiques">
            <DetailList>
              <InfoRow
                icon={MapPin}
                label="Lieu de consultation"
                value={`${details.city}, ${label("countries", details.country)}`}
              />
              <InfoRow
                icon={Monitor}
                label="Mode de consultation"
                value={consultationModesText(details.consultationModes)}
              />
              <InfoRow icon={Banknote} label="Tarif" value={label("pricing", resource.pricing)} />
            </DetailList>
          </DetailSection>

          {hasExtras ? (
            <DetailSection title="Éléments complémentaires">
              {details.interviewUrl ? (
                <Highlight
                  tone="accent"
                  icon={CirclePlay}
                  title="Découvrir son interview avec Les Invisibles"
                  link={{ label: "Voir l’interview", href: details.interviewUrl, external: true }}
                >
                  Une vidéo pour mieux connaître son parcours, son approche et sa vision.
                </Highlight>
              ) : null}

              {discount ? (
                <Highlight tone="partner" badge={`-${discount.percentage}%`} title="Avantage adhérent·es">
                  {discount.description}
                </Highlight>
              ) : null}

              {upcomingAssociationEvent ? (
                <Highlight
                  tone="event"
                  icon={CalendarHeart}
                  title="Cercle mieux-être"
                  link={{ label: "Consulter les prochaines dates", href: wellbeingCirclesHref() }}
                >
                  {upcomingAssociationEvent.title}, le {formatDate(upcomingAssociationEvent.date)}, animé par{" "}
                  {details.firstName}.
                </Highlight>
              ) : null}

              {resource.isAssociationPartner ? (
                <Highlight tone="partner" icon={Handshake} title="Partenaire des Invisibles">
                  {fullName} est partenaire de l’association Les Invisibles.
                </Highlight>
              ) : null}
            </DetailSection>
          ) : null}
        </>
      }
    />
  );
}
