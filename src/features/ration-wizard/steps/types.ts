import type { ComponentType, Dispatch } from "react";
import type { PetDraft, WizardAction, WizardState } from "../state";

export type StepProps = { state: WizardState; dispatch: Dispatch<WizardAction> };

export type StepDef = {
  id: string;
  /** Hidden steps are skipped (e.g. pet management with a single pet). */
  visible?: (state: WizardState) => boolean;
  /** "Continuar" stays disabled until this is true. */
  complete: (state: WizardState) => boolean;
  Component: ComponentType<StepProps>;
};

export const everyPet = (state: WizardState, test: (pet: PetDraft) => boolean) =>
  state.pets.length > 0 && state.pets.every(test);

/** Pet name, or "Mascota N" while it has none. */
export const petLabel = (pet: PetDraft, index: number) => pet.name.trim() || `Mascota ${index + 1}`;
