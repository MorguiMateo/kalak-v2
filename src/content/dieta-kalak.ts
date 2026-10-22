import type { ImageKey } from "@/lib/images";

// Texts copied literally from Kalak/src/app/dieta-kalak/page.tsx.

type Option = {
  title: string;
  text: string;
  groups: { title: string; intro?: string; items: string[] }[];
};

type KeyInfo = { title: string; paragraphs: string[] } | { title: string; features: { title: string; text: string }[] };

const supplementsGroup: Option["groups"][number] = {
  title: "Suplementación Recomendada",
  intro: "Recomendamos una adecuada suplementación con:",
  items: ["Caldo de colágeno natural", "Carbonato de calcio", "Semillas de zapallo", "Omega 3"],
};

export const dietaKalak = {
  hero: { title: "Dieta Kalak", subtitle: "Alimentación Natural para tu Mascota", image: "olgaApetito" as ImageKey },
  why: {
    title: "¿Por qué elegir una dieta natural?",
    badges: ["100% Natural", "Más saludable", "Mayor vitalidad"],
    intro:
      "Si querés transformar su vida y estas considerando la alimentación natural, es super importante que empieces sabiendo donde estas parado: ¿Qué características particulares tiene tu mascota? ¿Qué etapa de la vida esta transitando? ¿Cómo esta la salud de tu compañero peludo? ¿Hay enfermedades que tengas que controlar? ¿Hay enfermedades que tengas que prevenir?",
    items: [
      {
        title: "Pasos recomendados antes de comenzar",
        text: "Para eso recomendamos que hagas un chequeo clínico veterinario, anota tus consultas, busca información confiable y charles en familia sobre el compromiso que están dispuestos a asumir para llevar adelante este cambio.",
      },
      {
        title: "Beneficios de la alimentación natural",
        text: "La alimentación puede convertirse en la solución definitiva para muchos problemas de salud que viven nuestros carnívoros domésticos, que tomamos como “normales o habituales”, como vómitos reiterados, sobrepeso, problemas urinarios, dermatitis, otitis, etc., así como en el mejor método preventivo para evitar que aparezcan estas enfermedades y el envejecimiento prematuro de nuestros bichos.",
      },
    ],
  },
  keyInfo: {
    title: "Información Clave",
    subtitle: "Todo lo que necesitas saber sobre alimentación natural",
    items: [
      {
        title: "¿En qué recipiente deben comer?",
        paragraphs: [
          "Los recipientes para comida y agua de nuestros perros y gatos deben ser lavados todos los días, y no solo enjuagados. Las bacterias que se encuentran en la boca de ellos normalmente, en otras superficies, como plástico, loza, vidrio, acero inoxidable, etc., generan un biofilm resistente que si no es removido por un lavado profuso y usando algún detergente o limpieza manual intensa, no sale! Por eso se siente como “resbalozo”.",
          "Los materiales más adecuados para estos utensilios son: acero inoxidable, loza, o vidrio en reemplazo del plástico, o siliconas, ya que estos puede agrietarse y albergar más bacterias que los otros materiales.",
          "Existen platos siliconados que, si bien pueden resultar estimulantes para la hora de comer, pueden romperse con más facilidad y generar microplásticos tóxicos para ellos.",
        ],
      },
      {
        title: "Características de nuestra alimentación",
        features: [
          {
            title: "Hidratante",
            text: "Los alimentos frescos, con su alto contenido en agua, facilitan la digestión y ayudan a prevenir problemas gastrointestinales, aportando nutrientes esenciales.",
          },
          {
            title: "Nutritiva",
            text: "Nos aseguramos de que cada menú Kalak esté perfectamente balanceado, usando ingredientes frescos y de calidad, para una nutrición óptima y saludable.",
          },
        ],
      },
    ] as KeyInfo[],
  },
  species: [
    {
      title: "Dieta Kalak para Perros",
      text: "Ofrecemos una gran variedad de menús para perros con comida natural que no contiene conservantes ni colorantes. Creamos diferentes opciones según la edad, raza y necesidades específicas.",
      href: "/perros",
      image: "perroComiendo" as ImageKey,
      alt: "Perro alimentándose con dieta Kalak",
    },
    {
      title: "Dieta Kalak para Gatos",
      text: "Los gatos tienen otras necesidades alimentarias, por eso hemos diseñado menús especiales para ellos. Notarás beneficios desde el primer momento con esta alimentación natural.",
      href: "/gatos",
      image: "gatoComiendo" as ImageKey,
      alt: "Gato alimentándose con dieta Kalak",
    },
  ],
  speciesCta: "Descubre más",
  options: {
    title: "Opciones de Alimentación Kalak",
    subtitle: "Encuentra la mejor manera de alimentar a tu mascota",
    quote:
      "“La alimentación de tu mascota debe adaptarse a sus necesidades específicas. Te presentamos todas las opciones para que elijas la que mejor se ajuste a tu situación.”",
    natural: {
      tab: "Dietas Naturales",
      title: "Dietas Naturales Kalak",
      subtitle: "Alimentos 100% naturales, sin colorantes, sin conservantes y sin ultraprocesados",
      items: [
        {
          title: "Dieta Kalak Cocida",
          text: "La dieta elaborada con ingredientes 100% naturales sin conservantes ni colorantes puede proporcionarse cocida o semicocida, especialmente cuando nuestros bichos se encuentran en un periodo de transición entre las dietas comerciales.",
          groups: [
            {
              title: "Beneficios Principales",
              items: [
                "Ideal para transición desde alimento comercial",
                "Reduce microorganismos en ingredientes crudos",
                "Perfecta para mascotas con sistema digestivo sensible",
                "Se mantiene hasta 4 días refrigerada",
              ],
            },
            {
              title: "Características",
              items: [
                "Mayor flexibilidad en la preparación",
                "Fácil digestión y asimilación",
                "Ideal para mascotas en transición alimentaria",
                "Conserva gran parte de los nutrientes esenciales",
              ],
            },
            supplementsGroup,
          ],
        },
        {
          title: "Dieta Kalak Cruda",
          text: "Las mismas fórmulas pueden ofrecerse crudas, previamente descongeladas y correctamente refrigeradas. Esta opción mantiene intactos todos los nutrientes naturales de los alimentos.",
          groups: [
            {
              title: "Beneficios Principales",
              items: [
                "Mantiene intactos todos los nutrientes naturales",
                "Enzimas digestivas activas y funcionales",
                "Mayor biodisponibilidad de nutrientes",
                "Mejora la salud dental y digestiva",
              ],
            },
            {
              title: "Características",
              items: [
                "Nutrientes y enzimas naturales intactos",
                "Ideal para mascotas ya adaptadas a dieta natural",
                "Incluye carbonato de calcio como suplemento",
                "Máximo aprovechamiento nutricional",
              ],
            },
            supplementsGroup,
          ],
        },
      ] as Option[],
    },
    commercial: {
      tab: "Dieta Comercial Suplementada",
      title: "Dieta Comercial Suplementada",
      subtitle: "Mejora la alimentación actual de tu mascota con nuestros suplementos naturales",
      facts: [
        {
          title: "La Realidad",
          text: "El alimento comercial facilita la rutina diaria, pero carece de muchos nutrientes esenciales que tu mascota necesita. Con nuestros suplementos naturales, puedes mejorar significativamente su nutrición sin cambiar radicalmente su dieta.",
        },
        {
          title: "Nuestros Suplementos",
          text: "Desarrollamos una línea completa de suplementos naturales que complementan perfectamente cualquier tipo de alimentación, mejorando la salud y bienestar de tu mascota.",
        },
      ],
      supplements: [
        { title: "Caldo de Colágeno", text: "Rico en aminoácidos y colágeno natural. Fortalece articulaciones, mejora la salud del pelo y la piel. Ideal para hidratar el alimento seco." },
        { title: "Probióticos Naturales", text: "Yogur natural, kéfir y vinagre de sidra de manzana. Mejoran la flora intestinal y fortalecen el sistema inmune." },
        { title: "Omega 3 Natural", text: "Aceite de pescado o krill de alta calidad. Esencial para el desarrollo cerebral, salud cardiovascular y pelaje brillante." },
        { title: "Semillas de Zapallo", text: "Ricas en ácidos grasos omega-3, zinc, magnesio y antioxidantes. Ayudan a la salud digestiva, fortalecen el sistema inmune y contribuyen a prevenir problemas urinarios y parásitos intestinales." },
      ],
      steps: [
        { title: "MÓJALO", text: "Hidrata con nuestro caldo de colágeno natural o agua tibia para facilitar la digestión y aportar nutrientes extra." },
        { title: "SUPLEMÉNTALO", text: "Agrega nuestros suplementos naturales: Caldo de colágeno, semillas de zapallo y cúrcuma activada." },
        { title: "EVITA HARINAS", text: "No agregues almidones. Nuestros suplementos están diseñados para complementar sin diluir el aporte proteico." },
      ],
    },
  },
  benefits: {
    title: "Beneficios para tu Mascota",
    subtitle: "La naturaleza es la mejor medicina",
    items: [
      { title: "Pelo más fuerte y sano", text: "Nutrientes esenciales que mejoran el brillo y la textura del pelaje" },
      { title: "Huesos y articulaciones sanas", text: "Calcio biodisponible y colágeno natural para fortalecer el sistema óseo" },
      { title: "Sistema inmunitario reforzado", text: "Antioxidantes y vitaminas que fortalecen las defensas naturales" },
      { title: "Digestión saludable", text: "Fibra natural y probióticos que favorecen una microbiota intestinal equilibrada" },
      { title: "Desarrollo cerebral óptimo", text: "Ácidos grasos esenciales para el desarrollo cognitivo y la salud ocular" },
    ],
  },
  cta: {
    title: "¿Listo para dar el siguiente paso?",
    text: "Transforma la vida de tu mascota con una alimentación más saludable y natural",
    button: "¡COMENZAR AHORA!",
  },
};
