import { parseWeight, WEIGHT_MAX, WEIGHT_MIN } from "../state";
import { inputClass } from "../ui/input";
import { PetStack, QuestionField } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

export function WeightStep({ state, dispatch }: StepProps) {
  return (
    <PetStack>
      {state.pets.map((pet, i) => {
        const id = `weight-${pet.id}`;
        const invalid = pet.weight.trim() !== "" && parseWeight(pet.weight) === null;
        return (
          <QuestionField
            key={pet.id}
            htmlFor={id}
            title={`¿Cuál es el peso de ${petLabel(pet, i)}?`}
            hint={
              <details className="group">
                <summary className="cursor-pointer text-[15px] font-medium text-navy underline decoration-line underline-offset-4">
                  Cómo pesar a tu mascota
                </summary>
                <ul className="mt-2 list-disc pl-5 text-[15px]">
                  <li>Pésate tú solo y luego con tu mascota</li>
                  <li>Luego resta tu peso a la suma de ambos</li>
                </ul>
              </details>
            }
          >
            <div className="relative max-w-60">
              <input
                id={id}
                className={`${inputClass} pr-14 tabular-nums`}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0,0"
                value={pet.weight}
                aria-invalid={invalid}
                aria-describedby={`${id}-help`}
                onChange={(e) =>
                  dispatch({
                    type: "updatePet",
                    id: pet.id,
                    patch: { weight: e.target.value.replace(/[^\d.,]/g, "").slice(0, 6) },
                  })
                }
              />
              <span aria-hidden className="pointer-events-none absolute inset-y-0 right-5 grid place-items-center text-muted">
                kg
              </span>
            </div>
            <p id={`${id}-help`} className={`mt-2 text-sm ${invalid ? "font-medium text-orange-600" : "text-muted"}`}>
              Límite: {WEIGHT_MIN.toFixed(3).replace(".", ",")}kg / {WEIGHT_MAX}kg
            </p>
          </QuestionField>
        );
      })}
    </PetStack>
  );
}
