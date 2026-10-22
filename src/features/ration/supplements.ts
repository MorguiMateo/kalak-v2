import { COMMERCIAL_SHARE } from "./portion";
import type { Pet } from "./types";

/** Doses and pots are always computed for 30 days, whatever the supply duration (same as the old site). */
const DAYS_PER_MONTH = 30;
const CALDO_SPOONS_PER_POT = 30;
const CURCUMA_TEASPOONS_PER_POT = 10;

export type Dosage = { dailyDose: number; monthlyPots: number };

/** Caldo: tablespoons per day, rounded to the nearest 0.5. */
export function caldoDosage({ weight, age }: Pick<Pet, "weight" | "age">): Dosage {
  if (!(weight > 0)) return { dailyDose: 0, monthlyPots: 0 };

  let spoons: number;
  if (weight <= 5) spoons = 2 * weight; // toy
  else if (age === "1-6 meses" || age === "7-12 meses") spoons = weight <= 15 ? weight / 2 : weight / 5;
  else if (age === "+7 años (geronte)") spoons = weight > 20 ? weight / 5 : weight / 2;
  else spoons = weight / 5; // adult

  const dailyDose = Math.round(spoons * 2) / 2;
  return { dailyDose, monthlyPots: Math.ceil((dailyDose * DAYS_PER_MONTH) / CALDO_SPOONS_PER_POT) };
}

/** Cúrcuma activada: one teaspoon per 10kg (minimum one). */
export function curcumaDosage({ weight }: Pick<Pet, "weight">): Dosage {
  if (!(weight > 0)) return { dailyDose: 0, monthlyPots: 0 };
  const dailyDose = weight < 10 ? 1 : Math.ceil(weight / 10);
  return { dailyDose, monthlyPots: Math.ceil((dailyDose * DAYS_PER_MONTH) / CURCUMA_TEASPOONS_PER_POT) };
}

/**
 * Calcio: one pot a month when the pet eats (almost) no commercial food.
 * Depends on the pet's own diet; the old site read a page-wide value that never changed.
 */
export function calcioPots({ diet }: Pick<Pet, "diet">): number {
  return COMMERCIAL_SHARE[diet] < 0.1 ? 1 : 0;
}

/** Calcio is part of natural diets and not offered with commercial food. */
export function calcioIncluded({ diet }: Pick<Pet, "diet">): boolean {
  return diet === "raw" || diet === "cooked";
}
