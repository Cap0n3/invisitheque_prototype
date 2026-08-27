"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TAB_TYPES } from "@/lib/config";
import { getTaxonomy, typeLabel } from "@/lib/data";
import type { ResourceType } from "@/lib/types";

/**
 * Demo form: light validation, success state,
 * no persistence, no sending, no upload (spec 20).
 */
export default function ContributionForm() {
  const [type, setType] = useState<ResourceType>("professional");
  const [disorders, setDisorders] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isProfessional = type === "professional";
  const isContent = type === "cultural_content" || type === "practical_tool";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const missing: string[] = [];

    if (!String(data.get("title") ?? "").trim()) missing.push("le nom de la ressource");
    if (!String(data.get("link") ?? "").trim()) missing.push("un lien");
    if (!String(data.get("why") ?? "").trim()) missing.push("la raison de votre recommandation");
    if (!consent) missing.push("la confirmation en bas du formulaire");

    setErrors(missing);
    if (missing.length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card role="status">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 aria-hidden="true" className="text-primary" />
            Merci, votre proposition est enregistrée.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Elle sera relue par des bénévoles de l’association avant publication.{" "}
            <Badge variant="secondary" className="font-normal">
              démo : rien n’est envoyé
            </Badge>
          </p>
          <ButtonGroup>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Proposer une autre ressource
            </Button>
            <Button asChild variant="ghost">
              <Link href="/search">Retour à la recherche</Link>
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="type">Type de ressource</FieldLabel>
              <NativeSelect
                id="type"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value as ResourceType)}
              >
                {TAB_TYPES.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {typeLabel(value)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>

            <Field>
              <FieldLabel htmlFor="title">Nom de la ressource *</FieldLabel>
              <Input id="title" name="title" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="objective">Objectif principal</FieldLabel>
              <NativeSelect id="objective" name="objective">
                {getTaxonomy("objectives").map((item) => (
                  <NativeSelectOption key={item.id} value={item.id}>
                    {item.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>

            <Field>
              <FieldLabel>Types de troubles concernés</FieldLabel>
              <ToggleGroup
                type="multiple"
                variant="outline"
                size="sm"
                value={disorders}
                onValueChange={setDisorders}
                className="flex flex-wrap justify-start gap-1.5"
              >
                {getTaxonomy("disorderCategories").map((item) => (
                  <ToggleGroupItem
                    key={item.id}
                    value={item.id}
                    className="rounded-full data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {item.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldDescription>Plusieurs choix possibles.</FieldDescription>
            </Field>

            {/* The form adapts slightly to the selected type. */}
            {isProfessional ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="country">Pays</FieldLabel>
                  <NativeSelect id="country" name="country">
                    {getTaxonomy("countries").map((item) => (
                      <NativeSelectOption key={item.id} value={item.id}>
                        {item.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
                <Field>
                  <FieldLabel htmlFor="mode">Mode de consultation</FieldLabel>
                  <NativeSelect id="mode" name="mode">
                    {getTaxonomy("consultationModes").map((item) => (
                      <NativeSelectOption key={item.id} value={item.id}>
                        {item.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              </div>
            ) : null}

            {isContent ? (
              <Field>
                <FieldLabel htmlFor="format">Format</FieldLabel>
                <NativeSelect id="format" name="format">
                  {getTaxonomy("mediaFormats").map((item) => (
                    <NativeSelectOption key={item.id} value={item.id}>
                      {item.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="link">Lien vers la ressource *</FieldLabel>
                <Input id="link" name="link" placeholder="https://" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="location">Localisation</FieldLabel>
                <Input id="location" name="location" placeholder="Ville, pays" />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="contact">Contact (facultatif)</FieldLabel>
              <Input id="contact" name="contact" placeholder="E-mail ou téléphone" />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" name="description" maxLength={400} />
              <FieldDescription>400 caractères maximum.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="why">Pourquoi recommandez-vous cette ressource ? *</FieldLabel>
              <Textarea id="why" name="why" maxLength={400} required />
            </Field>

            <Field>
              <FieldLabel htmlFor="image">Image (facultatif)</FieldLabel>
              <Input id="image" name="image" type="file" disabled />
              <FieldDescription>Envoi de fichier désactivé dans le prototype.</FieldDescription>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(value) => setConsent(value === true)}
              />
              <FieldLabel htmlFor="consent" className="font-normal">
                Je confirme que cette proposition peut être relue et publiée par l’association. *
              </FieldLabel>
            </Field>

            {errors.length > 0 ? (
              <FieldError role="alert">Merci de compléter : {errors.join(", ")}.</FieldError>
            ) : null}

            <Button type="submit" className="w-fit">
              Envoyer ma proposition
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
