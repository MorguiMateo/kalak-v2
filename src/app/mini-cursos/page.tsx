import type { Metadata } from "next";
import { Guarda } from "@/components/brand/Guarda";
import { FeatureGrid } from "@/components/page/FeatureGrid";
import { Highlight } from "@/components/page/Highlight";
import { surfaceClasses } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { miniCursos as c } from "@/content/mini-cursos";
import { images } from "@/lib/images";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Mini cursos",
  description: "Mini cursos de nutrición natural para perros y gatos, diseñados por especialistas.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function MiniCursosPage() {
  return (
    <>
      <PhotoBanner image={images.muchosGatos} eyebrow="Kalak" title={<Highlight text={c.hero.title} word="Nutrición" />}>
        <p className="mt-3 max-w-[56ch] text-white/85">{c.hero.text}</p>
      </PhotoBanner>
      <Guarda />

      <Section>
        <ul className="grid gap-gap md:grid-cols-3">
          {c.courses.map((course, i) => (
            <Reveal as="li" key={course.title} index={i} className={surfaceClasses({ variant: "outlined" }) + " flex flex-col p-6 lg:p-8"}>
              <p className="eyebrow text-muted">{course.meta}</p>
              <h2 className="mt-3 text-[28px]">{course.title}</h2>
              <p className="mt-3 flex-1 text-muted">{course.text}</p>
              <a
                href={whatsappUrl(`Hola, quiero información sobre el curso "${course.title}".`)}
                {...external}
                className={buttonClasses({ size: "sm" }) + " mt-6 self-start"}
              >
                {c.courseCta}
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section title={c.why.title}>
        <FeatureGrid items={c.why.items} columns={4} />
        <a href={whatsappUrl("Hola, quiero información sobre los mini cursos de Kalak.")} {...external} className={buttonClasses({}) + " mt-10"}>
          {c.allCta} →
        </a>
      </Section>
      <div className="h-16 lg:h-24" />
    </>
  );
}
