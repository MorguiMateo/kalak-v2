import { useState } from "react";
import { inputClass } from "@/components/ui/input";
import { isValidPhone, PHONE_MIN_DIGITS, sanitizePhone } from "@/lib/phone";
import type { StepProps } from "./types";

export function ContactStep({ state, dispatch }: StepProps) {
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const nameInvalid = nameTouched && !state.customerName.trim();
  const phoneInvalid = (phoneTouched || Boolean(state.customerPhone)) && !isValidPhone(state.customerPhone);

  return (
    <div>
      <h2 className="text-[clamp(26px,3vw,36px)] leading-[1.1]">Tus datos de contacto</h2>
      <p className="mt-2 text-muted">Por favor, comparte tus datos de contacto para completar el pedido:</p>
      <div className="mt-6 grid max-w-md gap-5">
        <div>
          <label htmlFor="customer-name" className="text-[15px] font-medium">
            Nombre completo (obligatorio)
          </label>
          <input
            id="customer-name"
            className={`${inputClass} mt-2`}
            placeholder="Escribe tu nombre completo"
            autoComplete="name"
            required
            aria-invalid={nameInvalid || undefined}
            aria-describedby={nameInvalid ? "customer-name-error" : undefined}
            maxLength={80}
            value={state.customerName}
            onBlur={() => setNameTouched(true)}
            onChange={(e) => dispatch({ type: "set", patch: { customerName: e.target.value } })}
          />
          {nameInvalid && <p id="customer-name-error" className="mt-2 text-sm text-orange-600">Escribe tu nombre para continuar.</p>}
        </div>
        <div>
          <label htmlFor="customer-phone" className="text-[15px] font-medium">
            Teléfono de contacto (obligatorio)
          </label>
          <input
            id="customer-phone"
            type="tel"
            className={`${inputClass} mt-2`}
            placeholder="Ej: 261-5555555"
            autoComplete="tel"
            required
            maxLength={20}
            aria-invalid={phoneInvalid || undefined}
            aria-describedby={`customer-phone-help${phoneInvalid ? " customer-phone-error" : ""}`}
            value={state.customerPhone}
            onBlur={() => setPhoneTouched(true)}
            onChange={(e) => dispatch({ type: "set", patch: { customerPhone: sanitizePhone(e.target.value) } })}
          />
          <p id="customer-phone-help" className="mt-2 text-sm text-muted">
            Ingresa al menos {PHONE_MIN_DIGITS} dígitos. Este número se usará para contactarte por WhatsApp.
          </p>
          {phoneInvalid && (
            <p id="customer-phone-error" className="mt-2 text-sm text-orange-600">
              El teléfono debe tener al menos {PHONE_MIN_DIGITS} dígitos; los espacios y guiones no cuentan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
