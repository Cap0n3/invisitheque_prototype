"use client";

import { useState } from "react";
import { Bookmark, Check, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ResourceType } from "@/lib/types";

/**
 * Phase 3 interactions (accounts, reviews, favorites, "already consulted"),
 * simulated in local state only (spec 21). Nothing is persisted.
 */
export default function DemoActions({ resourceType }: { resourceType: ResourceType }) {
  const [isFavorite, setFavorite] = useState(false);
  const [isConsulted, setConsulted] = useState(false);

  const consultedLabel =
    resourceType === "cultural_content" || resourceType === "practical_tool"
      ? "Déjà lu / vu / consulté"
      : "Déjà consulté";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" className="font-normal">
        Étape 3 – démo
      </Badge>

      <ButtonGroup>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={isFavorite}
        onClick={() => {
          setFavorite((value) => !value);
          toast(isFavorite ? "Retiré des favoris (démo)" : "Ajouté aux favoris (démo)");
        }}
      >
        <Bookmark className={isFavorite ? "fill-current" : undefined} aria-hidden="true" />
        {isFavorite ? "En favori" : "Ajouter aux favoris"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        aria-pressed={isConsulted}
        onClick={() => setConsulted((value) => !value)}
      >
        {isConsulted ? <Check aria-hidden="true" /> : null}
        {consultedLabel}
      </Button>
      </ButtonGroup>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <MessageSquare aria-hidden="true" />
            Donner un avis
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donner un avis</DialogTitle>
            <DialogDescription>
              Les avis arrivent avec les comptes personnels (étape 3). Cet écran sert uniquement à
              en discuter la place dans l’interface.
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel>Votre note</FieldLabel>
            <ToggleGroup type="single" variant="outline" disabled className="w-fit">
              {[1, 2, 3, 4, 5].map((value) => (
                <ToggleGroupItem key={value} value={String(value)} aria-label={`${value} étoiles`}>
                  <Star aria-hidden="true" />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldDescription>Contrôles désactivés dans le prototype.</FieldDescription>
          </Field>

          <Textarea placeholder="Votre commentaire (désactivé dans le prototype)" disabled />

          <DialogFooter>
            <Button disabled>Publier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
