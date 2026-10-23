import type { ImageKey } from "@/lib/images";

// Texts copied literally from Kalak/src/app/suplementos/page.tsx.

export type PriceKey = "calcio" | "curcuma" | "caldo" | "vinagre";

export type Supplement = {
  id: string;
  name: string;
  summary: string;
  image: ImageKey;
  position?: string;
  price: PriceKey;
  detailsTitle: string;
  groups: { title: string; items: string[] }[];
};

export const suplementos = {
  hero: { title: "Suplementos Naturales", subtitle: "Complementa la dieta natural de tu mascota", text: "Potencia la salud y bienestar de tu mascota con nuestros suplementos especialmente formulados", image: "caldo1" as ImageKey },
  badges: ["100% Naturales", "Alta calidad", "Comprobados"],
  listTitle: "Nuestros Suplementos",
  listSubtitle: "Formulados con ingredientes 100% naturales",
  detailsCta: "Ver Detalles",
  why: {
    title: "¿Por qué son importantes los suplementos en la dieta natural?",
    intro: "Incluso con una dieta natural equilibrada, algunos nutrientes pueden ser difíciles de proporcionar en las cantidades óptimas. Nuestros suplementos están diseñados para:",
    items: [
      { title: "Complementar nutrientes", text: "Complementar la dieta natural con micronutrientes esenciales" },
      { title: "Apoyar funciones específicas", text: "Apoyar funciones específicas del organismo según la edad y condición de tu mascota" },
      { title: "Prevenir deficiencias", text: "Prevenir deficiencias nutricionales comunes" },
      { title: "Mejorar calidad de vida", text: "Mejorar la calidad de vida y el bienestar general" },
    ],
  },
  quote:
    "“Todos nuestros suplementos están elaborados con ingredientes 100% naturales, sin conservantes ni aditivos artificiales, garantizando la máxima calidad y eficacia.”",
};
