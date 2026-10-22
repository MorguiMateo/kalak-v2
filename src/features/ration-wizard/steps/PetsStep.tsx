import { Button } from "@/components/ui/Button";
import { QuestionGroup } from "../ui/Question";
import { petLabel, type StepProps } from "./types";

export function PetsStep({ state, dispatch }: StepProps) {
  return (
    <QuestionGroup title="Gestiona tus mascotas">
      <ul className="grid gap-gap">
        {state.pets.map((pet, i) => (
          <li
            key={pet.id}
            className="flex items-center justify-between gap-4 rounded-tile bg-white py-3 pr-3 pl-5 shadow-[inset_0_0_0_1.5px_var(--color-line)]"
          >
            <span>
              <span className="font-display text-xl font-semibold">Mascota {i + 1}</span>
              {pet.name && <span className="text-muted">: {pet.name}</span>}
              {pet.species && (
                <span className="block text-sm text-muted">{pet.species === "dog" ? "Perro" : "Gato"}</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "removePet", id: pet.id })}
              disabled={state.pets.length === 1}
              aria-label={`Quitar ${petLabel(pet, i)}`}
              className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-sand-100 hover:text-navy disabled:pointer-events-none disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="mt-4 px-0 text-green-700 hover:text-green-700" onClick={() => dispatch({ type: "addPet" })}>
        + Agregar otra mascota
      </Button>
    </QuestionGroup>
  );
}
