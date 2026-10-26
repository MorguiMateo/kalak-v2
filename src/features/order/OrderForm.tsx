"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { surfaceClasses } from "@/components/ui/Card";
import { ChoicePills } from "@/components/ui/ChoicePills";
import { inputClass } from "@/components/ui/input";
import { Progress } from "@/components/ui/Progress";
import { formatPrice, prices } from "@/config/prices";
import { ctaLinks } from "@/config/site";
import { isEmptyOrder, orderPrice } from "@/features/ration";
import { cn } from "@/lib/cn";
import { emptyQuickOrder, quickOrderWhatsappUrl, quickOrderTotals, type QuickOrder } from "./order";

const fields: { key: keyof QuickOrder; label: string; placeholder: string; unit: string; price: number }[] = [
  { key: "dogBags", label: "Bolsas fórmula perros", placeholder: "Cantidad de bolsas", unit: "kg", price: prices.formula.dog },
  { key: "catBags", label: "Bolsas fórmula gatos", placeholder: "Cantidad de bolsas", unit: "kg", price: prices.formula.cat },
  { key: "caldoPots", label: "Caldo de colágeno", placeholder: "Cantidad de potes", unit: "pote(s)", price: prices.supplements.caldo },
  { key: "calcioPots", label: "Calcio", placeholder: "Cantidad de potes", unit: "pote(s)", price: prices.supplements.calcio },
  { key: "curcumaPots", label: "Cúrcuma activada", placeholder: "Cantidad de potes", unit: "pote(s)", price: prices.supplements.curcuma },
];

const title = "text-[clamp(26px,3vw,36px)] leading-[1.1]";

export function OrderForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orderedBefore, setOrderedBefore] = useState<boolean | null>(null);
  const [order, setOrder] = useState<QuickOrder>(emptyQuickOrder);
  const [name, setName] = useState("");
  const stepContent = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    const content = stepContent.current;
    content?.focus({ preventScroll: true });
    const top = content?.getBoundingClientRect().top;
    if (content && top !== undefined && (top < 0 || top >= window.innerHeight)) {
      content.scrollIntoView({ block: "start" });
    }
  }, [step]);

  const totals = quickOrderTotals(order);
  const price = orderPrice(totals);
  const canSend = Boolean(name.trim()) && !isEmptyOrder(totals);
  const lineAmount = (key: keyof QuickOrder) =>
    ({ dogBags: price.dogFormula, catBags: price.catFormula, caldoPots: price.caldo, calcioPots: price.calcio, curcumaPots: price.curcuma })[key];

  function next() {
    if (step === 1) {
      if (orderedBefore === null) return;
      if (orderedBefore === false) return router.push(ctaLinks.calculator.href);
      return setStep(2);
    }
    if (!isEmptyOrder(totals)) setStep(3);
  }

  function sendOrder() {
    const href = quickOrderWhatsappUrl(order, name);
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto w-[min(100%-40px,var(--container-calc))] pt-7 pb-30">
      <Progress current={step} total={3} names={[]} />

      <div key={step} ref={stepContent} tabIndex={-1} role="group" aria-labelledby="quick-order-step-title" className="mt-8 animate-step-in">
        {step === 1 && (
          <fieldset>
            <legend id="quick-order-step-title" className={cn(title, "float-left w-full font-display font-semibold")}>¿Ha realizado un pedido antes?</legend>
            <p className="clear-both pt-2 pb-6 text-muted">Tu respuesta nos ayudará a brindarte un mejor servicio</p>
            <ChoicePills
              name="ordered-before"
              value={orderedBefore === null ? null : orderedBefore ? "yes" : "no"}
              options={[
                { value: "yes", label: "Sí, he pedido antes" },
                { value: "no", label: "No, es mi primer pedido" },
              ]}
              onChange={(v) => setOrderedBefore(v === "yes")}
            />
            {orderedBefore === false && (
              <p className="mt-4 text-[15px] text-muted">Te llevamos a la calculadora para armar la ración ideal de tu mascota.</p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <h2 id="quick-order-step-title" className={title}>Detalles de tu pedido</h2>
            <p className="mt-2 text-muted">Por favor, indica las cantidades de cada producto que deseas</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key}>
                  <label htmlFor={f.key} className="text-[15px] font-medium">
                    {f.label}
                  </label>
                  <input
                    id={f.key}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={f.placeholder}
                    className={cn(inputClass, "mt-2 tabular-nums")}
                    value={order[f.key]}
                    onChange={(e) => setOrder({ ...order, [f.key]: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                  />
                  <p className="mt-1.5 text-sm text-muted">
                    {f.price > 0 ? `${formatPrice(f.price)} / ${f.unit === "kg" ? "kg" : "pote"}` : "Precio: Consultar"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 id="quick-order-step-title" className={title}>Resumen de tu pedido</h2>
            <p className="mt-2 text-muted">Revisa el detalle de tu pedido antes de confirmar</p>
            <section aria-labelledby="detail" className={cn(surfaceClasses({ variant: "outlined" }), "mt-6 p-6")}>
              <h3 id="detail" className="text-2xl">
                Detalle del pedido
              </h3>
              {isEmptyOrder(totals) ? (
                <p className="mt-4 text-muted">Todavía no agregaste productos.</p>
              ) : (
                <dl className="mt-4 divide-y divide-line">
                  {fields
                    .filter((f) => totals[f.key] > 0)
                    .map((f) => (
                      <div key={f.key} className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt>
                          {f.label}: <span className="font-semibold text-green-700">{order[f.key]} {f.unit}</span>
                        </dt>
                        <dd className="tabular-nums">{price.complete ? formatPrice(lineAmount(f.key)) : "Consultar"}</dd>
                      </div>
                    ))}
                  <div className="flex items-baseline justify-between gap-4 pt-4 text-lg font-semibold">
                    <dt>PRECIO TOTAL:</dt>
                    <dd className="tabular-nums text-green-700">{price.complete ? formatPrice(price.total) : "A consultar"}</dd>
                  </div>
                </dl>
              )}
            </section>
            <div className="mt-6 max-w-md">
              <label htmlFor="customer-name" className="text-[15px] font-medium">
                Nombre completo
              </label>
              <input
                id="customer-name"
                className={cn(inputClass, "mt-2")}
                placeholder="Escribe tu nombre completo"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="mt-2 text-sm text-muted">Te contactaremos por WhatsApp para confirmar y coordinar la entrega</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            ← Volver
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button arrow disabled={step === 1 ? orderedBefore === null : isEmptyOrder(totals)} onClick={next}>
            Continuar
          </Button>
        ) : (
          <Button disabled={!canSend} onClick={sendOrder}>
            <WhatsAppIcon size={20} />
            Hacer pedido
          </Button>
        )}
      </div>
    </div>
  );
}
