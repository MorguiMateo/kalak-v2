import type { Metadata } from "next";
import { Wizard } from "@/features/ration-wizard/Wizard";

export const metadata: Metadata = {
  title: "Calcula su ración",
  description: "Calculá la ración diaria de comida natural Kalak para tu perro o gato.",
};

export default function CalculaRacionPage() {
  return <Wizard />;
}
