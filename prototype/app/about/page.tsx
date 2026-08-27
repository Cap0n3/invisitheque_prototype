import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "À propos du prototype – L’Invisithèque",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-6 py-8">
      <h1 className="text-3xl">À propos de ce prototype</h1>

      <Alert>
        <Info aria-hidden="true" />
        <AlertTitle>Ce que c’est</AlertTitle>
        <AlertDescription>
          <p>
            Une maquette interactive de l’Invisithèque, construite pour discuter concrètement de
            l’organisation des filtres, des résultats et des fiches avec l’association.
          </p>
          <p>
            Toutes les données sont fictives. Les personnes, lieux et organisations présentés
            n’existent pas.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ce que ce n’est pas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>pas de base de données, pas de compte, pas de back-office ;</li>
            <li>pas de design final : couleurs et typographies sont volontairement neutres ;</li>
            <li>
              pas de moteur de recherche réel : la recherche fait une simple correspondance de
              texte ;
            </li>
            <li>rien n’est enregistré, ni les propositions, ni les favoris, ni les avis.</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
