import type { Metadata } from "next";
import { Guarda } from "@/components/brand/Guarda";
import { surfaceClasses } from "@/components/ui/Card";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import { ContactForm } from "@/features/contact/ContactForm";
import { images } from "@/lib/images";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá a Kalak por WhatsApp o email. Puntos de retiro en Mendoza.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const card = surfaceClasses({ variant: "outlined" }) + " p-6 lg:p-8";

export default function ContactoPage() {
  return (
    <>
      <PhotoBanner
        image={images.muchosGatos}
        eyebrow="Estamos listos para ayudarte"
        title={
          <>
            <em>Contáctanos</em>
          </>
        }
      />
      <Guarda />
      <div className="container-site grid gap-gap pt-12 pb-16 lg:grid-cols-[1fr_1.3fr] lg:pt-18 lg:pb-24">
        <Reveal className={card}>
          <h2 className="text-[clamp(26px,3vw,36px)]">Información de Contacto</h2>
          <dl className="mt-6 grid gap-5">
            <div>
              <dt className="eyebrow text-muted">Teléfono</dt>
              <dd className="mt-1.5 text-lg font-semibold">
                <a href={whatsappUrl()} {...external} className="hover:text-orange-600">
                  {site.whatsapp.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Email</dt>
              <dd className="mt-1.5 text-lg font-semibold break-all">
                <a href={`mailto:${site.email}`} className="hover:text-orange-600">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Puntos de Entrega</dt>
              <dd className="mt-1.5">
                <ul className="grid gap-1.5">
                  {site.pickupPoints.map((p) => (
                    <li key={p.name}>
                      <a href={p.mapUrl} {...external} className="font-medium underline decoration-line underline-offset-4 hover:text-orange-600">
                        {p.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <p className="mt-8 font-display text-xl leading-snug text-orange-600">
            ¡Nos encantaría escuchar sobre tu mascota y ayudarte a encontrar la mejor opción de alimentación natural!
          </p>
        </Reveal>
        <Reveal index={1} className={card}>
          <h2 className="mb-6 text-[clamp(26px,3vw,36px)]">Envíanos un Mensaje</h2>
          <ContactForm />
        </Reveal>
      </div>
    </>
  );
}
