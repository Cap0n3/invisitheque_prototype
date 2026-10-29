import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import ContactMenu from "@/components/detail/ContactMenu";
import ContentDetail from "@/components/detail/ContentDetail";
import DetailHero from "@/components/detail/DetailHero";
import PlaceDetail from "@/components/detail/PlaceDetail";
import ProfessionalDetail from "@/components/detail/ProfessionalDetail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getResourceBySlug, resources, typeLabel } from "@/lib/data";
import type { Resource } from "@/lib/types";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  return { title: resource ? `${resource.title} – L’Invisithèque` : "Ressource introuvable" };
}

/**
 * Hero CTA: a contact menu for a professional, the outbound "En savoir plus"
 * link (spec 14) for everything else. Outbound links open a new tab on
 * purpose, so the Invisithèque is not lost.
 */
function PrimaryAction({ resource }: { resource: Resource }) {
  if (resource.professional) {
    const { firstName, lastName, contact } = resource.professional;
    return <ContactMenu name={`${firstName} ${lastName}`} contact={contact} />;
  }

  const link =
    resource.culturalContent?.links[0] ??
    (resource.place?.website ? { label: "Consulter le site", url: resource.place.website } : null) ??
    { label: "En savoir plus", url: resource.externalUrl };

  return (
    <Button asChild size="lg">
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.label}
        <ExternalLink aria-hidden="true" />
        <span className="sr-only">(ouvre un nouvel onglet)</span>
      </a>
    </Button>
  );
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <article className="mx-auto w-full max-w-6xl space-y-8 px-6 py-6">
      {/* Internal navigation stays in the tab: Back restores the search from the URL. */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/search">Résultats de recherche</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{typeLabel(resource.resourceType)}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{resource.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DetailHero resource={resource} cta={<PrimaryAction resource={resource} />} />

      {resource.professional ? (
        <ProfessionalDetail resource={resource} details={resource.professional} />
      ) : null}
      {resource.culturalContent ? (
        <ContentDetail resource={resource} details={resource.culturalContent} />
      ) : null}
      {resource.place ? <PlaceDetail resource={resource} details={resource.place} /> : null}
    </article>
  );
}
