import Link from "next/link";
import { ArrowRight, ExternalLink, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Layout primitives shared by the three record structures (spec 14).
 * The client's professional mockup (October 2026) sets the pattern: a wide
 * reading column of titled cards, and a narrower aside with the practical
 * information and the « Éléments complémentaires » box.
 */

/** Under the hero: main column (2/3) and aside (1/3). Stacked on small screens. */
export function DetailBody({ main, aside }: { main: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">{main}</div>
      <aside className="space-y-6">{aside}</aside>
    </div>
  );
}

/** One titled card. `id` lets the hero CTA jump to it. */
export function DetailSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24 [--card-spacing:--spacing(5)]">
      <CardHeader>
        <h2 className="font-heading text-lg leading-snug font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">{children}</CardContent>
    </Card>
  );
}

/** Wrapper for InfoRow / ContactRow: a description list, one term per row. */
export function DetailList({ children }: { children: React.ReactNode }) {
  return <dl className="space-y-4">{children}</dl>;
}

/** « Informations pratiques » row: bare icon, small label, value. */
export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium">{value}</dd>
      </div>
    </div>
  );
}

/**
 * Contact row: icon in a circle, small label, value or link.
 * mailto: and tel: stay in the tab; web links open a new one, flagged with an
 * icon, so the Invisithèque is not lost (spec 8.2).
 */
export function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium break-words">
          {href ? (
            <a
              href={href}
              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {value}
              {external ? (
                <>
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">(ouvre un nouvel onglet)</span>
                </>
              ) : null}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

const TONES = {
  accent: "bg-accent text-accent-foreground",
  partner: "bg-partner text-partner-foreground",
  event: "bg-event text-event-foreground",
} as const;

/**
 * Tinted box inside « Éléments complémentaires ». One signal per box, each
 * with its own icon and wording: colour alone never carries the meaning (spec 9.6).
 */
export function Highlight({
  tone,
  icon: Icon,
  badge,
  title,
  link,
  children,
}: {
  tone: keyof typeof TONES;
  icon?: LucideIcon;
  /** Short text in place of the icon, e.g. "-15%" (the discount macaron). */
  badge?: string;
  title: string;
  link?: { label: string; href: string; external?: boolean };
  children: React.ReactNode;
}) {
  const linkClass = "inline-flex items-center gap-1 font-medium underline underline-offset-4";

  return (
    <div className={cn("flex gap-3 rounded-lg p-4", TONES[tone])}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-background/80 text-xs font-bold">
        {badge ?? (Icon ? <Icon aria-hidden="true" className="size-4" /> : null)}
      </span>
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">{title}</p>
        <p className="text-foreground/80">{children}</p>
        {link ? (
          <p className="pt-1">
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label}
                <ExternalLink aria-hidden="true" className="size-3.5" />
                <span className="sr-only">(ouvre un nouvel onglet)</span>
              </a>
            ) : (
              <Link href={link.href} className={linkClass}>
                {link.label}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}
