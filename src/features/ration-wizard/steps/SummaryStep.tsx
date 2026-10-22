import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { formatPrice } from "@/config/prices";
import {
  DIET_TEXT,
  orderMessage,
  orderPrice,
  orderTotals,
  petOrder,
  resolveDuration,
  type Pet,
  type PetOrder,
} from "@/features/ration";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/whatsapp";
import { toPet } from "../state";
import type { StepProps } from "./types";

/** "Olga", "Olga y Tini", "Olga, Tini y Mora". */
export function joinNames(names: string[]) {
  return names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} y ${names.at(-1)}`;
}

const grams = (n: number) => n.toFixed(0);

export function SummaryStep({ state, dispatch }: StepProps) {
  const pets = state.pets.map(toPet).filter((p): p is Pet => p !== null);
  const duration = resolveDuration(state.duration, state.customDays);
  const orders = pets.map((pet) => petOrder(pet, duration));
  const totals = orderTotals(orders);
  const price = orderPrice(totals);
  const customer = { name: state.customerName.trim(), phone: state.customerPhone.trim() };
  const href = whatsappUrl(orderMessage({ pets, duration: state.duration, customDays: state.customDays, customer }));

  const lines = [
    { label: "Fórmula perros", qty: totals.dogBags, unit: "kg", amount: price.dogFormula },
    { label: "Fórmula gatos", qty: totals.catBags, unit: "kg", amount: price.catFormula },
    { label: "Calcio", qty: totals.calcioPots, unit: "pote(s)", amount: price.calcio },
    { label: "Caldo", qty: totals.caldoPots, unit: "pote(s)", amount: price.caldo },
    { label: "Cúrcuma activada", qty: totals.curcumaPots, unit: "pote(s)", amount: price.curcuma },
  ].filter((l) => l.qty > 0);

  return (
    <div>
      <p className="eyebrow text-muted">Resumen · {duration.label}</p>
      <h2 className="mt-3 text-[clamp(28px,3.2vw,40px)]">
        ¡Hemos calculado la ración ideal para <em>{joinNames(pets.map((p) => p.name))}</em>!
      </h2>

      <div className="mt-8 grid gap-gap sm:grid-cols-2">
        {orders.map((order) => (
          <PetCard key={order.pet.name} order={order} durationLabel={duration.label} />
        ))}
      </div>

      <section aria-labelledby="order-detail" className="mt-gap rounded-tile bg-white p-6 shadow-[inset_0_0_0_1.5px_var(--color-line)]">
        <h3 id="order-detail" className="text-2xl">
          Detalle del pedido
        </h3>
        <dl className="mt-4 divide-y divide-line">
          {lines.map((line) => (
            <div key={line.label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt>
                {line.label}: <span className="font-semibold text-green-700">{line.qty} {line.unit}</span>
              </dt>
              <dd className="tabular-nums">{price.complete ? formatPrice(line.amount) : "Consultar"}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 pt-4 text-lg font-semibold">
            <dt>PRECIO TOTAL:</dt>
            <dd className="tabular-nums text-green-700">{price.complete ? formatPrice(price.total) : "A consultar"}</dd>
          </div>
        </dl>
        {!price.complete && (
          <p className="mt-3 text-sm text-muted">Te confirmamos el precio por WhatsApp al recibir el pedido.</p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn(buttonClasses({}), "max-sm:w-full")}>
          <WhatsAppIcon size={20} />
          Hacer pedido
        </a>
        <button
          type="button"
          className={cn(buttonClasses({ variant: "ghost" }), "max-sm:w-full")}
          onClick={() => dispatch({ type: "goTo", step: "contact", direction: -1 })}
        >
          Editar datos de contacto
        </button>
      </div>
      <p className="mt-3 text-sm text-muted">Se abre WhatsApp con el pedido listo para enviar.</p>
    </div>
  );
}

function PetCard({ order, durationLabel }: { order: PetOrder; durationLabel: string }) {
  const { pet, dailyKalak, bags, caldo, curcuma, calcio } = order;
  return (
    <article className="rounded-tile bg-white p-6 shadow-[inset_0_0_0_1.5px_var(--color-line)]">
      <h3 className="text-2xl">{pet.name}</h3>
      <p className="mt-1 text-sm text-muted">{DIET_TEXT[pet.diet]}</p>
      <ul className="mt-4 grid gap-1.5 text-[15px]">
        {pet.diet === "supplements" ? (
          <li>Solo suplementos</li>
        ) : (
          <>
            <li>
              <span className="font-display text-3xl font-semibold text-green-700">{grams(dailyKalak)} g</span>{" "}
              <span className="text-muted">de Kalak por día</span>
            </li>
            <li>
              Kalak para {durationLabel}: <b>{bags} bolsa(s) de 1kg</b>
            </li>
          </>
        )}
        {pet.diet === "mixed" && <li>Alimento comercial: 40% de lo habitual</li>}
        {caldo && <li>Caldo: {caldo.dailyDose} cucharada(s)/día · {caldo.monthlyPots} pote(s)</li>}
        {curcuma && <li>Cúrcuma activada: {curcuma.dailyDose} cucharadita(s)/día · {curcuma.monthlyPots} pote(s)</li>}
        {calcio ? <li>Calcio: {calcio} pote(s) al mes</li> : null}
      </ul>
    </article>
  );
}
