import { cacheLife } from "next/cache";
import Link from "next/link";
import { LogoFull } from "@/components/brand/Logo";
import { mainNav, site } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-4 text-white">{title}</h2>
      <ul className="grid gap-2">{children}</ul>
    </div>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="mt-gap bg-navy pt-16 pb-7 text-[15px] text-white/80 [&_a]:transition-colors [&_a:hover]:text-white">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Kalak, inicio" className="inline-block rounded-[28px] bg-white px-4 py-3">
              <LogoFull className="h-24" />
            </Link>
          </div>
          <Column title="Navegación">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </Column>
          <Column title="Atención al cliente">
            <li>
              <a href={whatsappUrl()} {...external}>
                {site.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="break-all">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.social.instagram} {...external}>
                Instagram
              </a>
            </li>
            <li>
              <Link href="/contacto">Contacto</Link>
            </li>
          </Column>
          <Column title={`Puntos de retiro · ${site.city}`}>
            {site.pickupPoints.map((point) => (
              <li key={point.name}>
                <a href={point.mapUrl} {...external}>
                  {point.name}
                </a>
              </li>
            ))}
          </Column>
        </div>
        <p className="mt-12 border-t border-white/15 pt-5 text-sm">
          © <CopyrightYear /> {site.name} · {site.tagline} · {site.city}
        </p>
      </div>
    </footer>
  );
}
