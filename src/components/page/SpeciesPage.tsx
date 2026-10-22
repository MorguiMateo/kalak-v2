import { Guarda } from "@/components/brand/Guarda";
import { FinalCta } from "@/components/home/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { SpeciesContent } from "@/content/species";
import { ctaLinks } from "@/config/site";
import { images } from "@/lib/images";
import { FeatureGrid } from "./FeatureGrid";
import { Highlight } from "./Highlight";
import { IngredientCards } from "./IngredientCards";

/** Shared layout of /perros and /gatos. */
export function SpeciesPage({ content: c, highlight }: { content: SpeciesContent; highlight: string }) {
  return (
    <>
      <PhotoBanner image={images[c.banner]} eyebrow={c.eyebrow} title={<Highlight text={c.title} word={highlight} />} />
      <Guarda />

      <section className="container-site grid items-end gap-4 pt-12 lg:grid-cols-2 lg:gap-12 lg:pt-18">
        <Reveal as="h2" className="text-[clamp(32px,4vw,54px)]">
          {c.intro.title}
        </Reveal>
        <Reveal as="p" index={1} className="text-[19px] text-muted">
          {c.intro.text}
        </Reveal>
      </section>

      <Section eyebrow={c.formula.eyebrow} title={c.formula.title}>
        <Reveal className="mb-10 flex items-baseline gap-4 rounded-tile bg-navy px-6 py-5 text-white sm:inline-flex">
          <span className="font-display text-5xl font-semibold text-orange-300">{c.formula.proteinPercent}</span>
          <span className="text-lg">{c.formula.proteinLabel}</span>
        </Reveal>
        <h3 className="mb-8 text-[clamp(26px,3vw,36px)]">{c.ingredientsTitle}</h3>
        <div className="grid gap-12">
          <IngredientCards title={c.proteins.title} items={c.proteins.items} />
          <IngredientCards title={c.vegetables.title} items={c.vegetables.items} />
        </div>
      </Section>

      <Section title={c.benefitsTitle}>
        <FeatureGrid items={c.benefits} />
        <div className="mt-10">
          <ButtonLink href={ctaLinks.calculator.href} arrow>
            {ctaLinks.calculator.label}
          </ButtonLink>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
