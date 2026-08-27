"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TaxonomyItem } from "@/lib/types";

/**
 * One filter dimension, as multi-select pills (OR within the dimension).
 * Deliberately shaped differently from the resource-type tabs.
 */
export default function FilterGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: TaxonomyItem[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <Field>
      <FieldLabel className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </FieldLabel>

      <ToggleGroup
        type="multiple"
        variant="outline"
        size="sm"
        value={selected}
        className="flex flex-wrap justify-start gap-1.5"
      >
        {items.map((item) => (
          <ToggleGroupItem
            key={item.id}
            value={item.id}
            onClick={() => onToggle(item.id)}
            className="rounded-full data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
}
