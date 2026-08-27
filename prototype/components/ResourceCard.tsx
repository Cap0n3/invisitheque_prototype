"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, Building2, CalendarRange, Users, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import Badges from "./Badges";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getCardMeta, typeLabel } from "@/lib/data";
import type { Resource, ResourceType } from "@/lib/types";

/** Neutral flat fills: no real photos in the prototype (spec 40). */
const TYPE_ICON: Record<ResourceType, typeof UserRound> = {
  professional: UserRound,
  cultural_content: BookOpen,
  support_space: Users,
  institution_partner: Building2,
  practical_tool: Wrench,
  program_training: CalendarRange,
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [isFavorite, setFavorite] = useState(false);
  const Icon = TYPE_ICON[resource.resourceType];
  const discount = resource.professional?.discount;
  const href = `/resources/${resource.slug}`;

  return (
    <Card className="relative gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
      <AspectRatio
        ratio={16 / 7}
        className="flex items-center justify-center bg-gradient-to-br from-muted to-accent text-muted-foreground/60"
      >
        <Icon className="size-8" aria-hidden="true" />
      </AspectRatio>

      {discount ? (
        <Badge className="absolute top-3 right-3 size-12 rounded-full bg-foreground text-background">
          -{discount.percentage}%
        </Badge>
      ) : null}

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{typeLabel(resource.resourceType)}</Badge>
          <Badges resource={resource} />
        </div>

        <h3 className="text-base leading-snug font-semibold">
          {/* Internal navigation: we stay in the tab; going back uses the browser
              Back button, which restores the search from the URL. */}
          <Link href={href} className="hover:underline">
            {resource.title}
          </Link>
        </h3>

        <p className="text-sm text-muted-foreground">{resource.shortDescription}</p>

        <ul className="mt-1 flex flex-wrap gap-1">
          {getCardMeta(resource).map((item) => (
            <li key={item}>
              <Badge variant="secondary" className="font-normal">
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto p-4 pt-0">
        <ButtonGroup>
        <Button asChild size="sm" variant="outline">
          <Link href={href}>Voir la fiche</Link>
        </Button>

        {/* Phase 3, simulated locally (spec 21). */}
        <Button
          size="sm"
          variant="ghost"
          aria-pressed={isFavorite}
          onClick={() => {
            setFavorite((value) => !value);
            toast(isFavorite ? "Retiré des favoris (démo)" : "Ajouté aux favoris (démo)");
          }}
        >
          <Bookmark className={isFavorite ? "fill-current" : undefined} aria-hidden="true" />
          Favori (démo)
        </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
