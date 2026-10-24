import type { Metadata } from "next";
import Image from "next/image";
import { Guarda } from "@/components/brand/Guarda";
import { CtaPhoto } from "@/components/page/CtaPhoto";
import { FeatureGrid } from "@/components/page/FeatureGrid";
import { Highlight } from "@/components/page/Highlight";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ctaLinks } from "@/config/site";
import { dietaKalak as c } from "@/content/dieta-kalak";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Dieta Kalak",
  description: "Alimentación natural para tu mascota: dietas cocidas, crudas y comercial suplementada.",
};

const checkList = (items: readonly string[]) => (
  <ul className="grid gap-1.5">
    {items.map((item) => (
      <li key={item} className="flex gap-2">
        <span aria-hidden className="text-green-700">
          ✓
        </span>
        {item}
      </li>
    ))}
  </ul>
);

export default function DietaKalakPage() {
  const { natural, commercial } = c.options;
  return (
    <>
      <PhotoBanner
        image={images[c.hero.image]}
        eyebrow={c.hero.title}
        title={<Highlight text={c.hero.subtitle} word="Natural" />}
      />
      <Guarda />

      <Section title={<Highlight text={c.why.title} word="dieta natural" />}>
        <ul className="mb-6 flex flex-wrap gap-2">
          {c.why.badges.map((badge) => (
            <li key={badge} className="rounded-pill bg-sand-100 px-4 py-2 text-sm font-semibold">
              {badge}
            </li>
          ))}
        </ul>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal as="p" className="text-[19px] text-muted">
            {c.why.intro}
          </Reveal>
          <Reveal index={1}>
            <Accordion
              defaultOpen="why-0"
              items={c.why.items.map((item, i) => ({ id: `why-${i}`, title: item.title, content: <p>{item.text}</p> }))}
            />
          </Reveal>
        </div>
      </Section>

      <Section eyebrow={c.keyInfo.subtitle} title={c.keyInfo.title}>
        <div className="grid gap-gap lg:grid-cols-2">
          {c.keyInfo.items.map((item, i) => (
            <Reveal key={item.title} index={i} className="rounded-tile bg-white p-6 shadow-[inset_0_0_0_1.5px_var(--color-line)] lg:p-8">
              <h3 className="text-2xl">{item.title}</h3>
              <div className="mt-4 grid gap-3 text-muted">
                {"paragraphs" in item && item.paragraphs.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
                {"features" in item &&
                  item.features.map((f) => (
                    <div key={f.title}>
                      <h4 className="font-semibold text-charcoal">{f.title}</h4>
                      <p>{f.text}</p>
                    </div>
                  ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="grid gap-gap px-gap pt-16 lg:grid-cols-2 lg:pt-24">
        {c.species.map((s, i) => (
          <Reveal as="article" key={s.href} variant="zoom" index={i} className="group on-dark relative flex min-h-110 items-end overflow-hidden rounded-tile text-white">
            <Image src={images[s.image]} alt={s.alt} fill sizes="(max-width: 960px) 100vw, 50vw" className="object-cover transition-transform duration-1400 group-hover:scale-[1.06]" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[rgb(32_34_29/.85)] via-[rgb(32_34_29/.75)_60%] to-[rgb(32_34_29/.3)]" />
            <div className="relative p-6 lg:p-10">
              <h2 className="text-[clamp(28px,3vw,40px)]">{s.title}</h2>
              <p className="mt-3 max-w-[46ch] text-white/85">{s.text}</p>
              <ButtonLink href={s.href} variant="light" arrow className="mt-6">
                {c.speciesCta}
              </ButtonLink>
            </div>
          </Reveal>
        ))}
      </section>

      <Section eyebrow={c.options.subtitle} title={<Highlight text={c.options.title} word="Kalak" />}>
        <p className="mb-10 max-w-3xl font-display text-2xl leading-snug text-orange-600">{c.options.quote}</p>

        <h3 className="text-[clamp(26px,3vw,36px)]">{natural.title}</h3>
        <p className="mt-2 text-muted">{natural.subtitle}</p>
        <div className="mt-6 grid gap-gap lg:grid-cols-2">
          {natural.items.map((option, i) => (
            <Reveal key={option.title} index={i} className="rounded-tile bg-white p-6 shadow-[inset_0_0_0_1.5px_var(--color-line)] lg:p-8">
              <h4 className="font-display text-2xl font-semibold">{option.title}</h4>
              <p className="mt-3 text-muted">{option.text}</p>
              <div className="mt-4">
                <Accordion
                  items={option.groups.map((g, j) => ({
                    id: `${i}-${j}`,
                    title: g.title,
                    content: (
                      <>
                        {g.intro && <p className="mb-2">{g.intro}</p>}
                        {checkList(g.items)}
                      </>
                    ),
                  }))}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="mt-16 text-[clamp(26px,3vw,36px)]">{commercial.title}</h3>
        <p className="mt-2 text-muted">{commercial.subtitle}</p>
        <FeatureGrid items={commercial.facts} className="mt-6 lg:grid-cols-2" />
        <FeatureGrid items={commercial.supplements} className="mt-gap lg:grid-cols-4" />
        <FeatureGrid items={commercial.steps} numbered className="mt-gap" />
      </Section>

      <Section eyebrow={c.benefits.subtitle} title={c.benefits.title}>
        <FeatureGrid items={c.benefits.items} />
      </Section>

      <CtaPhoto image={images.perroComiendo} title={<Highlight text={c.cta.title} word="siguiente paso" />} text={c.cta.text}>
        <ButtonLink href={ctaLinks.calculator.href} arrow>
          {c.cta.button}
        </ButtonLink>
      </CtaPhoto>
    </>
  );
}
