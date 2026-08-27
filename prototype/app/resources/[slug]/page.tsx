import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Badges from "@/components/Badges";
import ContentDetail from "@/components/detail/ContentDetail";
import DemoActions from "@/components/detail/DemoActions";
import PlaceDetail from "@/components/detail/PlaceDetail";
import ProfessionalDetail from "@/components/detail/ProfessionalDetail";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { formatDate, getCardMeta, getResourceBySlug, resources, typeLabel } from "@/lib/data";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  return { title: resource ? `${resource.title} – L’Invisithèque` : "Ressource introuvable" };
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <article className="mx-auto w-full max-w-6xl space-y-6 px-6 py-6">
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

      {/* Same grid as the detail sections below, so the image column and the
          first card share the same width and edges. The image panel stretches
          to the text block's height so both header blocks stay equal. */}
      <header className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex min-h-56 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-accent">
          {/* The brief shows professionals with a round photo; no real photos here. */}
          {resource.professional ? (
            <Avatar className="size-40">
              <AvatarFallback className="bg-background text-4xl">
                {resource.professional.firstName[0]}
                {resource.professional.lastName[0]}
              </AvatarFallback>
            </Avatar>
          ) : null}
        </div>

        <div className="space-y-3 xl:col-span-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">{typeLabel(resource.resourceType)}</Badge>
            <Badges resource={resource} />
          </div>

          <h1 className="text-3xl">{resource.title}</h1>
          <p className="text-lg text-muted-foreground">{resource.shortDescription}</p>

          <ul className="flex flex-wrap gap-1">
            {getCardMeta(resource).map((item) => (
              <li key={item}>
                <Badge variant="secondary" className="font-normal">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>

          {resource.recommendedBy ? (
            <Item size="xs" variant="muted">
              <ItemContent>
                <ItemTitle>Ressource proposée par {resource.recommendedBy}</ItemTitle>
                <ItemDescription>Ajoutée le {formatDate(resource.publishedAt)}</ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button asChild>
              {/* Outbound link: new tab on purpose, so the Invisithèque is not lost. */}
              <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer">
                En savoir plus
                <ExternalLink aria-hidden="true" />
                <span className="sr-only">(ouvre un nouvel onglet)</span>
              </a>
            </Button>
            <DemoActions resourceType={resource.resourceType} />
          </div>
        </div>
      </header>

      {resource.professional ? <ProfessionalDetail details={resource.professional} /> : null}
      {resource.culturalContent ? <ContentDetail details={resource.culturalContent} /> : null}
      {resource.place ? (
        <PlaceDetail
          details={resource.place}
          resourceType={resource.resourceType}
          isAssociationPartner={resource.isAssociationPartner}
        />
      ) : null}
    </article>
  );
}
