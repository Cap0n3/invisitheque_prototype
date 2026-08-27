"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import FilterGroup from "./FilterGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { FILTER_GROUPS, FILTER_LAYOUT } from "@/lib/config";
import { getTaxonomy } from "@/lib/data";
import { countActiveFilters } from "@/lib/filters";
import type { FilterState, MultiFilterKey } from "@/lib/types";

/**
 * Level 2: the cumulative filters.
 * A few primary filters stay visible, the rest sit behind "Plus de filtres".
 * The primary/advanced split comes from lib/config.ts.
 */
export default function FilterBar({
  filters,
  onToggleValue,
  onToggleVerified,
  onTogglePartners,
  onReset,
}: {
  filters: FilterState;
  onToggleValue: (key: MultiFilterKey, id: string) => void;
  onToggleVerified: () => void;
  onTogglePartners: () => void;
  onReset: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const layout = FILTER_LAYOUT[filters.resourceType ?? "all"];
  const activeCount = countActiveFilters(filters);

  const renderGroup = (key: MultiFilterKey) => {
    const group = FILTER_GROUPS[key];
    return (
      <FilterGroup
        key={key}
        label={group.label}
        items={getTaxonomy(group.taxonomy)}
        selected={filters[key]}
        onToggle={(id) => onToggleValue(key, id)}
      />
    );
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <FieldGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {layout.primary.map(renderGroup)}
        </FieldGroup>

        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <ButtonGroup>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal aria-hidden="true" />
                {showAdvanced ? "Moins de filtres" : "Plus de filtres"}
                {layout.advanced.length > 0 ? ` (${layout.advanced.length})` : ""}
                <ChevronDown
                  aria-hidden="true"
                  className={showAdvanced ? "rotate-180 transition-transform" : "transition-transform"}
                />
              </Button>
            </CollapsibleTrigger>

            <Button variant="ghost" size="sm" onClick={onReset} disabled={activeCount === 0}>
              <RotateCcw aria-hidden="true" />
              Tout réinitialiser
            </Button>
          </ButtonGroup>

          <CollapsibleContent className="space-y-5 pt-4">
            <FieldSeparator />

            {layout.advanced.length > 0 ? (
              <FieldGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {layout.advanced.map(renderGroup)}
              </FieldGroup>
            ) : (
              <p className="text-sm text-muted-foreground">
                Choisissez un type de ressource pour voir les filtres spécifiques (pays, format,
                type de dispositif…).
              </p>
            )}

            <Field>
              <FieldLabel className="text-xs tracking-wide text-muted-foreground uppercase">
                Confiance
              </FieldLabel>
              <Field orientation="horizontal">
                <Checkbox
                  id="verified-only"
                  checked={filters.verifiedOnly}
                  onCheckedChange={onToggleVerified}
                />
                <FieldLabel htmlFor="verified-only" className="font-normal">
                  Uniquement les ressources vérifiées par l’association
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="partners-only"
                  checked={filters.partnersOnly}
                  onCheckedChange={onTogglePartners}
                />
                <FieldLabel htmlFor="partners-only" className="font-normal">
                  Uniquement les partenaires des Invisibles
                </FieldLabel>
              </Field>
            </Field>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
