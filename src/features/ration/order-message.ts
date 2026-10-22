import { orderTotals, petOrder, type PetOrder } from "./order";
import { resolveDuration } from "./portion";
import { orderPrice, type PriceList } from "./pricing";
import type { BodyCondition, Activity, Customer, Diet, DurationChoice, Pet } from "./types";

const DIET_TEXT: Record<Diet, string> = {
  raw: "Natural cruda",
  cooked: "Natural cocida",
  mixed: "Mixta (60% natural cocida + 40% comercial)",
  supplements: "Suplementos (comercial + suplementos)",
};
const BODY_TEXT: Record<BodyCondition, string> = { delgado: "Delgado", normal: "Normal", sobrepeso: "Sobrepeso" };
const ACTIVITY_TEXT: Record<Activity, string> = { bajo: "Baja", normal: "Media", alto: "Alta" };

const COOKING_TIPS = [
  "\n*Sugerencia de cocción:*",
  "1) Descongelar en la heladera la porción adecuada",
  "2) Cocinar a gusto (semicocido/cocido) en olla, sartén, o plancha, o en microondas, agregar líquido a la cocción",
  "3) Agregar los suplementos",
  "4) Ofrecer preferentemente tibio",
  "Una vez cocido, mantener refrigerado en la heladera",
  "Mantener una adecuada higiene de los utensilios, platos y bebederos",
];

export type OrderMessageInput = {
  pets: readonly Pet[];
  duration: DurationChoice | null;
  customDays?: string;
  customer: Customer;
  /** Defaults to config/prices.ts. */
  prices?: PriceList;
};

const grams = (n: number) => n.toFixed(0);

/** WhatsApp order text. Same format as the old site (checked by golden tests). */
export function orderMessage({ pets, duration, customDays, customer, prices }: OrderMessageInput): string {
  const { label, days } = resolveDuration(duration, customDays);
  const orders = pets.map((pet) => petOrder(pet, { label, days }));
  const totals = orderTotals(orders);
  const price = orderPrice(totals, prices);
  const out: string[] = [];
  const line = (text = "") => out.push(text);

  line("*PEDIDO KALAK*\n");
  line(`*Duración del suministro:* ${label}\n`);

  if (price.complete) {
    line(`*PRECIO TOTAL: ${price.total} ARS*`);
    if (price.dogFormula > 0) line(`Fórmula perros: ${price.dogFormula} ARS`);
    if (price.catFormula > 0) line(`Fórmula gatos: ${price.catFormula} ARS`);
    if (price.calcio > 0) line(`Calcio: ${price.calcio} ARS`);
    if (price.caldo > 0) line(`Caldo: ${price.caldo} ARS`);
    if (price.curcuma > 0) line(`Cúrcuma activada: ${price.curcuma} ARS`);
  } else {
    line("*PRECIO TOTAL: a consultar*");
  }
  line();

  line("*RESUMEN DEL PEDIDO:*");
  if (totals.dogBags > 0) line(`Fórmula perros: ${totals.dogBags} bolsa(s) de 1kg`);
  if (totals.catBags > 0) line(`Fórmula gatos: ${totals.catBags} bolsa(s) de 1kg`);
  if (totals.caldoPots > 0) line(`Caldo: ${totals.caldoPots} pote(s)`);
  if (totals.curcumaPots > 0) line(`Cúrcuma activada: ${totals.curcumaPots} pote(s)`);
  if (totals.calcioPots > 0) line(`Calcio: ${totals.calcioPots} pote(s)`);
  line();

  for (const order of orders) orderLines(order, label).forEach((l) => line(l));

  line("\n*DETALLES POR MASCOTA:*\n");
  for (const order of orders) detailLines(order).forEach((l) => line(l));

  line("*Datos de contacto:*");
  line(`* Nombre: ${customer.name}`);
  line(`* Teléfono: ${customer.phone}`);
  out.push("¡Gracias!");

  return out.join("\n");
}

function orderLines({ pet, dailyKalak, bags, caldo, curcuma, calcio }: PetOrder, durationLabel: string) {
  const lines = [`*${pet.name.toUpperCase()}:*`];
  if (pet.diet === "supplements") {
    lines.push("* Solo suplementos");
  } else {
    lines.push(`* Kalak para ${durationLabel}: ${bags} bolsa(s) de 1kg (${grams(dailyKalak)}g/día)`);
    if (pet.diet === "mixed") lines.push("* Alimento comercial: 40% de lo habitual");
  }
  if (pet.supplements.length > 0) {
    lines.push("*Suplementos:*");
    if (caldo) lines.push(`* Caldo: ${caldo.monthlyPots} pote(s) (${caldo.dailyDose} cucharada(s)/día)`);
    if (curcuma)
      lines.push(`* Cúrcuma activada: ${curcuma.monthlyPots} pote(s) (${curcuma.dailyDose} cucharadita(s)/día)`);
    if (calcio) lines.push(`* Calcio: ${calcio} pote(s) al mes`);
  }
  return lines;
}

function detailLines({ pet, dailyKalak }: PetOrder) {
  const name = pet.name.toUpperCase();
  const lines = [`*${name}:*`, "*Resumen de alimentación diaria:*", `* Tipo de dieta: ${DIET_TEXT[pet.diet]}`];
  if (pet.diet !== "supplements") lines.push(`* Kalak diario: ${grams(dailyKalak)} g/día`);
  if (pet.diet === "mixed") lines.push("* Alimento comercial: 40% de lo habitual");
  if (pet.diet === "cooked") lines.push(...COOKING_TIPS);
  lines.push(
    `\n*Datos de ${name}:*`,
    `* Especie: ${pet.species === "dog" ? "Perro" : "Gato"}`,
    `* Sexo: ${pet.gender === "male" ? "Macho" : "Hembra"}`,
    `* Raza: ${pet.breed}`,
    `* Edad: ${pet.age}`,
    `* Esterilizado: ${pet.sterilized ? "Sí" : "No"}`,
    `* Peso: ${pet.weight} kg`,
    `* Condición corporal: ${BODY_TEXT[pet.bodyCondition]}`,
    `* Nivel de actividad: ${ACTIVITY_TEXT[pet.activity]}\n`,
  );
  return lines;
}
