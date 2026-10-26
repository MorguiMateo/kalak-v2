import { describe, expect, it } from "vitest";
import { firstReachableStep } from "./navigation";
import { initialState, loadState, newPet, saveState, wizardReducer, type PetDraft, type WizardState } from "./state";

function snapshot(): WizardState {
  return { ...initialState(), multiple: false, pets: [{ ...newPet(), id: "pet-1" }] };
}

const restore = (value: unknown) => loadState({ getItem: () => JSON.stringify(value) ?? null });

function roundTrip(state: WizardState) {
  const values = new Map<string, string>();
  saveState({ setItem: (key, value) => { values.set(key, value); } }, state);
  expect([...values.keys()]).toEqual(["kalak:ration-wizard:v1"]);
  return loadState({ getItem: (key) => values.get(key) ?? null });
}

describe("saved wizard validation", () => {
  it("rejects malformed JSON and non-record roots", () => {
    expect(loadState({ getItem: () => "{broken" })).toBeNull();
    for (const value of [null, [], "state", 1, true, { step: "count", pets: [] }]) {
      expect(restore(value)).toBeNull();
    }
  });

  it("requires every persisted state field", () => {
    for (const field of Object.keys(snapshot())) {
      const value: Record<string, unknown> = { ...snapshot() };
      delete value[field];
      expect(restore(value), field).toBeNull();
    }
  });

  it("rejects invalid scalar types and enum values", () => {
    const invalidFields = {
      step: [null, 1, {}], direction: [0, 2, "1", null], multiple: ["false", 0, []],
      duration: ["weekly", "", 7, {}], customDays: [7, null, []], customerName: [1, null, {}],
      customerPhone: [2615555555, null, []], orderedBefore: ["no", 0, {}], ready: [null, 1, "true"],
      pets: [null, {}, [null], [1], [[]]],
    };
    for (const [field, values] of Object.entries(invalidFields)) {
      for (const value of values) expect(restore({ ...snapshot(), [field]: value }), field).toBeNull();
    }
  });

  it("validates every pet field and supplement identifier", () => {
    const state = snapshot();
    for (const field of Object.keys(state.pets[0])) {
      const pet: Record<string, unknown> = { ...state.pets[0] };
      delete pet[field];
      expect(restore({ ...state, pets: [pet] }), field).toBeNull();
    }
    const invalidFields = {
      id: ["", " ", 1, null], species: ["bird", "", {}, "toString"], gender: ["other", false],
      name: [1, null, {}], breed: [null, []], age: ["adult", 5], sterilized: ["false", 0],
      weight: [25, null, []], bodyCondition: ["thin", 1], activity: ["active", {}],
      diet: ["natural", []], supplements: [null, {}, "caldo", ["unknown"], [null], [1], ["__proto__"]],
    };
    for (const [field, values] of Object.entries(invalidFields)) {
      for (const value of values) {
        expect(restore({ ...state, pets: [{ ...state.pets[0], [field]: value }] }), field).toBeNull();
      }
    }
  });

  it("rejects contradictory pet counts and duplicate IDs without silently dropping drafts", () => {
    const state = snapshot();
    for (const multiple of [true, false]) expect(restore({ ...state, multiple, pets: [] })).toBeNull();
    expect(restore({ ...state, multiple: null })).toBeNull();
    const second = { ...newPet(), id: "pet-2" };
    expect(restore({ ...state, pets: [...state.pets, second] })).toBeNull();
    expect(restore({ ...state, multiple: true, pets: [state.pets[0], state.pets[0]] })).toBeNull();
    expect(restore({ ...state, multiple: true, pets: [...state.pets, second] })?.pets).toHaveLength(2);
    expect(restore({ ...state, multiple: true })?.pets).toHaveLength(1);
    expect(roundTrip(initialState())).toEqual(initialState());
  });

  it("preserves incomplete and invalid raw input for the user to finish", () => {
    const state = snapshot();
    state.pets[0] = { ...state.pets[0], name: "Olga", weight: "7," };
    state.duration = "custom";
    state.customDays = "not yet";
    state.customerPhone = "261-";
    expect(roundTrip(state)).toEqual(state);
  });

  it("round-trips a complete snapshot without changing valid answers", () => {
    const pet: PetDraft = {
      ...newPet(), id: "olga", species: "dog", gender: "female", name: "Olga", breed: "Akita",
      age: "1-6 años", sterilized: true, weight: "25,5", bodyCondition: "normal", activity: "normal",
      diet: "raw", supplements: ["calcio", "caldo"],
    };
    const state: WizardState = {
      ...snapshot(), step: "summary", direction: -1, pets: [pet], duration: "custom", customDays: "45",
      customerName: "Ana", customerPhone: "261-5555555", orderedBefore: false, ready: true,
    };
    const saved = roundTrip(state);
    expect(saved).toEqual({ ...state, direction: 1, ready: false });
    expect(saved && firstReachableStep(saved)).toBe("summary");
    expect(wizardReducer(initialState(), { type: "hydrate", saved }).ready).toBe(true);
  });

  it("keeps unknown step IDs so navigation can choose the first incomplete step", () => {
    const saved = restore({ ...snapshot(), step: "old-version-step" });
    expect(saved?.step).toBe("old-version-step");
    expect(saved && firstReachableStep(saved)).toBe("species");
  });

  it("deduplicates supplements and reconciles calcium with each diet", () => {
    for (const diet of [null, "raw", "cooked", "mixed", "supplements"] as const) {
      const state = snapshot();
      state.pets[0] = { ...state.pets[0], diet, supplements: ["caldo", "caldo", "calcio", "calcio"] };
      expect(restore(state)?.pets[0].supplements).toEqual(
        diet === "raw" || diet === "cooked" ? ["caldo", "calcio"] : ["caldo"],
      );
      state.pets[0].supplements = ["curcuma"];
      expect(restore(state)?.pets[0].supplements).toEqual(
        diet === "raw" || diet === "cooked" ? ["curcuma", "calcio"] : ["curcuma"],
      );
    }
  });

  it("clears breeds that cannot belong to the selected species", () => {
    const state = snapshot();
    for (const species of [null, "cat", "dog"] as const) {
      state.pets[0] = { ...state.pets[0], species, breed: "Akita" };
      expect(restore(state)?.pets[0].breed).toBe(species === "dog" ? "Akita" : "");
    }
    state.pets[0].breed = "Unknown breed";
    expect(restore(state)?.pets[0].breed).toBe("");
    state.pets[0] = { ...state.pets[0], species: "cat", breed: "Persa" };
    expect(restore(state)?.pets[0].breed).toBe("Persa");
  });
});

describe("unavailable session storage", () => {
  it("hydrates as ready even when obtaining sessionStorage throws SecurityError", () => {
    const browser = {
      get sessionStorage(): Storage { throw new DOMException("Blocked", "SecurityError"); },
    };
    const saved = loadState(() => browser.sessionStorage);
    expect(saved).toBeNull();
    expect(wizardReducer(initialState(), { type: "hydrate", saved })).toEqual({ ...initialState(), ready: true });
    expect(() => saveState(() => browser.sessionStorage, snapshot())).not.toThrow();
  });

  it("recovers when getItem or setItem throws", () => {
    expect(loadState({ getItem: () => { throw new Error("Read blocked"); } })).toBeNull();
    expect(() => saveState({ setItem: () => { throw new Error("Quota exceeded"); } }, snapshot())).not.toThrow();
  });
});
