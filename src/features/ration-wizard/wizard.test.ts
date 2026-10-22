import { describe, expect, it } from "vitest";
import { currentStep, firstReachableStep, visibleSteps } from "./navigation";
import { initialState, loadState, parseWeight, sanitizeName, toPet, wizardReducer, type WizardAction, type WizardState } from "./state";

const run = (actions: WizardAction[], start = initialState()) => actions.reduce(wizardReducer, start);
const complete = (s: WizardState) => currentStep(s).step.complete(s);

describe("parseWeight", () => {
  it("accepts 0.1–60 kg with dot or comma", () => {
    expect(parseWeight("7,5")).toBe(7.5);
    expect(parseWeight("0.1")).toBe(0.1);
    expect(parseWeight("60")).toBe(60);
  });
  it("rejects empty, zero and out of range", () => {
    for (const v of ["", " ", "0", "0.09", "60.1", "abc"]) expect(parseWeight(v)).toBeNull();
  });
});

it("names cannot contain digits", () => {
  expect(sanitizeName("Olga2")).toBe("Olga");
});

describe("flow", () => {
  it("single pet skips pet management", () => {
    const s = run([{ type: "setMultiple", multiple: false }]);
    expect(s.pets).toHaveLength(1);
    expect(visibleSteps(s).map((x) => x.id)).not.toContain("pets");
    expect(currentStep(s).next?.id).toBe("species");
  });

  it("multiple pets show pet management; switching back keeps only the first", () => {
    let s = run([{ type: "setMultiple", multiple: true }, { type: "addPet" }]);
    expect(currentStep(s).next?.id).toBe("pets");
    expect(s.pets).toHaveLength(2);
    s = wizardReducer(s, { type: "setMultiple", multiple: false });
    expect(s.pets).toHaveLength(1);
  });

  it("a step is complete only when every pet answered", () => {
    let s = run([{ type: "setMultiple", multiple: true }, { type: "addPet" }, { type: "goTo", step: "species", direction: 1 }]);
    const [a, b] = s.pets;
    s = wizardReducer(s, { type: "updatePet", id: a.id, patch: { species: "dog" } });
    expect(complete(s)).toBe(false);
    s = wizardReducer(s, { type: "updatePet", id: b.id, patch: { species: "cat" } });
    expect(complete(s)).toBe(true);
  });

  it("changing species clears the breed", () => {
    let s = run([{ type: "setMultiple", multiple: false }]);
    const id = s.pets[0].id;
    s = run([{ type: "updatePet", id, patch: { species: "dog", breed: "Akita" } }, { type: "updatePet", id, patch: { species: "cat" } }], s);
    expect(s.pets[0].breed).toBe("");
  });

  it("a restored step falls back to the first incomplete one", () => {
    const s = run([{ type: "setMultiple", multiple: false }, { type: "goTo", step: "weight", direction: 1 }]);
    expect(firstReachableStep(s)).toBe("species");
  });
});

describe("persistence", () => {
  it("ignores missing or broken data", () => {
    expect(loadState({ getItem: () => null })).toBeNull();
    expect(loadState({ getItem: () => "{oops" })).toBeNull();
    expect(loadState({ getItem: () => JSON.stringify({ step: 3 }) })).toBeNull();
  });
  it("restores a saved state", () => {
    const saved = run([{ type: "setMultiple", multiple: false }]);
    expect(loadState({ getItem: () => JSON.stringify(saved) })?.pets).toHaveLength(1);
  });
});

it("toPet converts a finished draft", () => {
  const s = run([{ type: "setMultiple", multiple: false }]);
  const draft = {
    ...s.pets[0],
    species: "dog" as const,
    gender: "female" as const,
    name: " Olga ",
    breed: "Sin raza (20-40kg)",
    age: "1-6 años" as const,
    sterilized: true,
    weight: "25,5",
    bodyCondition: "normal" as const,
    activity: "normal" as const,
    diet: "raw" as const,
  };
  expect(toPet(draft)).toMatchObject({ name: "Olga", weight: 25.5 });
  expect(toPet({ ...draft, weight: "" })).toBeNull();
});
