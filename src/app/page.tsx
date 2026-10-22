import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Guarda } from "@/components/brand/Guarda";
import { ctaLinks } from "@/config/site";

// TODO(fase 6): replace this placeholder with the real Home (content/home.ts).
export default function HomePage() {
  return (
    <>
      <div className="container-site pt-36 pb-16 lg:pt-44">
        <p className="eyebrow text-muted">Alimentación natural · Mendoza</p>
        <h1 className="mt-4 max-w-[11ch] text-[clamp(52px,8vw,112px)]">
          Comida <em>real</em> para mascotas
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ctaLinks.calculator.href} arrow className="max-lg:flex-1">
            {ctaLinks.calculator.label}
          </ButtonLink>
          <ButtonLink href={ctaLinks.order.href} variant="ghost">
            {ctaLinks.order.label}
          </ButtonLink>
        </div>
      </div>
      <Guarda />
      <Section eyebrow="En construcción" title={<>La Home llega en la <em>fase 6</em></>}>
        <div className="grid gap-gap sm:grid-cols-3">
          {["Header", "Footer", "Reveal"].map((name, i) => (
            <Reveal key={name} index={i}>
              <Card className="p-6">
                <h3 className="text-2xl">{name}</h3>
                <p className="mt-1 text-[15px] text-muted">Primitiva lista para usar.</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
      <div className="h-96" />
    </>
  );
}
