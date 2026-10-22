import type { Diet } from "@/features/ration";
import { ChoiceCards, type CardOption } from "../ui/ChoiceCards";
import { PetStack, QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

const options: CardOption<Diet>[] = [
  { value: "raw", label: "Natural cruda", description: "Cálculo Kalak común sin cocción" },
  { value: "cooked", label: "Natural cocida", description: "Cálculo Kalak común con cocción" },
  { value: "mixed", label: "Mixta", description: "60% natural cocida + 40% comercial" },
  { value: "supplements", label: "Dieta comercial con suplementos", description: "Comercial + suplementos Kalak" },
];

export function DietStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionGroup key={pet.id} title={`Seleccione el tipo de dieta para ${petLabel(pet, i)}`}>
          <ChoiceCards
            name={`diet-${pet.id}`}
            value={pet.diet}
            options={options}
            columns={2}
            onChange={(diet) => dispatch({ type: "updatePet", id: pet.id, patch: { diet } })}
          />
        </QuestionGroup>
      ))}
    </PetStack>
  );
}
