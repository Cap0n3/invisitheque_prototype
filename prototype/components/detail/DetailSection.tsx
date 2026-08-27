import { ExternalLink, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

/** Detail block: same shell for all three record structures. */
export function DetailSection({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">{children}</CardContent>
    </Card>
  );
}

/** Key/value list, used by all three record types. */
export function DataList({ rows }: { rows: Array<{ label: string; value: React.ReactNode }> }) {
  return (
    <ItemGroup>
      {rows.map((row, index) => (
        <span key={row.label}>
          {index > 0 ? <ItemSeparator /> : null}
          <Item size="xs" className="border-transparent px-0">
            <ItemContent>
              <ItemTitle className="font-normal text-muted-foreground">{row.label}</ItemTitle>
            </ItemContent>
            <ItemActions className="text-right font-medium">{row.value}</ItemActions>
          </Item>
        </span>
      ))}
    </ItemGroup>
  );
}

/**
 * Link list (contacts, social profiles, accessing the resource).
 * These are outbound links: they open in a new tab, flagged with an icon, so
 * the user does not lose the Invisithèque. Internal navigation, by contrast,
 * stays in the current tab.
 */
export function LinkList({
  links,
}: {
  links: Array<{ label: string; href?: string; icon?: LucideIcon }>;
}) {
  return (
    <ItemGroup>
      {links.map((link) => (
        <Item key={link.label} size="xs" className="border-transparent px-0" asChild={!!link.href}>
          {link.href ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <ItemContent>
                <ItemTitle className="text-primary underline underline-offset-4">
                  {link.icon ? <link.icon aria-hidden="true" className="size-4 shrink-0" /> : null}
                  {link.label}
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">(ouvre un nouvel onglet)</span>
                </ItemTitle>
              </ItemContent>
            </a>
          ) : (
            <ItemContent>
              <ItemTitle className="font-normal">
                {link.icon ? <link.icon aria-hidden="true" className="size-4 shrink-0" /> : null}
                {link.label}
              </ItemTitle>
            </ItemContent>
          )}
        </Item>
      ))}
    </ItemGroup>
  );
}
