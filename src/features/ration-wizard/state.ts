import { breedsBySpecies } from "@/config/breeds";
import {
  calcioIncluded,
  type Activity,
  type AgeGroup,
  type BodyCondition,
  type Diet,
  type DurationChoice,
  type Gender,
  type Pet,
  type Species,
  type Supplement,
} from "@/features/ration";

/** A pet while the form is being filled: every answer can still be empty. */
export type PetDraft = {
  id: string;
  species: Species | null;
  gender: Gender | null;
  name: string;
  breed: string;
  age: AgeGroup | null;
  sterilized: boolean | null;
  /** Raw input, in kg. */
  weight: string;
  bodyCondition: BodyCondition | null;
  activity: Activity | null;
  diet: Diet | null;
  supplements: Supplement[];
};

export type WizardState = {
  /** Id of the current step in the step registry. */
  step: string;
  /** +1 when moving forward, -1 when going back. Drives the step transition. */
  direction: 1 | -1;
  multiple: boolean | null;
  pets: PetDraft[];
  duration: DurationChoice | null;
  customDays: string;
  customerName: string;
  customerPhone: string;
  orderedBefore: boolean | null;
  /** False until the saved progress (sessionStorage) has been read on the client. */
  ready: boolean;
};

export type WizardAction =
  | { type: "setMultiple"; multiple: boolean }
  | { type: "addPet" }
  | { type: "removePet"; id: string }
  | { type: "updatePet"; id: string; patch: Partial<Omit<PetDraft, "id">> }
  | { type: "set"; patch: Partial<Pick<WizardState, "duration" | "customDays" | "customerName" | "customerPhone" | "orderedBefore">> }
  | { type: "goTo"; step: string; direction: 1 | -1 }
  | { type: "hydrate"; saved: WizardState | null }
  | { type: "reset" };

export const WEIGHT_MIN = 0.1;
export const WEIGHT_MAX = 60;

let idCounter = 0;
export function newPet(): PetDraft {
  idCounter += 1;
  return {
    id: `${Date.now().toString(36)}-${idCounter}`,
    species: null,
    gender: null,
    name: "",
    breed: "",
    age: null,
    sterilized: null,
    weight: "",
    bodyCondition: null,
    activity: null,
    diet: null,
    supplements: [],
  };
}

export function initialState(): WizardState {
  return {
    step: "count",
    direction: 1,
    multiple: null,
    pets: [],
    duration: null,
    customDays: "",
    customerName: "",
    customerPhone: "",
    orderedBefore: null,
    ready: false,
  };
}

/** Parses the weight input ("7,5" or "7.5"); null when empty or out of 0.1–60 kg. */
export function parseWeight(input: string): number | null {
  const value = Number(input.trim().replace(",", "."));
  if (!input.trim() || !Number.isFinite(value) || value < WEIGHT_MIN || value > WEIGHT_MAX) return null;
  return value;
}

export const CUSTOM_DAYS_MAX = 90;

/** Whole days between 1 and 90; null otherwise. */
export function parseCustomDays(input: string): number | null {
  if (!/^\d+$/.test(input.trim())) return null;
  const days = Number(input.trim());
  return days >= 1 && days <= CUSTOM_DAYS_MAX ? days : null;
}

/** Digits are not allowed in names (same rule as the old site). */
export function sanitizeName(input: string): string {
  return input.replace(/\d/g, "");
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "setMultiple": {
      const pets = state.pets.length ? state.pets : [newPet()];
      return { ...state, multiple: action.multiple, pets: action.multiple ? pets : pets.slice(0, 1) };
    }
    case "addPet":
      return { ...state, pets: [...state.pets, newPet()] };
    case "removePet":
      return { ...state, pets: state.pets.filter((p) => p.id !== action.id) };
    case "updatePet":
      return {
        ...state,
        pets: state.pets.map((p) => {
          if (p.id !== action.id) return p;
          const next = { ...p, ...action.patch };
          // Breeds depend on the species.
          if (action.patch.species && action.patch.species !== p.species) next.breed = "";
          // Calcio comes with natural diets and is not offered with commercial food.
          if (action.patch.diet) {
            const rest = next.supplements.filter((s) => s !== "calcio");
            next.supplements = calcioIncluded({ diet: action.patch.diet }) ? [...rest, "calcio"] : rest;
          }
          return next;
        }),
      };
    case "set":
      return { ...state, ...action.patch };
    case "goTo":
      return action.step === state.step ? state : { ...state, step: action.step, direction: action.direction };
    case "hydrate":
      return { ...(action.saved ?? state), ready: true };
    case "reset":
      return { ...initialState(), ready: true };
  }
}

