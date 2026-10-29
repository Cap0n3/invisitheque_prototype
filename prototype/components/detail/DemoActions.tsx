"use client";

import { useState } from "react";
import { Bookmark, Check, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ResourceType } from "@/lib/types";

/**
 * Phase 3 interactions (favorites, "already consulted"), simulated in local
 * state only (spec 21). Nothing is persisted. Same placement as the client's
 * mockup: next to the primary action, in the hero.
 */
export default function DemoActions({ resourceType }: { resourceType: ResourceType }) {
  const [isFavorite, setFavorite] = useState(false);
  const [isConsulted, setConsulted] = useState(false);

  const consultedLabel =
    resourceType === "cultural_content" || resourceType === "practical_tool"
      ? "Déjà lu / vu / consulté"
      : "Déjà consulté";

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        aria-pressed={isFavorite}
        onClick={() => {
          setFavorite((value) => !value);
          toast(isFavorite ? "Retiré des favoris (démo)" : "Ajouté aux favoris (démo)");
        }}
      >
        <Bookmark className={isFavorite ? "fill-current" : undefined} aria-hidden="true" />
        {isFavorite ? "Dans vos favoris" : "Ajouter aux favoris"}
      </Button>

      <Button
        variant="outline"
        size="lg"
        aria-pressed={isConsulted}
        onClick={() => setConsulted((value) => !value)}
      >
        {isConsulted ? <Check aria-hidden="true" /> : <Eye aria-hidden="true" />}
        {consultedLabel}
      </Button>
    </>
  );
}
