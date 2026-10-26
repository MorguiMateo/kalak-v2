import { sanitizeName } from "../state";
import { PetStack, QuestionField } from "../ui/Question";
import { inputClass } from "@/components/ui/input";
import type { StepProps } from "./types";

export function NameStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionField
          key={pet.id}
          htmlFor={`name-${pet.id}`}
          title={`${state.multiple ? `Mascota ${i + 1}: ` : ""}¿Cómo se llama su ${pet.species === "cat" ? "gato" : "perro"}?`}
        >
          <input
            id={`name-${pet.id}`}
            className={inputClass}
            placeholder="Escribe su nombre aquí"
            autoComplete="off"
            maxLength={40}
            value={pet.name}
            onChange={(e) => dispatch({ type: "updatePet", id: pet.id, patch: { name: sanitizeName(e.target.value) } })}
          />
        </QuestionField>
      ))}
    </PetStack>
  );
}
