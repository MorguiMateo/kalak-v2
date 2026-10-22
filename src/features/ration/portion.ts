import type { AgeGroup, Diet, DurationChoice, Pet } from "./types";

/** Daily food as a percentage of body weight, by age. */
export const AGE_PERCENTAGE: Record<AgeGroup, number> = {
  "1-6 meses": 8,
  "7-12 meses": 6,
  "1-6 años": 3,
  "+7 años (geronte)": 4,
};

/** Share of the daily ration that is Kalak, by diet. */
const KALAK_SHARE: Record<Diet, number> = { raw: 1, cooked: 1, mixed: 0.6, supplements: 0 };

/** Share of the daily ration that is commercial food, by diet. */
export const COMMERCIAL_SHARE: Record<Diet, number> = { raw: 0, cooked: 0, mixed: 0.4, supplements: 1 };

type PortionInput = Pick<Pet, "species" | "weight" | "age" | "bodyCondition">;

/** Percentage of body weight to feed per day. Activity does not change it (same as the old site). */
export function dailyPercentage({ species, weight, age, bodyCondition }: PortionInput): number {
  let percentage = AGE_PERCENTAGE[age];
  if (bodyCondition === "sobrepeso") percentage = age === "+7 años (geronte)" ? 3 : 2;
  if (bodyCondition === "delgado") percentage = 4;
  if (species === "dog" && weight < 5) {
    if (age === "1-6 años" && bodyCondition === "normal") percentage = 4;
    if (bodyCondition === "sobrepeso") percentage = 3;
  }
  return percentage;
}

/** Total food per day in grams (Kalak + commercial). */
export function dailyTotalGrams(pet: PortionInput): number {
  if (!(pet.weight > 0)) return 0;
  return pet.weight * dailyPercentage(pet) * 10;
}

/** Kalak grams per day for the pet's diet. */
export function dailyKalakGrams(pet: PortionInput & Pick<Pet, "diet">): number {
  return dailyTotalGrams(pet) * KALAK_SHARE[pet.diet];
}

export type Duration = { label: string; days: number };

/** Unknown or incomplete choices fall back to one month, like the old site. */
export function resolveDuration(choice: DurationChoice | null, customDays = ""): Duration {
  switch (choice) {
    case "1_week":
      return { label: "1 semana", days: 7 };
    case "2_weeks":
      return { label: "1 quincena", days: 15 };
    case "custom":
      if (customDays.trim()) return { label: `${customDays} días`, days: parseInt(customDays) };
    // falls through
    default:
      return { label: "1 mes", days: 30 };
  }
}

/** 1kg bags needed to cover `days`. */
export function kalakBags(dailyGrams: number, days: number): number {
  return Math.ceil((dailyGrams * days) / 1000);
}
