import { parseWeight } from "../state";
import { AgeStep } from "./AgeStep";
import { BodyStep } from "./BodyStep";
import { BreedStep } from "./BreedStep";
import { CountStep } from "./CountStep";
import { GenderStep } from "./GenderStep";
import { NameStep } from "./NameStep";
import { PendingStep } from "./PendingStep";
import { PetsStep } from "./PetsStep";
import { WeightStep } from "./WeightStep";
import { SpeciesStep } from "./SpeciesStep";
import { everyPet, type StepDef } from "./types";

/** Calculator steps, in order. Steps 0-7 of the old site; the rest arrive in phase 5. */
export const steps: readonly StepDef[] = [
  { id: "count", complete: (s) => s.multiple !== null, Component: CountStep },
  { id: "pets", visible: (s) => s.multiple === true, complete: (s) => s.pets.length > 0, Component: PetsStep },
  { id: "species", complete: (s) => everyPet(s, (p) => p.species !== null), Component: SpeciesStep },
  { id: "gender", complete: (s) => everyPet(s, (p) => p.gender !== null), Component: GenderStep },
  { id: "name", complete: (s) => everyPet(s, (p) => p.name.trim() !== ""), Component: NameStep },
  { id: "breed", complete: (s) => everyPet(s, (p) => p.breed !== ""), Component: BreedStep },
  { id: "age", complete: (s) => everyPet(s, (p) => p.age !== null && p.sterilized !== null), Component: AgeStep },
  { id: "weight", complete: (s) => everyPet(s, (p) => parseWeight(p.weight) !== null), Component: WeightStep },
  { id: "body", complete: (s) => everyPet(s, (p) => p.bodyCondition !== null), Component: BodyStep },
  { id: "pending", complete: () => false, Component: PendingStep },
];

export { type StepDef, type StepProps } from "./types";
