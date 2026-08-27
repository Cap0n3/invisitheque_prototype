import Link from "next/link";
import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NAV = [
  { href: "/search", label: "Rechercher" },
  { href: "/contribute", label: "Contribuer" },
  { href: "/about", label: "À propos" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-6 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="size-5 rounded-full border-4 border-card bg-primary ring-1 ring-primary"
          />
          L’Invisithèque
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {NAV.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Personal accounts belong to phase 3: visual only. */}
        <Badge variant="secondary" className="ml-auto gap-1 max-sm:hidden">
          <UserRound aria-hidden="true" />
          Compte (E3)
        </Badge>
      </div>
    </header>
  );
}
