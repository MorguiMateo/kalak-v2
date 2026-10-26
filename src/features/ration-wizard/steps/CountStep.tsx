import { ChoicePills } from "@/components/ui/ChoicePills";
import { QuestionGroup } from "../ui/Question";
import type { StepProps } from "./types";

export function CountStep({ state, dispatch }: StepProps) {
  return (
    <QuestionGroup title="¿Cuántas mascotas quieres calcular?">
      <ChoicePills
        name="count"
        value={state.multiple === null ? null : state.multiple ? "many" : "one"}
        options={[
          { value: "one", label: "Una mascota" },
          { value: "many", label: "Varias mascotas" },
        ]}
        onChange={(v) => dispatch({ type: "setMultiple", multiple: v === "many" })}
      />
    </QuestionGroup>
  );
}
