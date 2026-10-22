import catHigh from "../../../../public/images/cat-activity-high.webp";
import catLow from "../../../../public/images/cat-activity-low.webp";
import catMedium from "../../../../public/images/cat-activity-medium.webp";
import dogHigh from "../../../../public/images/pet-activity-high.webp";
import dogLow from "../../../../public/images/pet-activity-low.webp";
import dogMedium from "../../../../public/images/pet-activity-medium.webp";
import type { Activity } from "@/features/ration";
import type { PetDraft } from "../state";
import { ChoiceCards, type CardOption } from "../ui/ChoiceCards";
import { PetStack, QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

function options(pet: PetDraft): CardOption<Activity>[] {
  const cat = pet.species === "cat";
  return [
    { value: "bajo", label: "Baja", description: "Paseos cortos, poca actividad física", image: cat ? catLow : dogLow, alt: "Actividad baja" },
    { value: "normal", label: "Normal", description: "Paseos regulares, actividad moderada", image: cat ? catMedium : dogMedium, alt: "Actividad normal" },
    { value: "alto", label: "Alta", description: "Ejercicio intenso, mucha actividad física", image: cat ? catHigh : dogHigh, alt: "Actividad alta" },
  ];
}

export function ActivityStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionGroup
          key={pet.id}
          title={`¿Cuál es el nivel de actividad de ${petLabel(pet, i)}?`}
          hint="Selecciona la opción que mejor describa la actividad de tu mascota"
        >
          <ChoiceCards
            name={`activity-${pet.id}`}
            value={pet.activity}
            options={options(pet)}
            onChange={(activity) => dispatch({ type: "updatePet", id: pet.id, patch: { activity } })}
          />
        </QuestionGroup>
      ))}
    </PetStack>
  );
}
