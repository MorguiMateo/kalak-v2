import { parseCustomDays, parseWeight } from "../state";
import { ActivityStep } from "./ActivityStep";
import { AgeStep } from "./AgeStep";
import { BodyStep } from "./BodyStep";
import { BreedStep } from "./BreedStep";
import { CountStep } from "./CountStep";
import { GenderStep } from "./GenderStep";
import { NameStep } from "./NameStep";
import { ContactStep } from "./ContactStep";
import { DietStep } from "./DietStep";
import { DurationStep } from "./DurationStep";
import { SummaryStep } from "./SummaryStep";
import { SupplementsStep } from "./SupplementsStep";
import { PetsStep } from "./PetsStep";
import { WeightStep } from "./WeightStep";
import { SpeciesStep } from "./SpeciesStep";
import { everyPet, type StepDef } from "./types";

/** Calculator steps, in order (same flow as the old site). */
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
  { id: "activity", complete: (s) => everyPet(s, (p) => p.activity !== null), Component: ActivityStep },
  {
    id: "duration",
    complete: (s) => s.duration !== null && (s.duration !== "custom" || parseCustomDays(s.customDays) !== null),
    Component: DurationStep,
  },
  { id: "diet", complete: (s) => everyPet(s, (p) => p.diet !== null), Component: DietStep },
  { id: "supplements", complete: () => true, Component: SupplementsStep },
  {
    id: "contact",
    complete: (s) => s.customerName.trim() !== "" && s.customerPhone.replace(/\D/g, "").length >= 6,
    Component: ContactStep,
  },
  { id: "summary", complete: () => true, Component: SummaryStep },
];

export { type StepDef, type StepProps } from "./types";
