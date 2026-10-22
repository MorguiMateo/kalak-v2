import type { Block, Inline } from "./rich";

// Texts copied literally from the old Home (Kalak/src/app/page.tsx).

export const hero = {
  eyebrow: "Alimentación natural · Mendoza",
  title: "Comida real para mascotas",
  highlight: "real",
  subtitle: "Naturalmente deliciosa, Profesionalmente formulada",
  imageAlt: "Raw food for pets",
};

export const statement = {
  title: ["Cambia la vida de tus mascotas con la ", "alimentación natural"] as const,
  body: <Inline[]>[
    "Sabemos que lo mejor para tu perro o gato es volver a lo esencial: una ",
    { b: "verdadera alimentación natural" },
    ". Por eso, nuestros productos están hechos con ",
    { b: "ingredientes frescos y de calidad" },
    ", sin conservantes, sin colorantes y, por supuesto… ",
    { b: "¡nada de procesados!" },
  ],
};

export const benefits = [
  { image: "olgaApetito", alt: "Imagen 1", text: "Mejora el apetito, la digestión y la hidratación." },
  { image: "caquita", alt: "Imagen 2", text: "Menos gases, menos cacas, y menos olor." },
  { image: "muchosGatos", alt: "Imagen 3", text: "Potencia el sistema inmune y retrasa el envejecimiento." },
  { image: "tiniBrillante", alt: "Imagen 4", text: "Piel y pelo, fuertes y sanos.", position: "50% 25%" },
] as const;

export const ingredients = {
  title: ["Fórmulas ", "completas y balanceadas", " con ingredientes de calidad"] as const,
  items: [
    { image: "polloFondoBlanco", alt: "Carne de pollo y sus nutrientes", name: "Carne de Pollo", text: "Rico en proteínas magras" },
    { image: "carne", alt: "Carne de vaca y sus nutrientes", name: "Carne de Vaca", text: "Alta en proteínas y zinc" },
    { image: "higadoVacuno", alt: "Hígado vacuno y sus nutrientes", name: "Hígado", text: "Aporte de vitamina A y B" },
    { image: "sesos", alt: "Seso vacuno y sus nutrientes", name: "Seso", text: "Rico en ácidos grasos omega-3" },
    { image: "acelga", alt: "Acelga", name: "Acelga", text: "Alta en fibra y vitamina K" },
    { image: "calabaza", alt: "Calabaza", name: "Calabaza", text: "Fibra digestiva y betacaroteno" },
    { image: "corazonDePollo", alt: "Corazón vacuno y sus nutrientes", name: "Corazón", text: "Fuente de CoQ10 y hierro" },
  ],
} as const;

export const faq: { title: string; items: { question: string; answer: Block[] }[] } = {
  title: "Preguntas Frecuentes",
  items: [
    {
      question: "¿Qué beneficios tiene la alimentación natural?",
      answer: [
        { p: ["La alimentación natural para perros y gatos ofrece muchísimos beneficios:"] },
        {
          ul: [
            [{ b: "Ingredientes frescos:" }, " Utiliza carne de pollo y verduras frescas, lo que significa que tu mascota recibe nutrientes de alta calidad."],
            [{ b: "Sin aditivos ni conservantes:" }, " Al no tener químicos, reduce el riesgo de alergias y problemas de salud."],
            [{ b: "Mejor digestión:" }, " La comida natural es más fácil de digerir, lo que ayuda a mantener un sistema digestivo sano y reduce problemas como vómitos, mal aliento, pérdida de pelo, etc."],
            [{ b: "Pelaje brillante y piel sana:" }, " Los nutrientes de la comida natural contribuyen a un pelaje más brillante y una piel menos irritada."],
            [{ b: "Energía y vitalidad:" }, " Los ingredientes frescos y equilibrados de nuestras fórmulas proporcionan la energía necesaria para que tu mascota esté activa y feliz."],
            [{ b: "Control de peso:" }, " Las dietas naturales permiten un mejor control del peso (evitando ingredientes llenos de calorías vacías) y proporcionando una nutrición de alta calidad."],
            [{ b: "Menos problemas de salud:" }, " Una alimentación adecuada puede prevenir enfermedades, mejorar la calidad de vida de tu mascota, y retardar el envejecimiento."],
          ],
        },
      ],
    },
    {
      question: "¿Cómo debo hacer la transición a la comida Kalak?",
      answer: [
        { p: ["Cambiar la dieta de tu mascota de alimentos comerciales a comida natural debe hacerse de forma gradual, no solo para evitar problemas digestivos como diarrea o vómitos sino entendiendo que puede costarles incorporar algunos ingredientes nuevos."] },
        {
          ol: [
            {
              title: "Preparación y Planeación:",
              items: [
                "Consulta con tu veterinario sobre el estado de salud de tu mascota",
                "Elige ingredientes frescos y de calidad",
                "Consigue una balanza de cocina para medir las cantidades adecuadamente",
              ],
            },
            {
              title: "Cambio Gradual (La Regla del 13 Días):",
              items: [
                "Día 1-5: Empieza con 60% de comida natural y 40% de comida comercial",
                "Día 6-10: Aumenta a 80% de comida natural y 20% de comida comercial",
                "Después del Día 11: Si no hay problemas digestivos, cambia completamente a comida natural",
              ],
            },
            {
              title: "Monitoreo y Seguimiento:",
              items: [
                "Observa cómo se siente tu mascota durante todo el proceso",
                "Si notas problemas digestivos, reduce las cantidades y aumenta la hidratación con caldo de colágeno",
                "Enriquece su microbiota con yogur natural o kéfir",
                "Ten en cuenta que el tiempo de adaptación es diferente para cada animal",
              ],
            },
          ],
        },
        { p: ["La paciencia es clave para tener éxito en esta etapa. Una vez incorporada la dieta natural, es muy importante tener un seguimiento clínico médico veterinario para saber que vas por un camino seguro y exitoso para tus bichitos."] },
      ],
    },
    {
      question: "¿Cómo debo almacenar la comida?",
      answer: [
        { p: ["La comida debe mantenerse congelada hasta el momento de su uso. Una vez descongelada, puede conservarse en el refrigerador hasta 3 días. Utilizando el cierre tipo ziploc para evitar la contaminación de la comida. Recomendamos descongelar solo la porción que se va a utilizar."] },
      ],
    },
    {
      question: "¿De qué manera se puede ofrecer la comida?",
      answer: [
        {
          p: [
            "KALAK puede ofrecerse ",
            { accent: "cocido" },
            " (a la plancha, al vapor, al microondas, olla antiadherente, etc...), ",
            { accent: "semicocido" },
            " o ",
            { accent: "crudo" },
            " siempre que se hiciera la adaptación adecuada.",
          ],
        },
      ],
    },
    {
      question: "¿La comida es apta para todas las razas y edades?",
      answer: [
        { p: ["Sí, nuestras fórmulas están diseñadas para adaptarse a las necesidades nutricionales de perros de todas las razas y etapas de vida. Sin embargo, recomendamos consultar con tu veterinario para casos específicos o condiciones especiales de salud."] },
      ],
    },
  ],
};

export const cta = {
  title: ["¿Listo para mejorar la alimentación de ", "tu mascota", "?"] as const,
};
