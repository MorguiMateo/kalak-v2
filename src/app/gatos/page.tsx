import type { Metadata } from "next";
import { SpeciesPage } from "@/components/page/SpeciesPage";
import { cats } from "@/content/species";

export const metadata: Metadata = {
  title: "Gatos",
  description: "Fórmula natural Kalak para gatos: 80% proteína animal y vegetales frescos, sin aditivos.",
};

export default function GatosPage() {
  return <SpeciesPage content={cats} highlight="Gatos" />;
}
