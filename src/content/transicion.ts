import type { ImageKey } from "@/lib/images";

// Texts copied literally from Kalak/src/app/transicion/page.tsx.

export const transicion = {
  hero: { title: "Transición a Dieta Natural", subtitle: "Un cambio gradual para la salud de tu mascota", image: "olgaApetito" as ImageKey },
  badges: ["Sin prisa", "Progresivo", "Paso a paso"],
  intro: [
    "Cambiar a una alimentación natural requiere paciencia y un enfoque gradual. El sistema digestivo de tu mascota necesita tiempo para adaptarse a los nuevos alimentos y absorber correctamente todos los nutrientes.",
    "En esta guía encontrarás todos los pasos para realizar una transición exitosa, evitar problemas digestivos y lograr que tu mascota disfrute de todos los beneficios de una dieta natural balanceada.",
  ],
  how: {
    title: "¿Cómo hacer la transición a la dieta KALAK?",
    eyebrow: "HAZ EL CAMBIO DE MANERA PROGRESIVA",
    text: "El proceso de transición ideal suele durar entre 10 y 14 días, dependiendo de la sensibilidad digestiva de tu mascota. Durante este tiempo, en ingestas separadas, por ejemplo: desayuno con comercial (siempre hidratado!) y cena con KALAK cocido, irás aumentando gradualmente la proporción de comida natural mientras reduces la cantidad de alimento comercial. Finalmente, si no han surgido problemas digestivos (como vomitos o diarrea) podras cambiar completamente a la comida natural, e incorporar los suplementos recomendados para cada etapa.",
    images: [
      { image: "Transicion1" as ImageKey, alt: "Fase inicial de transición alimenticia: días 1 al 5, almuerzo 60% de alimento comercial y cena 40% de Kalak" },
      { image: "Transicion2" as ImageKey, alt: "Fase media de transición alimenticia: días 6 al 10, almuerzo 20% de alimento comercial y cena 80% de Kalak" },
      { image: "Transicion3" as ImageKey, alt: "Fase final de transición alimenticia: día 11 en adelante, 100% Kalak" },
    ],
  },
  steps: {
    title: "Paso a Paso para la Transición a KALAK",
    items: [
      {
        title: "Preparación y planeación",
        text: "Consulta con tu veterinario sobre el estado de salud de tu mascota, eligí ingredientes frescos y de calidad, conseguí una balancita de cocina para medir las cantidades adecuadamente.",
      },
      {
        title: "Cambio gradual",
        list: [
          "Día 1-6: Empieza alternando un 60% de comida natural con el 40% de la comida comercial.",
          "Día 7-13: Aumenta a un 80% de comida natural y 20% de comida comercial. Observa cómo reacciona su sistema digestivo y cuales son sus preferencias.",
          "Después del Día 13: Si no han surgido problemas digestivos (como diarrea o vómitos), podes cambiar completamente a la comida natural.",
        ],
      },
      {
        title: "Monitorea a tu mascota",
        text: "Durante la transición, monitorea a tu mascota. Si notas problemas digestivos:",
        list: [
          "Reduce la cantidad de alimento",
          "Aumenta líquidos con caldo de colágeno",
          "Enriquece su microbiota con yogur natural o kéfir",
        ],
        note: {
          before: "Cada animal se adapta a su ritmo. ",
          strong: "¡La paciencia es fundamental!",
          after: " Una vez establecida la dieta, mantén seguimiento veterinario regular para garantizar el bienestar de tu mascota.",
        },
      },
    ],
  },
  tips: {
    title: "Consejos para una Transición Exitosa",
    intro: "Sigue estas recomendaciones para asegurar que el cambio a una dieta natural sea lo más suave y beneficioso posible para tu mascota:",
    items: [
      { title: "Introducción gradual", text: "Comienza con pequeñas cantidades de comida natural mezclada con el alimento habitual." },
      { title: "Observa y adapta", text: "Observa cómo reacciona tu mascota y ajusta el ritmo de la transición según sea necesario." },
      { title: "Rutina consistente", text: "Mantén horarios regulares de alimentación durante el proceso." },
      { title: "Hidratación constante", text: "Asegúrate de que siempre tenga agua fresca disponible." },
      { title: "Supervisión profesional", text: "Consulta con tu veterinario si notas cualquier cambio preocupante." },
    ],
  },
  mistakes: {
    title: "Errores más comunes al realizar la transición",
    intro: "Aunque hacer el cambio a la alimentación natural es un gran paso, algunos tutores cometen errores comunes que pueden dificultar la transición. Aquí te contamos los más frecuentes y cómo evitarlos:",
    items: [
      {
        title: "Cambio demasiado rápido",
        error: "Intentar hacer el cambio a comida natural de un día para otro.",
        solution: "Realiza la transición de manera gradual, como se explicó antes. Esto ayudará a que el sistema digestivo de tu mascota se adapte sin problemas.",
      },
      {
        title: "No balancear la dieta correctamente",
        error: "No ofrecer los suplementos adecuados para cada etapa de sus vidas.",
        solution: "Asegúrate de crear una dieta equilibrada, con una proporción adecuada de proteínas, grasas, carbohidratos, fibra, vitaminas y minerales para mantener a tu mascota saludable.",
      },
      {
        title: "No evaluar a la mascota durante la transición",
        error: "No prestar atención a cómo reacciona la mascota (su comportamiento, orina y materia fecal) al nuevo alimento.",
        solution: "Monitorea a tu mascota para detectar cualquier cambio en su digestión, comportamiento o energía. Si hay señales de malestar, ajusta el plan de transición.",
      },
      {
        title: "No consultar con un veterinario",
        error: "Cambiar la dieta sin obtener asesoramiento profesional.",
        solution: "Consulta con un veterinario especializado en nutrición animal, especialmente si tu mascota tiene alguna condición médica o de salud especial.",
      },
    ],
  },
};
