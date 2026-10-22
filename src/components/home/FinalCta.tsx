import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ctaLinks } from "@/config/site";
import { cta } from "@/content/home";
import { images } from "@/lib/images";

export function FinalCta() {
  const [a, highlight, b] = cta.title;
  return (
    <Reveal
      as="section"
      variant="zoom"
      className="on-dark relative m-gap mt-16 grid min-h-110 place-items-center overflow-hidden rounded-tile px-5 py-16 text-center text-white lg:mt-24 lg:min-h-130"
    >
      <Image src={images.perroComiendo} alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[rgb(16_30_40/.55)]" />
      <div className="relative">
        <h2 className="mx-auto mb-8 max-w-[16ch] text-[clamp(36px,5vw,68px)]">
          {a}
          <em>{highlight}</em>
          {b}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={ctaLinks.calculator.href} arrow className="max-lg:flex-1">
            {ctaLinks.calculator.label}
          </ButtonLink>
          <ButtonLink href={ctaLinks.order.href} variant="light" className="max-lg:flex-1">
            {ctaLinks.order.label}
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}
