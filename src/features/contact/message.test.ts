import { expect, it } from "vitest";
import { contactMessage } from "./message";

it("contact message includes the optional phone only when given", () => {
  const base = { name: " Ana ", email: "ana@x.com", phone: "", message: "Hola" };
  expect(contactMessage(base)).toBe("*CONSULTA DESDE LA WEB*\n\nHola\n\n* Nombre: Ana\n* Email: ana@x.com");
  expect(contactMessage({ ...base, phone: "261 555" })).toContain("* Teléfono: 261 555");
});
