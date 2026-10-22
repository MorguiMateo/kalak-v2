import catImage from "../../../../public/images/cat-normal.webp";
import dogImage from "../../../../public/images/pet-normal.webp";
import { ChoiceCards } from "../ui/ChoiceCards";
import { PetStack, QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

const options = [
  { value: "dog", label: "Perro", image: dogImage },
  { value: "cat", label: "Gato", image: catImage },
] as const;

export function SpeciesStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionGroup
          key={pet.id}
          title={
            state.multiple && i > 0
              ? `${petLabel(pet, i)}: ¿Qué tipo de mascota es?`
              : `¿Qué tipo de mascota ${state.multiple ? "tienen" : "tienes"}?`
          }
        >
          <div className="max-w-xl">
            <ChoiceCards
              name={`species-${pet.id}`}
              value={pet.species}
              options={options}
              onChange={(species) => dispatch({ type: "updatePet", id: pet.id, patch: { species } })}
            />
          </div>
        </QuestionGroup>
      ))}
    </PetStack>
  );
}
