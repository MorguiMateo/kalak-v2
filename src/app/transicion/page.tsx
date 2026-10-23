import type { Metadata } from "next";
import Image from "next/image";
import { Guarda } from "@/components/brand/Guarda";
import { FinalCta } from "@/components/home/FinalCta";
import { Badges } from "@/components/page/Badges";
import { FeatureGrid } from "@/components/page/FeatureGrid";
import { Highlight } from "@/components/page/Highlight";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { transicion as c } from "@/content/transicion";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Transición",
  description: "Cómo hacer la transición a la dieta natural Kalak paso a paso, sin problemas digestivos.",
};

const card = "rounded-tile bg-white p-6 shadow-[inset_0_0_0_1.5px_var(--color-line)] lg:p-8";

export default function TransicionPage() {
  return (
    <>
      <PhotoBanner image={images[c.hero.image]} eyebrow={c.hero.subtitle} title={<Highlight text={c.hero.title} word="Dieta Natural" />} />
      <Guarda />

      <section className="container-site grid gap-6 pt-12 lg:grid-cols-2 lg:gap-12 lg:pt-18">
        <Reveal>
          <Badges items={c.badges} />
        </Reveal>
        <Reveal index={1} className="grid gap-4 text-[19px] text-muted">
          {c.intro.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
        </Reveal>
      </section>

      <Section eyebrow={c.how.eyebrow} title={c.how.title} intro={c.how.text}>
        <ul className="grid gap-gap md:grid-cols-3">
          {c.how.images.map((img, i) => (
            <Reveal as="li" key={img.image} variant="zoom" index={i} className="overflow-hidden rounded-tile bg-white shadow-[inset_0_0_0_1.5px_var(--color-line)]">
              <Image src={images[img.image]} alt={img.alt} sizes="(max-width: 768px) 100vw, 400px" className="h-auto w-full" />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section title={c.steps.title}>
        <ol className="grid gap-gap lg:grid-cols-3">
          {c.steps.items.map((step, i) => (
            <Reveal as="li" key={step.title} index={i} className={card}>
              <span className="mb-4 grid size-10 place-items-center rounded-full bg-orange font-semibold text-ink">{i + 1}</span>
              <h3 className="text-[22px]">{step.title}</h3>
              <div className="mt-3 grid gap-3 text-[15px] text-muted">
                {"text" in step && step.text && <p>{step.text}</p>}
                {"list" in step && step.list && (
                  <ul className="grid list-disc gap-1.5 pl-5 marker:text-orange">
                    {step.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {"note" in step && step.note && (
                  <p>
                    {step.note.before}
                    <strong className="font-semibold text-charcoal">{step.note.strong}</strong>
                    {step.note.after}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section title={c.tips.title} intro={c.tips.intro}>
        <FeatureGrid items={c.tips.items} />
      </Section>

      <Section title={c.mistakes.title} intro={c.mistakes.intro}>
        <ul className="grid gap-gap md:grid-cols-2">
          {c.mistakes.items.map((m, i) => (
            <Reveal as="li" key={m.title} index={i % 2} className={card}>
              <h3 className="text-[22px]">{m.title}</h3>
              <p className="mt-3 text-[15px] text-muted">
                <span className="font-semibold text-orange-600">Error:</span> {m.error}
              </p>
              <p className="mt-2 text-[15px] text-muted">
                <span className="font-semibold text-green-700">Solución:</span> {m.solution}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
