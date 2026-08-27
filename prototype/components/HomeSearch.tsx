"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CANDIDATE_TYPES, TAB_TYPES } from "@/lib/config";
import { typeLabel } from "@/lib/data";

/** Home page shortcuts - they lead to a pre-filtered /search. */
const QUICK_FILTERS = [
  { label: "Être accompagné·e", href: "/search?objectives=etre_accompagne" },
  { label: "Troubles liés à la fatigue", href: "/search?disorderCategories=troubles_fatigue" },
  { label: "En Suisse", href: "/search?type=professional&countries=CH" },
  { label: "En visio", href: "/search?type=professional&consultationModes=remote" },
  { label: "Gratuit", href: "/search?pricing=free" },
];

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="py-12">
      <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
        Un repère de confiance entre pair·es
      </p>

      <h1 className="mb-3 text-4xl sm:text-5xl">
        Trouver des ressources fiables pour mieux vivre avec l’Invisible
      </h1>

      <p className="mb-6 text-lg text-muted-foreground">
        Professionnel·les, contenus, dispositifs de soutien et institutions, recommandés par des
        personnes concernées et vérifiés par l’association Les Invisibles.
      </p>

      <form
        role="search"
        className="mb-5 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
        }}
      >
        <Field className="flex-1">
          <FieldLabel htmlFor="home-search" className="sr-only">
            Que recherchez-vous ?
          </FieldLabel>
          <InputGroup className="h-11">
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="home-search"
              type="search"
              placeholder="Que recherchez-vous ?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        </Field>
        <Button type="submit" size="lg">
          Rechercher
        </Button>
      </form>

      <div className="mb-4 space-y-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Parcourir par type
        </p>
        <nav aria-label="Types de ressources" className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/search">Tous</Link>
          </Button>
          {TAB_TYPES.map((type) => (
            <Button key={type} asChild variant="outline" size="sm">
              <Link href={`/search?type=${type}`}>
                {typeLabel(type)}
                {CANDIDATE_TYPES.includes(type) ? (
                  <Badge variant="secondary" className="font-normal">
                    à valider
                  </Badge>
                ) : null}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filtres rapides :</span>
        {QUICK_FILTERS.map((filter) => (
          <Badge key={filter.label} asChild variant="outline" className="h-7 px-3 font-normal">
            <Link href={filter.href}>{filter.label}</Link>
          </Badge>
        ))}
      </div>
    </section>
  );
}
