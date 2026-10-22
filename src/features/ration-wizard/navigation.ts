import type { WizardState } from "./state";
import { steps, type StepDef } from "./steps";

export function visibleSteps(state: WizardState): StepDef[] {
  return steps.filter((step) => step.visible?.(state) ?? true);
}

/** Position of the current step among the visible ones (falls back to the first). */
export function currentStep(state: WizardState) {
  const list = visibleSteps(state);
  const index = Math.max(0, list.findIndex((s) => s.id === state.step));
  return {
    list,
    index,
    step: list[index],
    prev: list[index - 1],
    next: list[index + 1],
  };
}

/**
 * A restored step is only valid if every step before it is complete;
 * otherwise go back to the first incomplete one.
 */
export function firstReachableStep(state: WizardState): string {
  const list = visibleSteps(state);
  const index = list.findIndex((s) => s.id === state.step);
  // Unknown step (e.g. saved by an older version): resume at the first incomplete one.
  const end = index === -1 ? list.length - 1 : index;
  const blocked = list.slice(0, end).find((s) => !s.complete(state));
  return blocked?.id ?? list[end].id;
}
