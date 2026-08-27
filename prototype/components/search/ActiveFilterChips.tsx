"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FILTER_GROUPS } from "@/lib/config";
import { label, typeLabel } from "@/lib/data";
import { MULTI_FILTER_KEYS } from "@/lib/filters";
import type { FilterState, MultiFilterKey } from "@/lib/types";

function RemovableChip({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <Badge asChild variant="secondary" className="h-6 gap-1 pr-1 font-normal">
      <button type="button" onClick={onRemove}>
        {text}
        <X aria-hidden="true" />
        <span className="sr-only">Retirer ce filtre</span>
      </button>
    </Badge>
  );
}

export default function ActiveFilterChips({
  filters,
  onRemoveValue,
  onClearType,
  onToggleVerified,
  onTogglePartners,
  onReset,
}: {
  filters: FilterState;
  onRemoveValue: (key: MultiFilterKey, id: string) => void;
  onClearType: () => void;
  onToggleVerified: () => void;
  onTogglePartners: () => void;
  onReset: () => void;
}) {
  const chips = MULTI_FILTER_KEYS.flatMap((key) =>
    filters[key].map((id) => ({
      key,
      id,
      text: `${FILTER_GROUPS[key].label} : ${label(FILTER_GROUPS[key].taxonomy, id)}`,
    })),
  );

  const hasAnything =
    chips.length > 0 || filters.resourceType || filters.verifiedOnly || filters.partnersOnly;
  if (!hasAnything) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filtres actifs :</span>

      {filters.resourceType ? (
        <RemovableChip text={`Type : ${typeLabel(filters.resourceType)}`} onRemove={onClearType} />
      ) : null}

      {filters.verifiedOnly ? (
        <RemovableChip text="Vérifié par l’association" onRemove={onToggleVerified} />
      ) : null}

      {filters.partnersOnly ? (
        <RemovableChip text="Partenaire des Invisibles" onRemove={onTogglePartners} />
      ) : null}

      {chips.map((chip) => (
        <RemovableChip
          key={`${chip.key}-${chip.id}`}
          text={chip.text}
          onRemove={() => onRemoveValue(chip.key, chip.id)}
        />
      ))}

      <Button variant="link" size="sm" onClick={onReset}>
        Tout effacer
      </Button>
    </div>
  );
}
