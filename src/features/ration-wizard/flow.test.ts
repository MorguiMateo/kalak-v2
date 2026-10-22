import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";
import { ageOptions, legacy } from "../ration/__fixtures__/legacy";
import { orderMessage, type Pet } from "../ration";
import { currentStep } from "./navigation";
import { initialState, toPet, wizardReducer, type PetDraft, type WizardAction, type WizardState } from "./state";

const OLD = { formula: { dog: 3800, cat: 4300 }, supplements: { caldo: 2300, curcuma: 1000, calcio: 1100 } };
const LEGACY_PRICES = { PRECIO_FORMULA_PERROS: 3800, PRECIO_FORMULA_GATOS: 4300, PRECIO_CALDO: 2300, PRECIO_CURCUMA: 1000, PRECIO_CALCIO: 1100 };
const LABEL = { caldo: "Caldo", curcuma: "Curcuma activada", calcio: "Calcio" } as const;

type Answers = Omit<PetDraft, "id" | "supplements"> & { extra: ("caldo" | "curcuma")[] };

/** Walks the wizard like a user: answer the current step, then continue. */
function walk(answers: Answers[], duration: WizardState["duration"], customDays = "") {
  let s = wizardReducer(initialState(), { type: "setMultiple", multiple: answers.length > 1 });
  const dispatch = (a: WizardAction) => (s = wizardReducer(s, a));
  for (let i = 1; i < answers.length; i++) dispatch({ type: "addPet" });
  const visited: string[] = [];
  for (;;) {
    const { step, next } = currentStep(s);
    visited.push(step.id);
    s.pets.forEach((pet, i) => {
      const a = answers[i];
      const patch: Partial<PetDraft> = {
        species: { species: a.species },
        gender: { gender: a.gender },
        name: { name: a.name },
        breed: { breed: a.breed },
        age: { age: a.age, sterilized: a.sterilized },
        weight: { weight: a.weight },
        body: { bodyCondition: a.bodyCondition },
        activity: { activity: a.activity },
        diet: { diet: a.diet },
      }[step.id] ?? {};
      if (Object.keys(patch).length) dispatch({ type: "updatePet", id: pet.id, patch });
      if (step.id === "supplements") dispatch({ type: "updatePet", id: pet.id, patch: { supplements: [...pet.supplements, ...a.extra] } });
    });
    if (step.id === "duration") dispatch({ type: "set", patch: { duration, customDays } });
    if (step.id === "contact") dispatch({ type: "set", patch: { customerName: "Ana Pérez", customerPhone: "261-5555555" } });
    expect(step.complete(s), step.id).toBe(true);
    if (!next) break;
    dispatch({ type: "goTo", step: next.id, direction: 1 });
  }
  return { s, visited };
}

function legacyUrl(pets: Pet[], duration: WizardState["duration"], customDays: string) {
  return legacy({
    pets: pets.map((p, i) => ({
      id: String(i), type: p.species, gender: p.gender, name: p.name, breed: p.breed, age: p.age,
      agePercentage: ageOptions.find((o) => o.value === p.age)!.percentage, isSterilized: p.sterilized,
      weight: String(p.weight), bodyCondition: p.bodyCondition, bodyConditionPercentage: 0,
      activity: p.activity, activityPercentage: 0, dietType: p.diet, supplements: p.supplements.map((x) => LABEL[x]),
    })),
    supplyDuration: duration, customDays, customerName: "Ana Pérez", customerPhone: "261-5555555", prices: LEGACY_PRICES,
  }).prepareAndSendOrder().whatsappUrl;
}

const olga: Answers = {
  species: "dog", gender: "female", name: "Olga", breed: "Sin raza (20-40kg)", age: "1-6 años", sterilized: true,
  weight: "25,5", bodyCondition: "normal", activity: "normal", diet: "raw", extra: ["caldo"],
};
const tini: Answers = {
  species: "cat", gender: "male", name: "Tini", breed: "Persa", age: "+7 años (geronte)", sterilized: false,
  weight: "4.2", bodyCondition: "sobrepeso", activity: "bajo", diet: "mixed", extra: ["curcuma", "caldo"],
};

describe("full flow", () => {
  it("one pet: 14 steps and the same wa.me URL as the old site", () => {
    const { s, visited } = walk([olga], "1_month");
    expect(visited).toHaveLength(14);
    const pets = s.pets.map(toPet) as Pet[];
    expect(pets[0].supplements).toEqual(["calcio", "caldo"]);
    const url = whatsappUrl(orderMessage({ pets, duration: s.duration, customDays: s.customDays, customer: { name: "Ana Pérez", phone: "261-5555555" }, prices: OLD }));
    expect(url).toBe(legacyUrl(pets, "1_month", ""));
    expect(url.startsWith("https://wa.me/542615038820?text=")).toBe(true);
  });

  it("two pets, custom duration: same wa.me URL as the old site", () => {
    const { s, visited } = walk([olga, tini], "custom", "45");
    expect(visited).toContain("pets");
    const pets = s.pets.map(toPet) as Pet[];
    expect(pets[1].supplements).not.toContain("calcio");
    const url = whatsappUrl(orderMessage({ pets, duration: s.duration, customDays: s.customDays, customer: { name: "Ana Pérez", phone: "261-5555555" }, prices: OLD }));
    expect(url).toBe(legacyUrl(pets, "custom", "45"));
  });
});
