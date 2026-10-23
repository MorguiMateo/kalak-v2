import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import calcioImage from "../../../../public/images/calcio2.webp";
import caldoImage from "../../../../public/images/caldo2.webp";
import curcumaImage from "../../../../public/images/curcuma2.webp";
import { formatPrice, prices } from "@/config/prices";
import { caldoDosage, calcioIncluded, curcumaDosage, type Supplement } from "@/features/ration";
import { cn } from "@/lib/cn";
import { parseWeight, type PetDraft } from "../state";
import { CardImage, CardText, CheckBadge, cardClass } from "../ui/ChoiceCards";
import { PetStack, QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

type Card = {
  id: Supplement;
  label: string;
  description: string;
  image: StaticImageData;
  checked: boolean;
  disabled: boolean;
  details: ReactNode;
};

function cards(pet: PetDraft): Card[] {
  const weight = parseWeight(pet.weight) ?? 0;
  const age = pet.age ?? "1-6 años";
  const caldo = caldoDosage({ weight, age });
  const curcuma = curcumaDosage({ weight });
  const natural = pet.diet !== null && calcioIncluded({ diet: pet.diet });
  const has = (s: Supplement) => pet.supplements.includes(s);
  const price = (p: number) => <p className="mt-2 font-medium text-green-700">Precio: {p > 0 ? `${formatPrice(p)}/pote` : "Consultar"}</p>;

  return [
    {
      id: "caldo",
      label: "Caldo",
      description: "Mejora la digestión y fortalece el sistema inmunológico.",
      image: caldoImage,
      checked: has("caldo"),
      disabled: false,
      details: (
        <>
          <p className="font-medium text-charcoal">Dosis recomendada:</p>
          <p>{caldo.dailyDose} cucharada(s) por día</p>
          <p>{caldo.monthlyPots} pote(s) al mes</p>
          <p className="mt-1 text-xs italic">1 pote = 30 cucharadas</p>
          {price(prices.supplements.caldo)}
        </>
      ),
    },
    {
      id: "curcuma",
      label: "Curcuma activada",
      description: "Potente antiinflamatorio natural y antioxidante.",
      image: curcumaImage,
      checked: has("curcuma"),
      disabled: false,
      details: (
        <>
          <p className="font-medium text-charcoal">Dosis recomendada:</p>
          <p>{curcuma.dailyDose} cucharadita(s) por día</p>
          <p>{curcuma.monthlyPots} pote(s) al mes</p>
          <p className="mt-1 text-xs italic">1 pote = 10 cucharaditas</p>
          {price(prices.supplements.curcuma)}
        </>
      ),
    },
    {
      id: "calcio",
      label: "Calcio",
      description: "Esencial para huesos y dientes, especialmente para dietas naturales.",
      image: calcioImage,
      checked: natural,
      disabled: true,
      details: (
        <>
          <p className={cn("font-medium", natural ? "text-green-700" : "text-orange-600")}>
            {natural
              ? "* Preseleccionado automáticamente y obligatorio para dietas naturales"
              : "* No disponible: La comida comercial ya incluye calcio"}
          </p>
          <p>{natural ? "Recomendado para dieta natural (1 pote al mes)" : "No es necesario si ya consume alimento comercial"}</p>
          {price(prices.supplements.calcio)}
        </>
      ),
    },
  ];
}

export function SupplementsStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => (
        <QuestionGroup
          key={pet.id}
          title={`Agregar suplementos para ${petLabel(pet, i)}`}
          hint={`Seleccione los suplementos que desea agregar para ${petLabel(pet, i)}:`}
        >
          <div className="grid gap-gap sm:grid-cols-3">
            {cards(pet).map((card) => (
              <label key={card.id} className={cn(cardClass(card.checked, card.disabled), card.disabled && !card.checked && "opacity-60")}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={card.checked}
                  disabled={card.disabled}
                  onChange={() =>
                    dispatch({
                      type: "updatePet",
                      id: pet.id,
                      patch: {
                        supplements: card.checked
                          ? pet.supplements.filter((s) => s !== card.id)
                          : [...pet.supplements, card.id],
                      },
                    })
                  }
                />
                <CheckBadge checked={card.checked} />
                <CardImage image={card.image} sizes="(max-width: 640px) 100vw, 300px" />
                <CardText label={card.label}>
                  <span className="mt-1 text-sm text-muted">{card.description}</span>
                  <span className="mt-3 block space-y-0.5 text-sm text-muted">{card.details}</span>
                </CardText>
              </label>
            ))}
          </div>
        </QuestionGroup>
      ))}
    </PetStack>
  );
}
