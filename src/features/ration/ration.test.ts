import { describe, expect, it } from "vitest";
import { formatPrice } from "@/config/prices";
import { isEmptyOrder, orderMessage, orderPrice, orderTotals, petOrder, resolveDuration, type Pet } from "./index";

const olga: Pet = {
  name: "Olga",
  species: "dog",
  gender: "female",
  breed: "Sin raza (20-40kg)",
  age: "1-6 años",
  sterilized: true,
  weight: 25,
  bodyCondition: "normal",
  activity: "normal",
  diet: "raw",
  supplements: ["calcio"],
};

describe("resolveDuration", () => {
  it("maps choices to days", () => {
    expect(resolveDuration("1_week")).toEqual({ label: "1 semana", days: 7 });
    expect(resolveDuration("custom", "10")).toEqual({ label: "10 días", days: 10 });
    expect(resolveDuration("custom", " ")).toEqual({ label: "1 mes", days: 30 });
  });
});

describe("prices not loaded yet", () => {
  it("UI shows Consultar", () => {
    expect(formatPrice(0)).toBe("Consultar");
  });

  it("order is incomplete and the message asks for the price", () => {
    const totals = { dogBags: 2, catBags: 0, caldoPots: 0, curcumaPots: 0, calcioPots: 0 };
    expect(orderPrice(totals).complete).toBe(false);
    const message = orderMessage({ pets: [olga], duration: "1_month", customer: { name: "A", phone: "1" } });
    expect(message).toContain("*PRECIO TOTAL: a consultar*");
    expect(message).not.toContain("ARS");
  });
});

it("example order (25kg adult dog, raw, 1 month)", () => {
  const message = orderMessage({
    pets: [olga],
    duration: "1_month",
    customer: { name: "Ana", phone: "261 555 1234" },
    prices: { formula: { dog: 3800, cat: 4300 }, supplements: { caldo: 2300, curcuma: 1000, calcio: 1100 } },
  });
  expect(message).toContain("* Kalak para 1 mes: 23 bolsa(s) de 1kg (750g/día)");
  expect(message).toContain("*PRECIO TOTAL: 88500 ARS*");
});

describe("actual order quantities", () => {
  it("detects an empty supplements-only order, including calcium with zero pots", () => {
    for (const supplements of [[], ["calcio"]] as const) {
      const totals = orderTotals([petOrder({ ...olga, diet: "supplements", supplements }, resolveDuration("1_month"))]);
      expect(totals).toEqual({ dogBags: 0, catBags: 0, caldoPots: 0, curcumaPots: 0, calcioPots: 0 });
      expect(isEmptyOrder(totals)).toBe(true);
    }
  });

  it("accepts an aggregate with a real supplement, even before prices load", () => {
    const duration = resolveDuration("1_month");
    const totals = orderTotals([
      petOrder({ ...olga, diet: "supplements", supplements: [] }, duration),
      petOrder({ ...olga, diet: "supplements", supplements: ["curcuma"] }, duration),
    ]);
    expect(isEmptyOrder(totals)).toBe(false);
    expect(totals.curcumaPots).toBeGreaterThan(0);
    expect(orderPrice(totals).complete).toBe(false);
  });
});
