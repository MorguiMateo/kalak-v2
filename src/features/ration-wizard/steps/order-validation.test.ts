import { Children, createElement, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/Button";
import { currentStep, firstReachableStep } from "../navigation";
import { initialState, toPet, wizardReducer, type WizardState } from "../state";
import { isEmptyOrder, orderTotals, petOrder, resolveDuration } from "@/features/ration";
import { steps } from "./index";
import { ContactStep } from "./ContactStep";
import { SummaryStep } from "./SummaryStep";

afterEach(() => vi.unstubAllGlobals());

function orderButton(node: ReactNode): { onClick?: () => void } | undefined {
  if (!isValidElement<{ children?: ReactNode; onClick?: () => void }>(node)) return;
  if (node.type === Button && Children.toArray(node.props.children).includes("Hacer pedido")) return node.props;
  return Children.toArray(node.props.children).map(orderButton).find(Boolean);
}

function invokeSend(state: WizardState) {
  const open = vi.fn();
  vi.stubGlobal("window", { open });
  const button = orderButton(SummaryStep({ state, dispatch: vi.fn() }));
  expect(button?.onClick).toBeTypeOf("function");
  button!.onClick!();
  return open;
}

function supplementsOnlyState(): WizardState {
  let state = wizardReducer(initialState(), { type: "setMultiple", multiple: false });
  state = wizardReducer(state, { type: "updatePet", id: state.pets[0].id, patch: { species: "dog" } });
  state = wizardReducer(state, {
    type: "updatePet",
    id: state.pets[0].id,
    patch: {
      gender: "female", name: "Olga", breed: "Sin raza (20-40kg)",
      age: "1-6 años", sterilized: true, weight: "25", bodyCondition: "normal",
      activity: "normal", diet: "supplements", supplements: [],
    },
  });
  return wizardReducer(state, {
    type: "set",
    patch: { duration: "1_month", customerName: "Ana", customerPhone: "261-5551234" },
  });
}

function reachSummary(state: WizardState) {
  while (currentStep(state).next) {
    const { step, next } = currentStep(state);
    expect(step.complete(state), step.id).toBe(true);
    state = wizardReducer(state, { type: "goTo", step: next!.id, direction: 1 });
  }
  expect(state.step).toBe("summary");
  expect(firstReachableStep(state)).toBe("summary");
  return state;
}

describe("supplements-only navigation and checkout", () => {
  it("allows calculation without supplements but cannot send an empty order", () => {
    const state = reachSummary(supplementsOnlyState());
    const pet = toPet(state.pets[0])!;
    expect(isEmptyOrder(orderTotals([petOrder(pet, resolveDuration(state.duration))]))).toBe(true);

    const html = renderToStaticMarkup(createElement(SummaryStep, { state, dispatch: vi.fn() }));
    expect(html).toContain("Tu selección no incluye productos para pedir.");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*aria-describedby="empty-order-help"/);
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("PRECIO TOTAL:");
    expect(invokeSend(state)).not.toHaveBeenCalled();
  });

  it("a real supplement makes that same complete flow orderable", () => {
    let state = supplementsOnlyState();
    state = wizardReducer(state, { type: "updatePet", id: state.pets[0].id, patch: { supplements: ["caldo"] } });
    state = reachSummary(state);
    const html = renderToStaticMarkup(createElement(SummaryStep, { state, dispatch: vi.fn() }));
    expect(html).toContain("PRECIO TOTAL:");
    expect(html).not.toContain('disabled=""');
    expect(html).not.toContain("Tu selección no incluye productos");
    expect(invokeSend(state)).toHaveBeenCalledWith(expect.stringContaining("https://wa.me/"), "_blank", "noopener,noreferrer");
  });

  it("the send handler also refuses a real order without a customer name", () => {
    let state = supplementsOnlyState();
    state = wizardReducer(state, { type: "updatePet", id: state.pets[0].id, patch: { supplements: ["caldo"] } });
    expect(invokeSend({ ...state, customerName: "   " })).not.toHaveBeenCalled();
    expect(invokeSend({ ...state, customerPhone: "12-34 5" })).not.toHaveBeenCalled();
  });
});

describe("contact step validation", () => {
  it("uses the same six-digit requirement as the visible field feedback", () => {
    const contact = steps.find((step) => step.id === "contact")!;
    const state = { ...supplementsOnlyState(), customerPhone: "12-34 5" };
    expect(contact.complete(state)).toBe(false);
    const html = renderToStaticMarkup(createElement(ContactStep, { state, dispatch: vi.fn() }));
    expect(html).toContain("Ingresa al menos 6 dígitos.");
    expect(html).toMatch(/id="customer-phone"[^>]*required=""[^>]*aria-invalid="true"[^>]*aria-describedby="customer-phone-help customer-phone-error"/);
    expect(html).toContain('id="customer-phone-error"');
    expect(contact.complete({ ...state, customerPhone: "12-34 56" })).toBe(true);
  });
});
