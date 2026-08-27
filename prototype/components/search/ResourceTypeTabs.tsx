"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CANDIDATE_TYPES, TAB_TYPES } from "@/lib/config";
import { typeLabel, typeTabLabel } from "@/lib/data";
import type { ResourceType } from "@/lib/types";

const ALL = "all";

/** Tabs on a single line: the bar scrolls rather than wrapping. */
const TRIGGER_CLASS = "h-full flex-none px-3";

/**
 * Navigation level 1: one resource type at a time.
 * Rendered as a segmented control (grey track, active tab as a white pill) so
 * it is never confused with the cumulative level-2 filters.
 */
export default function ResourceTypeTabs({
  value,
  onChange,
}: {
  value: ResourceType | null;
  onChange: (type: ResourceType | null) => void;
}) {
  // overflow-y-hidden: avoids a spurious 1px vertical scrollbar.
  return (
    <div className="overflow-x-auto overflow-y-hidden py-0.5">
      <Tabs
        value={value ?? ALL}
        onValueChange={(next) => onChange(next === ALL ? null : (next as ResourceType))}
      >
        <TabsList aria-label="Type de ressource" className="h-10 w-max min-w-full justify-start">
          <TabsTrigger value={ALL} className={TRIGGER_CLASS}>
            Tous
          </TabsTrigger>

          {TAB_TYPES.map((type) => (
            <TabsTrigger key={type} value={type} className={TRIGGER_CLASS}>
              {/* Short label here, full label everywhere else (data/taxonomy.json). */}
              {typeTabLabel(type)}

              {/* Candidate types are flagged so they never read as validated scope. */}
              {CANDIDATE_TYPES.includes(type) ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="font-normal">
                      à valider
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {typeLabel(type)} — type de ressource candidat, à arbitrer avec l’association.
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
