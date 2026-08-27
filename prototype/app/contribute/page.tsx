import ContributionForm from "@/components/ContributionForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export const metadata = {
  title: "Proposer une ressource – L’Invisithèque",
};

const STEPS = [
  {
    title: "Proposition",
    text: "Vous partagez une ressource qui vous a aidé·e, avec quelques informations de base.",
  },
  {
    title: "Vérification",
    text: "Des bénévoles qualifié·es de l’association la relisent selon des critères définis.",
  },
  {
    title: "Publication",
    text: "La ressource rejoint l’Invisithèque et devient visible pour toute la communauté.",
  },
];

export default function ContributePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-6 max-w-prose space-y-2">
        <h1 className="text-3xl">Proposer une ressource</h1>
        <p className="text-muted-foreground">
          L’Invisithèque est construite par et pour les personnes concernées. Si une ressource vous
          a aidé·e, partagez-la.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <ContributionForm />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comment ça se passe ?</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {STEPS.map((step, index) => (
                <Item key={step.title} size="sm" className="border-transparent px-0">
                  <ItemMedia>
                    <Badge aria-hidden="true">{index + 1}</Badge>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{step.title}</ItemTitle>
                    <ItemDescription>{step.text}</ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
