import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

export const metadata = {
  title: "À propos du prototype – L’Invisithèque",
};

/** Workshop support page: what the prototype is, and what it is not. */
const OPEN_QUESTIONS = [
  "Les types de ressources sont-ils les bons ? (« Outils pratiques » et « Programmes et formations » sont proposés à titre de test)",
  "Quels filtres doivent rester visibles, et lesquels vont sous « Plus de filtres » ?",
  "Le badge « Vérifié par Les Invisibles » doit-il apparaître sur les cartes ? Selon quels critères ?",
  "Les filtres par famille d’accompagnement suffisent-ils, ou faut-il aussi la spécialité ?",
  "Que doit afficher une carte de résultat ? Trop, pas assez ?",
  "Les cartes de résultat se ressemblent toutes : faut-il un moyen de distinguer les ressources mises en avant ?",
  "Signaler l’absence de ressource et proposer une ressource : deux parcours ou un seul ?",
  "Le tri par avis doit-il exister dès la V1, alors que les avis arrivent à l’étape 3 ?",
];

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions ouvertes pour l’atelier</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {OPEN_QUESTIONS.map((question, index) => (
              <Item key={question} size="sm" className="border-transparent px-0">
                <ItemMedia>
                  <Badge variant="secondary">{index + 1}</Badge>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="font-normal text-muted-foreground">{question}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  );
}
