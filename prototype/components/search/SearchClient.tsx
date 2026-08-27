"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, Bookmark, Search } from "lucide-react";
import { toast } from "sonner";
import ActiveFilterChips from "./ActiveFilterChips";
import EmptyState from "./EmptyState";
import FilterBar from "./FilterBar";
import ResourceTypeTabs from "./ResourceTypeTabs";
import ResourceGrid from "@/components/ResourceGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FILTER_GROUPS, PAGE_SIZE, SORT_OPTIONS } from "@/lib/config";
import { resources } from "@/lib/data";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterResources,
  getRelaxedSuggestions,
  pruneIrrelevantFilters,
} from "@/lib/filters";
import { searchResources } from "@/lib/search";
import { sortResources } from "@/lib/sorting";
import { buildSearchParams, parseSearchParams } from "@/lib/url";
import type { FilterState, MultiFilterKey, ResourceType, SortMode } from "@/lib/types";

/** Step label: makes the type -> filters hierarchy explicit. */
function StepLabel({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <Item size="xs" variant="muted" className="w-fit">
      <ItemContent>
        <ItemTitle className="gap-2 text-xs tracking-wide uppercase">
          <Badge variant="secondary" aria-hidden="true">
            {step}
          </Badge>
          {children}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    // Read once: from then on the component owns the state and writes it back to the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [query, setQuery] = useState(initial.query);
  const [filters, setFilters] = useState<FilterState>(initial.filters);
  const [sort, setSort] = useState<SortMode>(initial.sort);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const qs = buildSearchParams({ query, filters, sort });
    window.history.replaceState(null, "", qs ? `/search?${qs}` : "/search");
  }, [query, filters, sort]);

  const results = useMemo(() => {
    const searched = searchResources(resources, query);
    const filtered = filterResources(searched, filters);
    return sortResources(filtered, sort, query);
  }, [query, filters, sort]);

  const relaxed = useMemo(() => {
    if (results.length > 0) return null;
    const searched = searchResources(resources, query);
    const base = searched.length > 0 ? searched : resources;
    const { resources: suggestions, relaxedKeys } = getRelaxedSuggestions(base, filters);
    return { resources: sortResources(suggestions, sort, query).slice(0, 3), relaxedKeys };
  }, [results.length, query, filters, sort]);

  const visible = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;
  const activeCount = countActiveFilters(filters);

  function updateFilters(next: FilterState) {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  }

  function handleTypeChange(type: ResourceType | null) {
    // Compatible global filters are kept, the others are dropped.
    updateFilters(pruneIrrelevantFilters({ ...filters, resourceType: type }));
  }

  function toggleValue(key: MultiFilterKey, id: string) {
    const current = filters[key];
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    updateFilters({ ...filters, [key]: next });
  }

  function removeValue(key: MultiFilterKey, id: string) {
    updateFilters({ ...filters, [key]: filters[key].filter((value) => value !== id) });
  }

  function toggleVerified() {
    updateFilters({ ...filters, verifiedOnly: !filters.verifiedOnly });
  }

  function togglePartners() {
    updateFilters({ ...filters, partnersOnly: !filters.partnersOnly });
  }

  function resetAll() {
    setQuery("");
    updateFilters({ ...EMPTY_FILTERS });
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <h1 className="text-3xl">Rechercher une ressource</h1>

      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <Field>
          <FieldLabel htmlFor="search-input" className="sr-only">
            Que recherchez-vous ?
          </FieldLabel>
          <InputGroup className="h-11">
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="search-input"
              type="search"
              placeholder="Que recherchez-vous ? (fatigue, endométriose, podcast…)"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </InputGroup>
        </Field>
      </form>

      <section className="space-y-2">
        <StepLabel step={1}>Type de ressource — un seul choix</StepLabel>
        <ResourceTypeTabs value={filters.resourceType} onChange={handleTypeChange} />
      </section>

      <section className="space-y-2">
        <StepLabel step={2}>Filtres — cumulables</StepLabel>
        <FilterBar
          filters={filters}
          onToggleValue={toggleValue}
          onToggleVerified={toggleVerified}
          onTogglePartners={togglePartners}
          onReset={resetAll}
        />
      </section>

      <ActiveFilterChips
        filters={filters}
        onRemoveValue={removeValue}
        onClearType={() => handleTypeChange(null)}
        onToggleVerified={toggleVerified}
        onTogglePartners={togglePartners}
        onReset={resetAll}
      />

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p role="status">
          <strong>{results.length}</strong>
          {` ressource${results.length > 1 ? "s" : ""}`}
          {activeCount > 0
            ? ` · ${activeCount} filtre${activeCount > 1 ? "s" : ""} actif${activeCount > 1 ? "s" : ""}`
            : ""}
        </p>

        <div className="flex items-center gap-2">
          <FieldLabel htmlFor="sort-select" className="text-sm text-muted-foreground">
            Trier par
          </FieldLabel>
          <Select value={sort} onValueChange={(value) => setSort(value as SortMode)}>
            <SelectTrigger id="sort-select" size="sm" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Phase 3 (spec 21): visible, but explicitly not implemented. */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast("Sauvegarde des recherches", {
                    description: "Fonction prévue dans une phase ultérieure (étape 3).",
                  })
                }
              >
                <Bookmark aria-hidden="true" />
                Sauvegarder cette recherche
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Fonction prévue dans une phase ultérieure (comptes personnels, étape 3).
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="space-y-6">
          <ResourceGrid resources={visible} />

          <div className="flex flex-col items-center gap-2">
            {hasMore ? (
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                Charger plus ({results.length - visibleCount} restantes)
              </Button>
            ) : null}

            {visibleCount > PAGE_SIZE ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp aria-hidden="true" />
                Retour en haut
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <EmptyState query={query} />

          {relaxed && relaxed.resources.length > 0 ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-xl">Ressources susceptibles de vous aider</h2>
                {relaxed.relaxedKeys.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {`Sans le${relaxed.relaxedKeys.length > 1 ? "s" : ""} filtre${
                      relaxed.relaxedKeys.length > 1 ? "s" : ""
                    } ${relaxed.relaxedKeys
                      .map((key) => FILTER_GROUPS[key].label.toLowerCase())
                      .join(", ")}.`}
                  </p>
                ) : null}
              </div>
              <ResourceGrid resources={relaxed.resources} />
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
