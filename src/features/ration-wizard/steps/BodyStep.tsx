import catNormal from "../../../../public/images/cat-normal.webp";
import catOverweight from "../../../../public/images/cat-overweight.webp";
import catThin from "../../../../public/images/cat-thin.webp";
import dogNormal from "../../../../public/images/pet-normal.webp";
import dogOverweight from "../../../../public/images/pet-overweight.webp";
import dogThin from "../../../../public/images/pet-thin.webp";
import type { BodyCondition } from "@/features/ration";
import { ChoiceCards, type CardOption } from "../ui/ChoiceCards";
import { PetStack, QuestionGroup } from "../ui/Question";
import type { PetDraft } from "../state";
import { petLabel, type StepProps } from "./types";

function options(pet: PetDraft): CardOption<BodyCondition>[] {
  const cat = pet.species === "cat";
  return [
    {
      value: "delgado",
      label: pet.gender === "female" ? "Delgada" : "Delgado",
      description: "Se notan las costillas y tiene poca grasa corporal",
      image: cat ? catThin : dogThin,
      alt: "Mascota delgada",
    },
    {
      value: "normal",
      label: "Normal",
      description: "Peso ideal, costillas palpables con ligera capa de grasa",
      image: cat ? catNormal : dogNormal,
      alt: "Mascota normal",
    },
    {
      value: "sobrepeso",
      label: "Sobrepeso",
      description: "Exceso de grasa corporal, costillas difíciles de palpar",
      image: cat ? catOverweight : dogOverweight,
      alt: "Mascota con sobrepeso",
    },
  ];
}

export function BodyStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionGroup
          key={pet.id}
          title={`¿Cuál es la condición corporal de ${petLabel(pet, i)}?`}
          hint="Selecciona la imagen que más se parezca a tu mascota"
        >
          <ChoiceCards
            name={`body-${pet.id}`}
            value={pet.bodyCondition}
            options={options(pet)}
            onChange={(bodyCondition) => dispatch({ type: "updatePet", id: pet.id, patch: { bodyCondition } })}
          />
        </QuestionGroup>
      ))}
    </PetStack>
  );
}
