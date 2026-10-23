"use client";

import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/features/ration-wizard/ui/input";
import { sanitizePhone } from "@/features/ration-wizard/state";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/whatsapp";
import { contactMessage, type ContactInput } from "./message";

const empty: ContactInput = { name: "", email: "", phone: "", message: "" };

/**
 * The old form only simulated sending. This one opens WhatsApp with the message ready to send,
 * so nothing gets lost.
 */
export function ContactForm() {
  const [form, setForm] = useState(empty);
  const set = (key: keyof ContactInput) => (e: { target: { value: string } }) =>
    setForm({ ...form, [key]: key === "phone" ? sanitizePhone(e.target.value) : e.target.value });

  function submit(e: FormEvent) {
    e.preventDefault();
    window.open(whatsappUrl(contactMessage(form)), "_blank", "noopener,noreferrer");
  }

  const label = "text-[15px] font-medium";
  return (
    <form onSubmit={submit} className="grid gap-5">
      <div>
        <label htmlFor="name" className={label}>
          Nombre completo
        </label>
        <input id="name" required autoComplete="name" placeholder="Tu nombre" className={cn(inputClass, "mt-2 max-w-none")} value={form.name} onChange={set("name")} />
      </div>
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input id="email" type="email" required autoComplete="email" placeholder="tu@email.com" className={cn(inputClass, "mt-2 max-w-none")} value={form.email} onChange={set("email")} />
      </div>
      <div>
        <label htmlFor="phone" className={label}>
          Teléfono (opcional)
        </label>
        <input id="phone" type="tel" autoComplete="tel" placeholder="Ej: 261-5555555" className={cn(inputClass, "mt-2 max-w-none")} value={form.phone} onChange={set("phone")} />
      </div>
      <div>
        <label htmlFor="message" className={label}>
          Mensaje
        </label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="Escribe tu mensaje aquí..."
          className={cn(inputClass, "mt-2 h-auto max-w-none resize-y py-4")}
          value={form.message}
          onChange={set("message")}
        />
      </div>
      <div>
        <Button type="submit">
          <WhatsAppIcon size={20} />
          Enviar Mensaje
        </Button>
        <p className="mt-2 text-sm text-muted">Se abre WhatsApp con tu mensaje listo para enviar.</p>
      </div>
    </form>
  );
}
