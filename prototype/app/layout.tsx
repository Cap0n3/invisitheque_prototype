import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "L’Invisithèque – prototype",
  description:
    "Prototype d’interface pour l’Invisithèque, moteur de recherche de ressources fiables pour mieux vivre avec l’Invisible.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Aller au contenu
        </a>

        <TooltipProvider>
          <Header />
          <main id="contenu">{children}</main>
        </TooltipProvider>

        <footer className="mt-16 border-t py-6">
          <p className="mx-auto w-full max-w-6xl px-6 text-sm text-muted-foreground">
            Prototype d’interface – données fictives, aucune ressource réelle. Réalisé pour valider
            l’organisation des filtres et des fiches avec l’association Les Invisibles.
          </p>
        </footer>

        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
