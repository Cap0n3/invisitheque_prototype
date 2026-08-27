import {
  AtSign,
  CalendarCheck,
  Globe,
  Link as LinkIcon,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { DataList, DetailSection, LinkList } from "./DetailSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate, label, labels } from "@/lib/data";
import type { ProfessionalDetails } from "@/lib/types";

// AtSign for every social profile: this lucide version ships no brand icons.
const SOCIAL_MEDIA: Record<string, { label: string; icon: LucideIcon }> = {
  linkedin: { label: "LinkedIn", icon: AtSign },
  instagram: { label: "Instagram", icon: AtSign },
  facebook: { label: "Facebook", icon: AtSign },
  youtube: { label: "YouTube", icon: AtSign },
  tiktok: { label: "TikTok", icon: AtSign },
  twitter: { label: "X / Twitter", icon: AtSign },
};

export default function ProfessionalDetail({ details }: { details: ProfessionalDetails }) {
  const { contact, socialLinks, discount, upcomingAssociationEvent } = details;

  const contactLinks = [
    contact.website ? { label: "Site internet", href: contact.website, icon: Globe } : null,
    contact.bookingUrl
      ? { label: "Prendre rendez-vous", href: contact.bookingUrl, icon: CalendarCheck }
      : null,
    contact.phone ? { label: contact.phone, icon: Phone } : null,
    contact.email ? { label: contact.email, icon: Mail } : null,
    ...Object.entries(socialLinks ?? {}).map(([key, url]) => ({
      label: SOCIAL_MEDIA[key]?.label ?? key,
      href: url,
      icon: SOCIAL_MEDIA[key]?.icon ?? LinkIcon,
    })),
  ].filter(Boolean) as Array<{ label: string; href?: string; icon: LucideIcon }>;

  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DetailSection title="Présentation">
        <p>{details.presentation}</p>
        <DataList
          rows={[
            { label: "Localisation", value: `${details.city}, ${label("countries", details.country)}` },
            {
              label: "Consultation",
              value: labels("consultationModes", details.consultationModes).join(" · "),
            },
            {
              label: "Famille d’accompagnement",
              value: label("professionalFamilies", details.family),
            },
          ]}
        />
      </DetailSection>

      <DetailSection title={`Spécialité${details.specialties.length > 1 ? "s" : ""}`}>
        {/* Accordion: mirrors the client's mockup (label + chevron). */}
        <Accordion type="single" collapsible className="w-full">
          {details.specialties.map((specialty) => (
            <AccordionItem key={specialty.id} value={specialty.id}>
              <AccordionTrigger>{specialty.label}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {specialty.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DetailSection>

      {discount ? (
        <DetailSection
          title={
            <span className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                -{discount.percentage}%
              </span>
              Offre adhérent·es de l’asso
            </span>
          }
        >
          <p>{discount.description}</p>
        </DetailSection>
      ) : null}

      {upcomingAssociationEvent ? (
        <DetailSection title="Cercle mieux-être à venir">
          <p>
            <strong>{upcomingAssociationEvent.title}</strong>
            <br />
            {formatDate(upcomingAssociationEvent.date)}
          </p>
          <p className="text-muted-foreground">
            Les professionnel·les qui animent un cercle remontent dans les résultats (étape 2).
          </p>
        </DetailSection>
      ) : null}

      <DetailSection title="Contact">
        <LinkList links={contactLinks} />
      </DetailSection>
    </div>
  );
}
