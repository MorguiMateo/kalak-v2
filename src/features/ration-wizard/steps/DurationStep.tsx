import type { DurationChoice } from "@/features/ration";
import { CUSTOM_DAYS_MAX, parseCustomDays } from "../state";
import { ChoicePills } from "@/components/ui/ChoicePills";
import { inputClasses } from "@/components/ui/input";
import { QuestionGroup } from "../ui/Question";
import type { StepProps } from "./types";

const options: { value: DurationChoice; label: string }[] = [
  { value: "1_week", label: "1 semana" },
  { value: "2_weeks", label: "1 quincena" },
  { value: "1_month", label: "1 mes" },
  { value: "custom", label: "Personalizado" },
];

export function DurationStep({ state, dispatch }: StepProps) {
  const invalid = state.customDays.trim() !== "" && parseCustomDays(state.customDays) === null;
  return (
    <QuestionGroup title="¿Para cuánto tiempo quieres el alimento?">
      <ChoicePills
        name="duration"
        value={state.duration}
        options={options}
        onChange={(duration) => dispatch({ type: "set", patch: { duration } })}
      />
      {state.duration === "custom" && (
        <div className="mt-6 animate-step-in">
          <label htmlFor="custom-days" className="text-[15px] font-medium">
            Indica el número de días:
          </label>
          <input
            id="custom-days"
            className={`${inputClasses({ width: "compact" })} mt-2 tabular-nums`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Número de días"
            value={state.customDays}
            aria-invalid={invalid}
            aria-describedby="custom-days-help"
            onChange={(e) => dispatch({ type: "set", patch: { customDays: e.target.value.replace(/\D/g, "").slice(0, 2) } })}
          />
          <p id="custom-days-help" className={`mt-2 text-sm ${invalid ? "font-medium text-orange-600" : "text-muted"}`}>
            Entre 1 y {CUSTOM_DAYS_MAX} días
          </p>
        </div>
      )}
    </QuestionGroup>
  );
}
