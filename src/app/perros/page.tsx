import type { Metadata } from "next";
import { SpeciesPage } from "@/components/page/SpeciesPage";
import { dogs } from "@/content/species";

export const metadata: Metadata = {
  title: "Perros",
  description: "Fórmula natural Kalak para perros: 70% proteína animal y vegetales frescos, sin aditivos.",
};

export default function PerrosPage() {
  return <SpeciesPage content={dogs} highlight="Perros" />;
}
