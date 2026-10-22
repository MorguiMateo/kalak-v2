import type { ImageKey } from "@/lib/images";

// Texts copied literally from Kalak/src/app/perros/page.tsx and gatos/page.tsx.

type Ingredient = { name: string; percent: string; text: string; image: ImageKey; alt: string };

export type SpeciesContent = {
  banner: ImageKey;
  eyebrow: string;
  title: string;
  intro: { title: string; text: string };
  formula: { eyebrow: string; title: string; proteinPercent: string; proteinLabel: string };
  ingredientsTitle: string;
  proteins: { title: string; items: Ingredient[] };
  vegetables: { title: string; items: Ingredient[] };
  benefitsTitle: string;
  benefits: { title: string; text: string }[];
};

export const dogs: SpeciesContent = {
  banner: "perroComiendo",
  eyebrow: "Nutrición Premium",
  title: "Alimentación Natural para Perros",
  intro: {
    title: "Nutrición Excepcional para Cada Etapa",
    text: "Nuestro alimento para perros está específicamente formulado para proporcionar una nutrición equilibrada en cada etapa de la vida de tu mascota. Desde cachorros hasta perros mayores, nuestra fórmula especial con ingredientes de calidad superior garantiza que tu compañero reciba todo lo que necesita para una vida larga y saludable.",
  },
  formula: { eyebrow: "Fórmula Premium", title: "Fórmula Perro", proteinPercent: "70%", proteinLabel: "Proteína Animal" },
  ingredientsTitle: "Ingredientes Premium",
  proteins: {
    title: "Proteínas (70%)",
    items: [
      { name: "Carne de Pollo", percent: "50%", image: "polloFondoBlanco", alt: "Carne de pollo", text: "Proteína magra de alta calidad que proporciona aminoácidos esenciales para el desarrollo muscular." },
      { name: "Hígado Vacuno", percent: "10%", image: "higadoVacuno", alt: "Hígado vacuno", text: "Rico en vitaminas A, D, E, K y del complejo B. Excelente fuente de hierro y zinc." },
      { name: "Corazón Vacuno", percent: "5%", image: "corazonDePollo", alt: "Corazón vacuno", text: "Fuente de proteínas y taurina, fundamental para el correcto funcionamiento cardíaco." },
      { name: "Sesos", percent: "5%", image: "sesos", alt: "Sesos", text: "Rico en ácidos grasos omega-3 y fosfolípidos esenciales para el desarrollo cerebral." },
    ],
  },
  vegetables: {
    title: "Vegetales (30%)",
    items: [
      { name: "Zapallo Orgánico", percent: "25%", image: "calabaza", alt: "Zapallo orgánico", text: "Excelente fuente de fibra y beta-carotenos. Ayuda a regular el tránsito intestinal." },
      { name: "Espinaca/Acelga", percent: "5%", image: "acelga", alt: "Espinaca/Acelga", text: "Ricas en vitaminas y minerales como calcio, hierro y magnesio. Aportan clorofila." },
    ],
  },
  benefitsTitle: "Beneficios Clave",
  benefits: [
    { title: "Sin Aditivos", text: "100% natural, sin conservantes ni aditivos artificiales" },
    { title: "Alta Digestibilidad", text: "Fácil de digerir y absorber por el organismo" },
    { title: "Mayor Energía", text: "Proporciona vitalidad y energía sostenida" },
    { title: "Pelaje Saludable", text: "Mejora el brillo y la calidad del pelaje" },
    { title: "Sistema Inmune", text: "Fortalece las defensas naturales" },
    { title: "Salud Intestinal", text: "Promueve una flora intestinal equilibrada" },
  ],
};

export const cats: SpeciesContent = {
  banner: "gatoComiendo",
  eyebrow: "Nutrición Premium",
  title: "Alimentación Natural para Gatos",
  intro: {
    title: "Nutrición Excepcional para Felinos",
    text: "Nuestra fórmula para gatos está especialmente diseñada para proporcionar una nutrición completa y equilibrada que satisface las necesidades específicas de los felinos. Con alto contenido de proteína animal de primera calidad, nuestra fórmula ayuda a mantener la masa muscular y proporciona los nutrientes esenciales que tu gato necesita para una vida saludable y activa.",
  },
  formula: { eyebrow: "Fórmula Premium", title: "Fórmula Gatos", proteinPercent: "80%", proteinLabel: "Proteína Animal" },
  ingredientsTitle: "Ingredientes Premium",
  proteins: {
    title: "Proteínas (80%)",
    items: [
      { name: "Carne de Pollo", percent: "60%", image: "polloFondoBlanco", alt: "Carne de pollo", text: "Proteína magra de alta calidad que aporta taurina, un aminoácido esencial para los felinos." },
      { name: "Hígado Vacuno", percent: "10%", image: "higadoVacuno", alt: "Hígado vacuno", text: "Rico en vitaminas A, D, E, K y del complejo B. Aporta hierro y zinc para la salud felina." },
      { name: "Corazón Vacuno", percent: "5%", image: "corazonDePollo", alt: "Corazón vacuno", text: "Fuente de taurina y coenzima Q10, fundamentales para la salud cardíaca felina." },
      { name: "Sesos", percent: "5%", image: "sesos", alt: "Sesos", text: "Rico en ácidos grasos omega-3 y fosfolípidos esenciales para el desarrollo cerebral y cognitivo." },
    ],
  },
  vegetables: {
    title: "Vegetales (20%)",
    items: [
      { name: "Zapallo Orgánico", percent: "15%", image: "calabaza", alt: "Zapallo orgánico", text: "Excelente fuente de fibra y beta-carotenos. Ayuda a regular el tránsito intestinal y prevenir bolas de pelo." },
      { name: "Espinaca/Acelga", percent: "5%", image: "acelga", alt: "Espinaca/Acelga", text: "Ricas en vitaminas y minerales como calcio, hierro y magnesio. Aportan clorofila para mejor digestión." },
    ],
  },
  benefitsTitle: "Beneficios Clave",
  benefits: [
    { title: "Sin Aditivos", text: "100% natural, sin conservantes ni aditivos artificiales" },
    { title: "Alta Digestibilidad", text: "Fácil de digerir y absorber por el organismo felino" },
    { title: "Mayor Vitalidad", text: "Proporciona energía y mejora la actividad diaria" },
    { title: "Pelaje Brillante", text: "Mejora el brillo y reduce la caída del pelo" },
    { title: "Sistema Inmune", text: "Fortalece las defensas naturales" },
    { title: "Salud Urinaria", text: "Contribuye al mantenimiento del tracto urinario" },
  ],
};
