import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import ResourceGrid from "@/components/ResourceGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resources } from "@/lib/data";
import { getHighlightReason } from "@/lib/sorting";

/** 3 to 5 representative resources: curated pick, partnership, upcoming circle. */
const featured = resources.filter((r) => getHighlightReason(r) !== null).slice(0, 4);

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <HomeSearch />

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-2xl">À la une</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/search">Voir toutes les ressources</Link>
          </Button>
        </div>
        <p className="text-muted-foreground">
          Ces ressources remontent pour une raison explicite : sélection de l’association,
          partenariat, ou cercle mieux-être à venir.
        </p>
        <ResourceGrid resources={featured} />
      </section>

      <section className="mt-10">
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-prose space-y-1">
              <h2 className="text-xl">Une ressource manque ?</h2>
              <p className="text-muted-foreground">
                L’Invisithèque se construit avec la communauté : proposez une ressource, elle sera
                vérifiée par des bénévoles avant publication.
              </p>
            </div>
            <Button asChild>
              <Link href="/contribute">Proposer une ressource</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
