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
  /** Id of the current step (see steps.tsx). */
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

/** Phone: digits, spaces and hyphens only (same rule as the old site). */
export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9-\s]/g, "");
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

export function loadState(storage: Pick<Storage, "getItem">): WizardState | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WizardState>;
    if (typeof parsed.step !== "string" || !Array.isArray(parsed.pets)) return null;
    return { ...initialState(), ...parsed, direction: 1 };
  } catch {
    return null;
  }
}

export function saveState(storage: Pick<Storage, "setItem">, state: WizardState) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled: progress just isn't kept.
  }
}
