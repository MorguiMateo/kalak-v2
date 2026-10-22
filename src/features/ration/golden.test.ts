import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";
import { ageOptions, legacy, type LegacyInput, type Pet as LegacyPet } from "./__fixtures__/legacy";
import {
  AGE_PERCENTAGE,
  caldoDosage,
  calcioIncluded,
  calcioPots,
  curcumaDosage,
  dailyKalakGrams,
  orderMessage,
  type Activity,
  type AgeGroup,
  type BodyCondition,
  type Diet,
  type DurationChoice,
  type Pet,
  type PriceList,
  type Species,
  type Supplement,
} from "./index";

// Prices of the old site (Kalak/src/config/prices.ts), so totals can be compared.
const OLD_PRICES: PriceList = {
  formula: { dog: 3800, cat: 4300 },
  supplements: { caldo: 2300, curcuma: 1000, calcio: 1100 },
};
const LEGACY_PRICES: LegacyInput["prices"] = {
  PRECIO_FORMULA_PERROS: 3800,
  PRECIO_FORMULA_GATOS: 4300,
  PRECIO_CALDO: 2300,
  PRECIO_CURCUMA: 1000,
  PRECIO_CALCIO: 1100,
};

const SUPPLEMENT_LABEL: Record<Supplement, string> = {
  caldo: "Caldo",
  curcuma: "Curcuma activada",
  calcio: "Calcio",
};

function toLegacy(pet: Pet, i: number): LegacyPet {
  return {
    id: String(i),
    type: pet.species,
    gender: pet.gender,
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    agePercentage: ageOptions.find((o) => o.value === pet.age)!.percentage,
    isSterilized: pet.sterilized,
    weight: String(pet.weight),
    bodyCondition: pet.bodyCondition,
    bodyConditionPercentage: 0,
    activity: pet.activity,
    activityPercentage: 0,
    dietType: pet.diet,
    supplements: pet.supplements.map((s) => SUPPLEMENT_LABEL[s]),
  };
}

const species: Species[] = ["dog", "cat"];
const ages = Object.keys(AGE_PERCENTAGE) as AgeGroup[];
const weights = [0.8, 3, 4.99, 5, 7.5, 10, 12, 15, 16, 20, 23.4, 40, 62];
const bodies: BodyCondition[] = ["delgado", "normal", "sobrepeso"];
const activities: Activity[] = ["bajo", "normal", "alto"];
const diets: Diet[] = ["raw", "cooked", "mixed", "supplements"];
const supplementSets: Supplement[][] = [[], ["caldo"], ["curcuma"], ["calcio"], ["caldo", "curcuma", "calcio"]];

function* petMatrix(): Generator<Pet> {
  let n = 0;
  for (const s of species)
    for (const age of ages)
      for (const weight of weights)
        for (const bodyCondition of bodies)
          for (const diet of diets) {
            n++;
            yield {
              name: `Mascota ${n}`,
              species: s,
              gender: n % 2 ? "male" : "female",
              breed: s === "dog" ? "Sin raza (10-20kg)" : "Sin raza",
              age,
              sterilized: n % 3 === 0,
              weight,
              bodyCondition,
              activity: activities[n % 3],
              diet,
              supplements: supplementSets[n % supplementSets.length],
            };
          }
}

const pets = [...petMatrix()];

describe("matches the old calculator for every pet in the matrix", () => {
  it("daily grams", () => {
    for (const [i, pet] of pets.entries()) {
      const old = legacy({ pets: [], supplyDuration: null, customDays: "", customerName: "", customerPhone: "", prices: LEGACY_PRICES });
      const portion = old.calculateDailyPortion(toLegacy(pet, i));
      const expected = pet.diet === "mixed" ? portion.kalak : pet.diet === "supplements" ? 0 : portion.kalakOnly;
      expect(dailyKalakGrams(pet), JSON.stringify(pet)).toBeCloseTo(expected, 9);
    }
  });

  it("supplement doses", () => {
    const old = legacy({ pets: [], supplyDuration: null, customDays: "", customerName: "", customerPhone: "", prices: LEGACY_PRICES });
    for (const [i, pet] of pets.entries()) {
      const legacyPet = toLegacy(pet, i);
      expect(caldoDosage(pet)).toEqual(old.calculateCaldoDosage(legacyPet));
      expect(curcumaDosage(pet)).toEqual(old.calculateCurcumaActivadaDosage(legacyPet));
      expect(calcioPots(pet)).toBe(old.calculateCalcioDosage(legacyPet).monthlyPots);
    }
  });
});

const durations: Array<[DurationChoice | null, string]> = [
  ["1_week", ""],
  ["2_weeks", ""],
  ["1_month", ""],
  ["custom", "45"],
  ["custom", ""],
  [null, ""],
];

/** Pet as the old wizard leaves it after step 10: calcio added to natural diets, removed otherwise. */
function afterDietStep(pet: Pet): Pet {
  const rest = pet.supplements.filter((s) => s !== "calcio");
  return { ...pet, supplements: calcioIncluded(pet) ? [...rest, "calcio"] : rest };
}

describe("WhatsApp message and URL", () => {
  const customer = { name: "Ana Pérez", phone: "261 555 1234" };

  function compare(group: Pet[], duration: DurationChoice | null, customDays: string) {
    const old = legacy({
      pets: group.map(toLegacy),
      supplyDuration: duration,
      customDays,
      customerName: customer.name,
      customerPhone: customer.phone,
      prices: LEGACY_PRICES,
    }).prepareAndSendOrder();
    const message = orderMessage({ pets: group, duration, customDays, customer, prices: OLD_PRICES });
    expect(message).toBe(old.message);
    expect(whatsappUrl(message)).toBe(old.whatsappUrl);
  }

  it("one pet, every duration", () => {
    for (const [i, pet] of pets.entries()) {
      const [duration, days] = durations[i % durations.length];
      compare([afterDietStep(pet)], duration, days);
    }
  });

  it("raw supplement sets (no step-10 adjustment)", () => {
    for (const pet of pets.slice(0, 300)) compare([pet], "1_month", "");
  });

  it("two and three pets", () => {
    for (let i = 0; i + 2 < pets.length; i += 7) {
      const pair = [afterDietStep(pets[i]), afterDietStep(pets[pets.length - 1 - i])];
      compare(pair, durations[i % durations.length][0], durations[i % durations.length][1]);
      if (i % 5 === 0) compare([...pair, afterDietStep(pets[(i * 13) % pets.length])], "2_weeks", "");
    }
  });
});
