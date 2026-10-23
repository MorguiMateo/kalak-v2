import { getImageProps } from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/site";
import { hero } from "@/content/home";
import { images } from "@/lib/images";

export function Hero() {
  const common = { alt: hero.imageAlt, sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: images.background });
  const { props: { srcSet: mobile, ...img } } = getImageProps({ ...common, src: images.fondoOlga1 });
  const [before, after] = hero.title.split(hero.highlight);

  return (
    <section className="on-dark relative flex h-[88svh] min-h-155 items-end overflow-hidden text-white lg:h-svh">
      <picture>
        <source media="(min-width: 961px)" srcSet={desktop} sizes="100vw" />
        <source srcSet={mobile} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} className="absolute inset-0 size-full animate-settle object-cover" />
      </picture>
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[rgb(32_34_29/.78)] via-[rgb(32_34_29/.15)_55%] to-[rgb(32_34_29/.35)]"
      />
      <div className="container-site relative pb-12 lg:pb-18 [&>*]:animate-rise">
        <p className="eyebrow opacity-85 [animation-delay:.3s]">{hero.eyebrow}</p>
        <h1 className="mt-4 mb-4.5 max-w-[11ch] text-[clamp(52px,8vw,112px)] [animation-delay:.4s]">
          {before}
          <em>{hero.highlight}</em>
          {after}
        </h1>
        <p className="max-w-[34ch] text-xl opacity-90 [animation-delay:.5s]">{hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3 [animation-delay:.6s]">
          <ButtonLink href={ctaLinks.calculator.href} arrow className="max-lg:flex-1">
            {ctaLinks.calculator.label}
          </ButtonLink>
          <ButtonLink href={ctaLinks.order.href} variant="light" className="max-lg:flex-1">
            {ctaLinks.order.label}
          </ButtonLink>
        </div>
      </div>
      <span
        aria-hidden
        className="absolute right-9 bottom-28 hidden text-[13px] tracking-widest uppercase opacity-70 [writing-mode:vertical-rl] lg:block"
      >
        Deslizá ↓
      </span>
    </section>
  );
}
