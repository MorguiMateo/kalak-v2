"use client";

import { useEffect, useReducer, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import bannerImage from "../../../public/images/perroComiendo.webp";
import { currentStep, firstReachableStep } from "./navigation";
import { initialState, loadState, saveState, wizardReducer } from "./state";
import { Progress } from "./ui/Progress";

const LEAVE_MS = 260;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Wizard() {
  const [state, dispatch] = useReducer(wizardReducer, undefined, initialState);
  const [leaving, setLeaving] = useState<1 | -1 | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  // Restore the progress saved in this tab.
  useEffect(() => {
    const saved = loadState(sessionStorage);
    dispatch({ type: "hydrate", saved: saved && { ...saved, step: firstReachableStep(saved) } });
  }, []);

  useEffect(() => {
    if (state.ready) saveState(sessionStorage, state);
  }, [state]);

  // After each step change: bring the wizard into view and move focus to the new step.
  useEffect(() => {
    if (!navigated.current) return;
    navigated.current = false;
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) rootRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    stepRef.current?.focus({ preventScroll: true });
  }, [state.step]);

  const { list, index, step, prev, next } = currentStep(state);
  const canContinue = step.complete(state) && next !== undefined;

  function go(target: string, direction: 1 | -1) {
    if (leaving) return;
    navigated.current = true;
    if (prefersReducedMotion()) return dispatch({ type: "goTo", step: target, direction });
    setLeaving(direction);
    window.setTimeout(() => {
      dispatch({ type: "goTo", step: target, direction });
      setLeaving(null);
    }, LEAVE_MS);
  }

  const { Component } = step;
  const names = state.pets.map((p) => p.name.trim()).filter(Boolean);

  return (
    <>
      <PhotoBanner
        image={bannerImage}
        eyebrow="Calculadora de ración"
        title={
          <>
            Calcula la ración de <em>{state.multiple ? "sus mascotas" : "su mascota"}</em>
          </>
        }
      >
        <p className="mt-3 max-w-[46ch] text-white/85">
          Personaliza la alimentación ideal para {state.multiple ? "tus compañeros" : "tu compañero"} de vida
        </p>
      </PhotoBanner>

      <div ref={rootRef} className="mx-auto w-[min(100%-40px,var(--container-calc))] scroll-mt-20 pt-7 pb-30">
        <Progress current={index + 1} total={list.length} names={names} />

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (canContinue) go(next.id, 1);
          }}
        >
          <div
            ref={stepRef}
            tabIndex={-1}
            aria-live="polite"
            className="transition-[opacity,translate] duration-300 outline-none data-leaving:opacity-0 data-leaving:translate-x-(--leave-x)"
            data-leaving={leaving ? "" : undefined}
            style={{ "--leave-x": `${(leaving ?? 1) * -40}px` } as CSSProperties}
          >
            <div
              key={step.id}
              className="animate-step-in"
              style={{ "--enter-x": `${state.direction * 40}px` } as CSSProperties}
            >
              <Component state={state} dispatch={dispatch} />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            {prev ? (
              <Button variant="ghost" onClick={() => go(prev.id, -1)}>
                ← Volver
              </Button>
            ) : (
              <span />
            )}
            {next && (
              <Button type="submit" arrow disabled={!canContinue}>
                Continuar
              </Button>
            )}
          </div>
        </form>

        {index > 0 && (
          <div className="mt-12 border-t border-line pt-5 text-center">
            <button
              type="button"
              className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-navy"
              onClick={() => {
                if (window.confirm("¿Borrar las respuestas y empezar de nuevo?")) {
                  navigated.current = true;
                  dispatch({ type: "reset" });
                }
              }}
            >
              Empezar de nuevo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
