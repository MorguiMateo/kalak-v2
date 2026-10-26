import { ChoicePills } from "@/components/ui/ChoicePills";
import { PetStack, QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

export function GenderStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionGroup
          key={pet.id}
          title={`${state.multiple ? `${petLabel(pet, i)}: ` : ""}¿Cuál es el género de su ${pet.species === "cat" ? "gato" : "perro"}?`}
        >
          <ChoicePills
            name={`gender-${pet.id}`}
            value={pet.gender}
            options={[
              { value: "male", label: "Macho" },
              { value: "female", label: "Hembra" },
            ]}
            onChange={(gender) => dispatch({ type: "updatePet", id: pet.id, patch: { gender } })}
          />
        </QuestionGroup>
      ))}
    </PetStack>
  );
}
