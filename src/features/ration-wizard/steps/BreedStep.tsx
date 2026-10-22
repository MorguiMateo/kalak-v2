import { BreedSelect } from "../ui/BreedSelect";
import { PetStack, QuestionField } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

export function BreedStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionField
          key={pet.id}
          htmlFor={`breed-${pet.id}`}
          title={pet.name ? `¿Qué raza es ${petLabel(pet, i)}?` : `Mascota ${i + 1}: ¿Qué raza es?`}
        >
          <div className="max-w-md">
            <BreedSelect
              id={`breed-${pet.id}`}
              species={pet.species ?? "dog"}
              value={pet.breed}
              onChange={(breed) => dispatch({ type: "updatePet", id: pet.id, patch: { breed } })}
            />
          </div>
        </QuestionField>
      ))}
    </PetStack>
  );
}
