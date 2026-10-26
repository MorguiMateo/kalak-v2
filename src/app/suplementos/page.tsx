import type { Metadata } from "next";
import Image from "next/image";
import { Guarda } from "@/components/brand/Guarda";
import { FinalCta } from "@/components/home/FinalCta";
import { Badges } from "@/components/page/Badges";
import { FeatureGrid } from "@/components/page/FeatureGrid";
import { Highlight } from "@/components/page/Highlight";
import { buttonClasses } from "@/components/ui/Button";
import { Card, surfaceClasses } from "@/components/ui/Card";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { formatPrice, prices } from "@/config/prices";
import { suplementos as c } from "@/content/suplementos";
import { supplementItems } from "@/content/suplementos-items";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Suplementos",
  description: "Suplementos naturales Kalak: carbonato de calcio, cúrcuma activada, caldo de colágeno y vinagre de sidra de manzana.",
};

export default function SuplementosPage() {
  return (
    <>
      <PhotoBanner image={images[c.hero.image]} eyebrow={c.hero.subtitle} title={<Highlight text={c.hero.title} word="Naturales" />}>
        <p className="mt-3 max-w-[52ch] text-white/85">{c.hero.text}</p>
      </PhotoBanner>
      <Guarda />

      <Section eyebrow={c.listSubtitle} title={c.listTitle}>
        <Badges items={c.badges} />
        <ul className="mt-8 grid gap-gap sm:grid-cols-2 lg:grid-cols-4">
          {supplementItems.map((s, i) => (
            <Reveal as="li" key={s.id} index={i}>
              <Card className="flex h-full flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={images[s.image]}
                    alt={s.name}
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="size-full object-cover"
                    style={s.position ? { objectPosition: s.position } : undefined}
                  />
                </div>
                <div className="flex flex-1 flex-col px-5 pt-4 pb-5.5">
                  <h3 className="text-[22px]">{s.name}</h3>
                  <p className="mt-2 flex-1 text-[15px] text-muted">{s.summary}</p>
                  <p className="mt-4 font-semibold text-green-700">
                    {formatPrice(prices.supplements[s.price])}
                    {prices.supplements[s.price] > 0 && <span className="font-normal text-muted"> / pote</span>}
                  </p>
                  <a href={`#${s.id}-info`} className={buttonClasses({ variant: "text", size: "sm" }) + " mt-3 self-start"}>
                    {c.detailsCta} ↓
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section title={c.why.title} intro={c.why.intro}>
        <FeatureGrid items={c.why.items} columns={4} />
      </Section>

      {supplementItems.map((s) => (
        <Section key={s.id} id={`${s.id}-info`} title={<Highlight text={s.detailsTitle} word={s.name} />} className="scroll-mt-20">
          <div className="grid gap-gap sm:grid-cols-2 lg:grid-cols-4">
            {s.groups.map((g, i) => (
              <Reveal key={g.title} index={i} className={surfaceClasses({ variant: "outlined" }) + " p-6"}>
                <h3 className="text-xl">{g.title}</h3>
                <ul className="mt-3 grid gap-1.5 text-[15px] text-muted">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className="text-green-700">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <Section>
        <p className="mx-auto max-w-3xl text-center font-display text-2xl leading-snug text-orange-600">{c.quote}</p>
      </Section>

      <FinalCta />
    </>
  );
}
