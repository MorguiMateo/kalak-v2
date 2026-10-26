import { dailyKalakGrams, kalakBags, type Duration } from "./portion";
import { caldoDosage, calcioPots, curcumaDosage, type Dosage } from "./supplements";
import type { Pet } from "./types";

export type PetOrder = {
  pet: Pet;
  /** Kalak grams per day (0 for supplements-only diets). */
  dailyKalak: number;
  /** 1kg bags for the whole duration. */
  bags: number;
  caldo?: Dosage;
  curcuma?: Dosage;
  /** Calcio pots per month; only set when the pet takes calcio. */
  calcio?: number;
};

export type OrderTotals = {
  /** 1kg bags of the dog / cat formula. */
  dogBags: number;
  catBags: number;
  caldoPots: number;
  curcumaPots: number;
  calcioPots: number;
};

/** An order needs at least one actual product, independently of its price. */
export const isEmptyOrder = (totals: OrderTotals) =>
  !Object.values(totals).some((quantity) => Number.isFinite(quantity) && quantity > 0);

export function petOrder(pet: Pet, duration: Duration): PetOrder {
  const dailyKalak = pet.diet === "supplements" ? 0 : dailyKalakGrams(pet);
  return {
    pet,
    dailyKalak,
    bags: pet.diet === "supplements" ? 0 : kalakBags(dailyKalak, duration.days),
    caldo: pet.supplements.includes("caldo") ? caldoDosage(pet) : undefined,
    curcuma: pet.supplements.includes("curcuma") ? curcumaDosage(pet) : undefined,
    calcio: pet.supplements.includes("calcio") ? calcioPots(pet) : undefined,
  };
}

export function orderTotals(orders: readonly PetOrder[]): OrderTotals {
  const totals: OrderTotals = { dogBags: 0, catBags: 0, caldoPots: 0, curcumaPots: 0, calcioPots: 0 };
  for (const order of orders) {
    if (order.pet.species === "dog") totals.dogBags += order.bags;
    else totals.catBags += order.bags;
    totals.caldoPots += order.caldo?.monthlyPots ?? 0;
    totals.curcumaPots += order.curcuma?.monthlyPots ?? 0;
    totals.calcioPots += order.calcio ?? 0;
  }
  return totals;
}