/** Converts a finished draft into the input of `features/ration`. Null while something is missing. */
export function toPet(draft: PetDraft): Pet | null {
  const weight = parseWeight(draft.weight);
  const { species, gender, age, sterilized, bodyCondition, activity, diet } = draft;
  if (
    !species ||
    !gender ||
    !draft.name.trim() ||
    !draft.breed ||
    !age ||
    sterilized === null ||
    weight === null ||
    !bodyCondition ||
    !activity ||
    !diet
  )
    return null;
  return {
    name: draft.name.trim(),
    species,
    gender,
    breed: draft.breed,
    age,
    sterilized,
    weight,
    bodyCondition,
    activity,
    diet,
    supplements: draft.supplements,
  };
}

const STORAGE_KEY = "kalak:ration-wizard:v1";

type StorageSource<T> = T | (() => T);

const speciesChoices = { dog: true, cat: true } satisfies Record<Species, true>;
const genderChoices = { male: true, female: true } satisfies Record<Gender, true>;
const ageChoices = { "1-6 meses": true, "7-12 meses": true, "1-6 años": true, "+7 años (geronte)": true } satisfies Record<AgeGroup, true>;
const bodyChoices = { delgado: true, normal: true, sobrepeso: true } satisfies Record<BodyCondition, true>;
const activityChoices = { bajo: true, normal: true, alto: true } satisfies Record<Activity, true>;
const dietChoices = { raw: true, cooked: true, mixed: true, supplements: true } satisfies Record<Diet, true>;
const supplementChoices = { caldo: true, curcuma: true, calcio: true } satisfies Record<Supplement, true>;
const durationChoices = { "1_week": true, "2_weeks": true, "1_month": true, custom: true } satisfies Record<DurationChoice, true>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isChoice<T extends string>(value: unknown, choices: Record<T, true>): value is T {
  return typeof value === "string" && Object.hasOwn(choices, value);
}

function isNullableChoice<T extends string>(value: unknown, choices: Record<T, true>): value is T | null {
  return value === null || isChoice(value, choices);
}

function isNullableBoolean(value: unknown): value is boolean | null {
  return value === null || typeof value === "boolean";
}

function isPetDraft(value: unknown): value is PetDraft {
  return isRecord(value)
    && typeof value.id === "string" && value.id.trim() !== ""
    && isNullableChoice(value.species, speciesChoices)
    && isNullableChoice(value.gender, genderChoices)
    && typeof value.name === "string"
    && typeof value.breed === "string"
    && isNullableChoice(value.age, ageChoices)
    && isNullableBoolean(value.sterilized)
    && typeof value.weight === "string"
    && isNullableChoice(value.bodyCondition, bodyChoices)
    && isNullableChoice(value.activity, activityChoices)
    && isNullableChoice(value.diet, dietChoices)
    && Array.isArray(value.supplements)
    && value.supplements.every((item: unknown) => isChoice(item, supplementChoices));
}

/** Reject incompatible snapshots, but keep raw/incomplete form inputs for the user to finish. */
function restoreState(value: unknown): WizardState | null {
  if (!isRecord(value)
    || typeof value.step !== "string"
    || (value.direction !== 1 && value.direction !== -1)
    || !isNullableBoolean(value.multiple)
    || !Array.isArray(value.pets) || !value.pets.every(isPetDraft)
    || !isNullableChoice(value.duration, durationChoices)
    || typeof value.customDays !== "string"
    || typeof value.customerName !== "string"
    || typeof value.customerPhone !== "string"
    || !isNullableBoolean(value.orderedBefore)
    || typeof value.ready !== "boolean") return null;

  const { pets, multiple } = value;
  if ((multiple === null && pets.length !== 0)
    || (multiple !== null && pets.length === 0)
    || (multiple === false && pets.length !== 1)
    || new Set(pets.map((pet) => pet.id)).size !== pets.length) return null;

  return {
    step: value.step,
    direction: 1,
    multiple,
    pets: pets.map((pet) => {
      const supplements = [...new Set(pet.supplements)];
      const included = pet.diet !== null && calcioIncluded({ diet: pet.diet });
      if (included && !supplements.includes("calcio")) supplements.push("calcio");
      // Invalid breeds must return to the breed question instead of skipping it.
      const breeds: readonly string[] = pet.species ? breedsBySpecies[pet.species] : [];
      return {
        ...pet,
        breed: breeds.includes(pet.breed) ? pet.breed : "",
        supplements: included ? supplements : supplements.filter((item) => item !== "calcio"),
      };
    }),
    duration: value.duration,
    customDays: value.customDays,
    customerName: value.customerName,
    customerPhone: value.customerPhone,
    orderedBefore: value.orderedBefore,
    ready: false,
  };
}

/** A lazy source also protects access to the browser's potentially blocked storage getter. */
export function loadState(storage: StorageSource<Pick<Storage, "getItem">>): WizardState | null {
  try {
    const target = typeof storage === "function" ? storage() : storage;
    const raw = target.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return restoreState(parsed);
  } catch {
    return null;
  }
}

export function saveState(storage: StorageSource<Pick<Storage, "setItem">>, state: WizardState) {
  try {
    const target = typeof storage === "function" ? storage() : storage;
    target.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled: progress just isn't kept.
  }
}
