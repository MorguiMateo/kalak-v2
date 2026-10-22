import { CtaPhoto } from "@/components/page/CtaPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/site";
import { cta } from "@/content/home";
import { images } from "@/lib/images";

export function FinalCta() {
  const [a, highlight, b] = cta.title;
  return (
    <CtaPhoto
      image={images.perroComiendo}
      title={
        <>
          {a}
          <em>{highlight}</em>
          {b}
        </>
      }
    >
      <ButtonLink href={ctaLinks.calculator.href} arrow className="max-lg:flex-1">
        {ctaLinks.calculator.label}
      </ButtonLink>
      <ButtonLink href={ctaLinks.order.href} variant="light" className="max-lg:flex-1">
        {ctaLinks.order.label}
      </ButtonLink>
    </CtaPhoto>
  );
}
