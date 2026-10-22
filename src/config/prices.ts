// TODO(precios): load the real prices before the swap (phase 11).
// A price of 0 means "not set yet" and the UI shows "Consultar".

export const prices = {
  /** Food formulas, per kg in ARS. */
  formula: {
    dog: 0,
    cat: 0,
  },
  /** Supplements, per container in ARS. */
  supplements: {
    caldo: 0,
    curcuma: 0,
    calcio: 0,
    colageno: 0,
  },
} as const;

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return amount > 0 ? ars.format(amount) : "Consultar";
}
