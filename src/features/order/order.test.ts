import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";
import { legacyOrder } from "./__fixtures__/legacy";
import { quickOrderMessage, type QuickOrder } from "./order";

const OLD = { formula: { dog: 5000, cat: 5500 }, supplements: { caldo: 2300, curcuma: 3000, calcio: 1100 } };
const LEGACY = { PRECIO_FORMULA_PERROS: 5000, PRECIO_FORMULA_GATOS: 5500, PRECIO_CALCIO: 1100, PRECIO_CALDO: 2300, PRECIO_CURCUMA: 3000 };

const values = ["", "0", "1", "3", "12"];

describe("quick order matches the old /hacer-pedido", () => {
  it("message and wa.me URL for every combination", () => {
    let n = 0;
    for (const dogBags of values)
      for (const catBags of values)
        for (const caldoPots of values)
          for (const calcioPots of ["", "2"])
            for (const curcumaPots of ["", "1"]) {
              const order: QuickOrder = { dogBags, catBags, caldoPots, calcioPots, curcumaPots };
              const name = `Cliente ${n++}`;
              const old = legacyOrder({
                orderDetails: { dogFormulaBags: dogBags, catFormulaBags: catBags, broth: caldoPots, calcium: calcioPots, activatedTurmeric: curcumaPots },
                customerName: name,
                prices: LEGACY,
              }).prepareOrder();
              const message = quickOrderMessage(order, name, OLD);
              expect(message).toBe(old.message);
              expect(whatsappUrl(message)).toBe(old.whatsappUrl);
            }
  });

  it("asks for the price while prices are not loaded", () => {
    expect(quickOrderMessage({ dogBags: "2", catBags: "", caldoPots: "", calcioPots: "", curcumaPots: "" }, "Ana")).toContain(
      "*PRECIO TOTAL: a consultar*",
    );
  });
});
