import { Users } from "lucide-react";
import Badges from "@/components/Badges";
import DemoActions from "./DemoActions";
import { getHeroMeta } from "./heroMeta";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, typeLabel } from "@/lib/data";
import { TYPE_ICON } from "@/lib/typeIcons";
import type { Resource } from "@/lib/types";

/**
 * Top of every detail page, after the client's professional mockup:
 * image on the left; type, title, lead, chips, provenance and actions on the right.
 * `cta` is the type-specific primary action (contact menu, outbound link).
 */
export default function DetailHero({
  resource,
  cta,
}: {
  resource: Resource;
  cta: React.ReactNode;
}) {
  const Icon = TYPE_ICON[resource.resourceType];

  return (
    <header className="grid gap-6 md:grid-cols-3">
      {/* Image placeholder: no real photos in the prototype (spec 40). */}
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-muted to-accent text-muted-foreground/60 md:aspect-square">
        {resource.professional ? (
          <Avatar className="size-32">
            <AvatarFallback className="bg-background text-3xl">
              {resource.professional.firstName[0]}
              {resource.professional.lastName[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Icon className="size-14" aria-hidden="true" />
        )}
      </div>

      <div className="space-y-4 md:col-span-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{typeLabel(resource.resourceType)}</Badge>
          <Badges resource={resource} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold md:text-4xl">{resource.title}</h1>
          <p className="text-lg text-muted-foreground">{resource.shortDescription}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {getHeroMeta(resource).map(({ icon: MetaIcon, label }) => (
            <li key={label}>
              <Badge variant="secondary" className="h-auto gap-1.5 px-2.5 py-1 font-normal">
                <MetaIcon aria-hidden="true" />
                {label}
              </Badge>
            </li>
          ))}
        </ul>

        {resource.recommendedBy ? (
          <div className="flex items-center gap-3 rounded-lg bg-accent/60 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-background">
              <Users aria-hidden="true" className="size-4 text-accent-foreground" />
            </span>
            <div className="text-sm">
              <p className="font-medium">Ressource proposée par {resource.recommendedBy}</p>
              <p className="text-xs text-muted-foreground">
                Ajoutée le {formatDate(resource.publishedAt)}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {cta}
          <DemoActions resourceType={resource.resourceType} />
        </div>
      </div>
    </header>
  );
}
