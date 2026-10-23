export type ContactInput = { name: string; email: string; phone: string; message: string };

/** WhatsApp text for the contact form. */
export function contactMessage({ name, email, phone, message }: ContactInput): string {
  const lines = ["*CONSULTA DESDE LA WEB*", "", message.trim(), "", `* Nombre: ${name.trim()}`, `* Email: ${email.trim()}`];
  if (phone.trim()) lines.push(`* Teléfono: ${phone.trim()}`);
  return lines.join("\n");
}
