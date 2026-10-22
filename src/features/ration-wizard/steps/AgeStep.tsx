import type { AgeGroup } from "@/features/ration";
import { ChoicePills } from "../ui/ChoicePills";
import { PetStack, QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

const ageOptions: { value: AgeGroup; label: string }[] = [
  { value: "1-6 meses", label: "1-6 meses" },
  { value: "7-12 meses", label: "7-12 meses" },
  { value: "1-6 años", label: "1-6 años" },
  { value: "+7 años (geronte)", label: "+7 años" },
];

export function AgeStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <div key={pet.id} className="grid gap-10">
          <QuestionGroup title={`¿Qué edad tiene ${petLabel(pet, i)}?`}>
            <ChoicePills
              name={`age-${pet.id}`}
              value={pet.age}
              options={ageOptions}
              onChange={(age) => dispatch({ type: "updatePet", id: pet.id, patch: { age } })}
            />
          </QuestionGroup>
          <QuestionGroup title={`¿Está ${pet.gender === "female" ? "esterilizada" : "esterilizado"}?`}>
            <ChoicePills
              name={`sterilized-${pet.id}`}
              value={pet.sterilized === null ? null : pet.sterilized ? "yes" : "no"}
              options={[
                { value: "yes", label: "Sí" },
                { value: "no", label: "No" },
              ]}
              onChange={(v) => dispatch({ type: "updatePet", id: pet.id, patch: { sterilized: v === "yes" } })}
            />
          </QuestionGroup>
        </div>
      ))}
    </PetStack>
  );
}
