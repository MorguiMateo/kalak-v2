import { isEmptyOrder, orderPrice, type OrderTotals, type PriceList } from "@/features/ration";
import { whatsappUrl } from "@/lib/whatsapp";

/** Quantities typed in /hacer-pedido. Raw input strings; empty = 0. */
export type QuickOrder = {
  dogBags: string;
  catBags: string;
  caldoPots: string;
  calcioPots: string;
  curcumaPots: string;
};

export const emptyQuickOrder: QuickOrder = { dogBags: "", catBags: "", caldoPots: "", calcioPots: "", curcumaPots: "" };

const count = (v: string) => parseInt(v) || 0;

export function quickOrderTotals(order: QuickOrder): OrderTotals {
  return {
    dogBags: count(order.dogBags),
    catBags: count(order.catBags),
    caldoPots: count(order.caldoPots),
    calcioPots: count(order.calcioPots),
    curcumaPots: count(order.curcumaPots),
  };
}

export function quickOrderWhatsappUrl(order: QuickOrder, customerName: string): string | null {
  if (!customerName.trim() || isEmptyOrder(quickOrderTotals(order))) return null;
  return whatsappUrl(quickOrderMessage(order, customerName.trim()));
}

/** WhatsApp text for a repeat order. Same format as the old /hacer-pedido (checked by golden tests). */
export function quickOrderMessage(order: QuickOrder, customerName: string, prices?: PriceList): string {
  const t = quickOrderTotals(order);
  const price = orderPrice(t, prices);
  const out: string[] = ["*PEDIDO KALAK*\n"];

  if (price.complete) {
    out.push(`*PRECIO TOTAL: ${price.total} ARS*`);
    if (price.dogFormula > 0) out.push(`Fórmula perros: ${price.dogFormula} ARS`);
    if (price.catFormula > 0) out.push(`Fórmula gatos: ${price.catFormula} ARS`);
    if (price.calcio > 0) out.push(`Calcio: ${price.calcio} ARS`);
    if (price.caldo > 0) out.push(`Caldo: ${price.caldo} ARS`);
    if (price.curcuma > 0) out.push(`Cúrcuma activada: ${price.curcuma} ARS`);
  } else {
    out.push("*PRECIO TOTAL: a consultar*");
  }
  out.push("");

  out.push("*RESUMEN DEL PEDIDO:*");
  if (t.dogBags > 0) out.push(`Fórmula perros: ${order.dogBags} bolsa(s) de 1kg`);
  if (t.catBags > 0) out.push(`Fórmula gatos: ${order.catBags} bolsa(s) de 1kg`);
  if (t.caldoPots > 0) out.push(`Caldo: ${order.caldoPots} pote(s)`);
  if (t.curcumaPots > 0) out.push(`Cúrcuma activada: ${order.curcumaPots} pote(s)`);
  if (t.calcioPots > 0) out.push(`Calcio: ${order.calcioPots} pote(s)`);
  out.push("");

  out.push("*Datos de contacto:*", `* Nombre: ${customerName}`, "¡Gracias!");
  return out.join("\n");
}
