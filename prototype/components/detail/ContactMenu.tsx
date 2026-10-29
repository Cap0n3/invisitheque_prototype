"use client";

import {
  CalendarCheck,
  ChevronDown,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfessionalDetails } from "@/lib/types";

interface ContactOption {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

/**
 * Hero CTA of a professional (client mockup: « Contacter … ⌄ »):
 * every way to reach them, in one menu. The full list sits in the contact card.
 */
export default function ContactMenu({
  name,
  contact,
}: {
  name: string;
  contact: ProfessionalDetails["contact"];
}) {
  const options = [
    contact.email ? { label: "Envoyer un e-mail", href: `mailto:${contact.email}`, icon: Mail } : null,
    contact.phone
      ? { label: "Appeler", href: `tel:${contact.phone.replace(/\s/g, "")}`, icon: Phone }
      : null,
    contact.bookingUrl
      ? { label: "Prendre rendez-vous", href: contact.bookingUrl, icon: CalendarCheck, external: true }
      : null,
    contact.website
      ? { label: "Site internet", href: contact.website, icon: Globe, external: true }
      : null,
  ].filter(Boolean) as ContactOption[];

  if (options.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg">
          <Mail aria-hidden="true" />
          Contacter {name}
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem key={option.label} asChild>
            <a
              href={option.href}
              {...(option.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <option.icon aria-hidden="true" />
              {option.label}
              {option.external ? (
                <>
                  <ExternalLink aria-hidden="true" className="ml-auto" />
                  <span className="sr-only">(ouvre un nouvel onglet)</span>
                </>
              ) : null}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
