import type { Supplement } from "./suplementos";

// Cards follow the old page order; detail sections there were cúrcuma, caldo, calcio, vinagre.
export const supplementItems: Supplement[] = [
  {
    id: "calcio",
    name: "Carbonato de Calcio",
    summary:
      "Suplemento natural obtenido de cáscaras de huevo, compuesto por 95% de carbonato de calcio. Altamente biodisponible para fortalecer huesos, dientes y apoyar funciones fisiológicas esenciales en mascotas de todas las edades.",
    image: "calcio1",
    price: "calcio",
    detailsTitle: "Beneficios de nuestro Carbonato de Calcio",
    groups: [
      {
        title: "Fuente natural de calcio",
        items: [
          "Obtenido de cáscaras de huevo (95% carbonato de calcio)",
          "Altamente biodisponible y fácilmente absorbido en reemplazo de los huesos en la dieta",
          "Contiene trazas de magnesio, fósforo y zinc",
        ],
      },
      {
        title: "Salud ósea y dental",
        items: [
          "Fundamental para el equilibrio metabolico y desarrollo de cartilago y huesos",
          "Crucial para cachorros y animales en crecimiento",
          "Esencial para hembras gestantes y lactantes",
        ],
      },
      {
        title: "Funciones fisiológicas",
        items: [
          "Apoya la contracción muscular adecuada",
          "Contribuye a la coagulación sanguínea",
          "Favorece la función nerviosa normal",
        ],
      },
      {
        title: "Beneficios adicionales",
        items: [
          "Equilibra la proporción calcio-fósforo en dietas caseras",
          "Ayuda a normalizar la función intestinal",
          "Dosis recomendada: ½ cucharadita/10kg, 2-3 veces por semana",
        ],
      },
    ],
  },
  {
    id: "curcuma",
    name: "Cúrcuma Activada",
    summary:
      "Potente suplemento antiinflamatorio, antioxidante y digestivo. Formulado con cúrcuma y pimienta negra para su máxima absorción y beneficios para la salud articular, digestiva e inmunológica de tu mascota.",
    image: "curcuma1",
    position: "50% 80%",
    price: "curcuma",
    detailsTitle: "Beneficios de nuestra Cúrcuma Activada",
    groups: [
      {
        title: "Propiedades antiinflamatorias",
        items: [
          "Reduce inflamación del tracto intestinal, hígado y articulaciones",
          "Ayuda con artritis, artrosis y enfermedad periodontal",
          "Beneficiosa para fibrosis hepática y enfermedad intestinal",
        ],
      },
      {
        title: "Propiedades antioxidantes",
        items: ["Ayuda a prevenir el cáncer de piel", "Reduce y modula la inflamación", "Combate el estrés oxidativo"],
      },
      {
        title: "Salud digestiva",
        items: ["Mejora la digestión de alimentos", "Protege el revestimiento estomacal", "Combate acidez, úlceras y gastritis"],
      },
      {
        title: "Fórmula optimizada",
        items: ["Pimienta negra: Aumenta un 85%la absorción de curcumina", "Rico en vitaminas C, E, K y minerales esenciales"],
      },
    ],
  },
  {
    id: "colageno",
    name: "Caldo de Colágeno",
    summary:
      "Un suplemento nutritivo elaborado al cocer a baja temperatura garras de pollo. Rico en colágeno, gelatina y minerales esenciales para mejorar la salud digestiva, articular y el bienestar general de tu mascota.",
    image: "caldo1",
    price: "caldo",
    detailsTitle: "Beneficios de nuestro Caldo de Colágeno",
    groups: [
      {
        title: "Propiedades nutricionales",
        items: [
          "Alto contenido de colágeno para la salud de piel y tejidos conectivos",
          "Gelatina que ayuda a recubrir y calmar el tracto intestinal",
          "Hidratacion completa: aporta agua y macronutrientes esenciales",
          "Aminoácidos esenciales: glicina, prolina y arginina",
        ],
      },
      {
        title: "Rico en minerales",
        items: ["Calcio y fósforo para la salud ósea", "Magnesio para la función muscular", "Potasio para la salud cardiovascular"],
      },
      {
        title: "Salud digestiva",
        items: [
          "Desinflama y repara el revestimiento intestinal",
          "Beneficioso para mascotas con problemas digestivos, dermatológicos y osteoarticulares",
          "Favorece la absorción de nutrientes",
        ],
      },
      {
        title: "Beneficios adicionales",
        items: ["Equilibrio electrolítico en el cuerpo", "Contribuye a la hidratación", "Preparado artesanalmente con garras de pollo"],
      },
    ],
  },
  {
    id: "vinagre",
    name: "Vinagre de sidra de manzana",
    summary:
      "Suplemento natural con múltiples beneficios para la salud digestiva y el equilibrio del pH. Estimula el apetito, mejora la digestión y aporta nutrientes esenciales que favorecen la salud integral de tu mascota.",
    image: "vinagre1",
    position: "50% 80%",
    price: "vinagre",
    detailsTitle: "Beneficios de nuestro Vinagre de sidra de manzana",
    groups: [
      {
        title: "Salud digestiva",
        items: ["Estimula el apetito y mejora la digestión", "Ayuda a mantener el pH intestinal óptimo", "Favorece el equilibrio de la microbiota"],
      },
      {
        title: "Propiedades nutricionales",
        items: [
          "Contiene minerales esenciales y antioxidantes",
          "Rico en ácido acético y polifenoles",
          "Aporta enzimas naturales beneficiosas",
          "Fuente de probióticos (levaduras y bacterias)",
        ],
      },
      {
        title: "Beneficios externos",
        items: [
          "Excelente para la salud de piel y pelaje",
          "Acción repelente natural contra parásitos externos",
          "Alivia picaduras e irritaciones cutáneas",
        ],
      },
      {
        title: "Usos recomendados",
        items: [
          "Dosis interna: 10-15 gotas por cada 5kg de peso en agua o comida",
          "Uso tópico: Diluido al 50% en agua para enjuagues o sprays",
          "Ideal para problemas digestivos, articulares y dermatológicos",
        ],
      },
    ],
  },
];
