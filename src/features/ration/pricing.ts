import { prices as configuredPrices } from "@/config/prices";
import type { OrderTotals } from "./order";

export type PriceList = {
  formula: { dog: number; cat: number };
  supplements: { caldo: number; curcuma: number; calcio: number };
};

export type OrderPrice = {
  dogFormula: number;
  catFormula: number;
  calcio: number;
  caldo: number;
  curcuma: number;
  total: number;
  /** False while a product in the order has no price loaded (price 0): show "Consultar". */
  complete: boolean;
};

export function orderPrice(totals: OrderTotals, list: PriceList = configuredPrices): OrderPrice {
  const lines: Array<[quantity: number, unitPrice: number]> = [
    [totals.dogBags, list.formula.dog],
    [totals.catBags, list.formula.cat],
    [totals.calcioPots, list.supplements.calcio],
    [totals.caldoPots, list.supplements.caldo],
    [totals.curcumaPots, list.supplements.curcuma],
  ];
  const [dogFormula, catFormula, calcio, caldo, curcuma] = lines.map(([q, p]) => q * p);
  return {
    dogFormula,
    catFormula,
    calcio,
    caldo,
    curcuma,
    total: dogFormula + catFormula + calcio + caldo + curcuma,
    complete: lines.every(([q, p]) => q === 0 || p > 0),
  };
}
