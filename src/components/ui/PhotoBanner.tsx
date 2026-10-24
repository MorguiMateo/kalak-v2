import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type Props = { image: StaticImageData; eyebrow?: string; title: ReactNode; children?: ReactNode };

/** Photo header for inner pages: 340px (240px on mobile) with a dark gradient and white title. */
export function PhotoBanner({ image, eyebrow, title, children }: Props) {
  return (
    <div className="on-dark relative mt-19 flex min-h-60 items-end overflow-hidden py-8 text-white lg:min-h-85">
      <Image src={image} alt="" fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[rgb(32_34_29/.8)] to-[rgb(32_34_29/.74)]" />
      <div className="relative mx-auto w-[min(100%-40px,var(--container-calc))]">
        {eyebrow && <p className="eyebrow opacity-85">{eyebrow}</p>}
        <h1 className="mt-2.5 text-[clamp(34px,4.6vw,56px)]">{title}</h1>
        {children}
      </div>
    </div>
  );
}
