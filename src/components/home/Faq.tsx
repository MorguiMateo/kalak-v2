import Image from "next/image";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { faq } from "@/content/home";
import { images } from "@/lib/images";

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="grid gap-gap px-gap pt-16 lg:grid-cols-2 lg:pt-24">
      <Reveal variant="zoom" className="relative min-h-75 overflow-hidden rounded-tile lg:sticky lg:top-20 lg:h-[min(calc(100svh-96px),760px)] lg:min-h-140 lg:self-start">
        <div className="absolute inset-0">
          <Image src={images.gatoComiendo} alt="Gato comiendo Kalak" fill sizes="(max-width: 960px) calc(100vw - 16px), 50vw" className="object-cover" />
        </div>
      </Reveal>
      <Reveal index={1} className="px-3 py-4 lg:px-[clamp(20px,4vw,64px)] lg:py-6">
        <p className="eyebrow text-muted">Dudas</p>
        <h2 id="faq-title" className="mt-3 mb-4 text-[clamp(32px,3.6vw,48px)]">
          {faq.title}
        </h2>
        <Accordion
          defaultOpen="faq-0"
          items={faq.items.map((item, i) => ({
            id: `faq-${i}`,
            title: item.question,
            content: <RichText blocks={item.answer} />,
          }))}
        />
      </Reveal>
    </section>
  );
}
