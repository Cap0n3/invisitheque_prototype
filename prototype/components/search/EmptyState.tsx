"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquarePlus, Plus, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

/**
 * No exact result: never a dead end (spec 18).
 * Two distinct paths - propose a resource, or report a gap.
 */
export default function EmptyState({ query }: { query: string }) {
  const [showSignal, setShowSignal] = useState(false);
  const [signalSent, setSignalSent] = useState(false);
  const [topic, setTopic] = useState(query);

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Aucun résultat exact pour cette recherche.</EmptyTitle>
        <EmptyDescription>
          Cela ne veut pas dire qu’il n’existe rien : l’Invisithèque se construit avec la
          communauté.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <ButtonGroup>
          <Button asChild>
            <Link href="/contribute">
              <Plus aria-hidden="true" />
              Proposer une ressource
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setShowSignal((value) => !value)}>
            <MessageSquarePlus aria-hidden="true" />
            Signaler l’absence de ressource sur ma maladie
          </Button>
        </ButtonGroup>

        {showSignal && !signalSent ? (
          <form
            className="w-full max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              setSignalSent(true);
            }}
          >
            <Field>
              <FieldLabel htmlFor="signal-topic">
                Quelle maladie ou quel handicap cherchiez-vous ?
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="signal-topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Par exemple : endométriose"
                  required
                />
                <InputGroupButton type="submit" variant="default">
                  Envoyer
                </InputGroupButton>
              </InputGroup>
            </Field>
          </form>
        ) : null}

        {signalSent ? (
          <EmptyDescription role="status">
            Merci, c’est noté. L’association tiendra compte de cette demande dans ses prochaines
            recherches de ressources.{" "}
            <Badge variant="secondary" className="font-normal">
              démo
            </Badge>
          </EmptyDescription>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}
