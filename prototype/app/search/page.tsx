import { Suspense } from "react";
import SearchClient from "@/components/search/SearchClient";

export const metadata = {
  title: "Rechercher – L’Invisithèque",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto w-full max-w-6xl px-6 py-8 text-muted-foreground">Chargement…</div>}
    >
      <SearchClient />
    </Suspense>
  );
}
