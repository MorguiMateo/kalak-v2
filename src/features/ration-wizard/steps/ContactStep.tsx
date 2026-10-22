import { sanitizePhone } from "../state";
import { inputClass } from "../ui/input";
import type { StepProps } from "./types";

export function ContactStep({ state, dispatch }: StepProps) {
  return (
    <div>
      <h2 className="text-[clamp(26px,3vw,36px)] leading-[1.1]">Tus datos de contacto</h2>
      <p className="mt-2 text-muted">Por favor, comparte tus datos de contacto para completar el pedido:</p>
      <div className="mt-6 grid max-w-md gap-5">
        <div>
          <label htmlFor="customer-name" className="text-[15px] font-medium">
            Nombre completo
          </label>
          <input
            id="customer-name"
            className={`${inputClass} mt-2`}
            placeholder="Escribe tu nombre completo"
            autoComplete="name"
            maxLength={80}
            value={state.customerName}
            onChange={(e) => dispatch({ type: "set", patch: { customerName: e.target.value } })}
          />
        </div>
        <div>
          <label htmlFor="customer-phone" className="text-[15px] font-medium">
            Teléfono de contacto
          </label>
          <input
            id="customer-phone"
            type="tel"
            className={`${inputClass} mt-2`}
            placeholder="Ej: 261-5555555"
            autoComplete="tel"
            maxLength={20}
            aria-describedby="customer-phone-help"
            value={state.customerPhone}
            onChange={(e) => dispatch({ type: "set", patch: { customerPhone: sanitizePhone(e.target.value) } })}
          />
          <p id="customer-phone-help" className="mt-2 text-sm text-muted">
            Este número se usará para contactarte por WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
