import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function CtaPhoto({
  image,
  title,
  text,
  children,
}: {
  image: StaticImageData;
  title: ReactNode;
  text?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="section"
      variant="zoom"
      className="on-dark relative m-gap mt-16 grid min-h-110 place-items-center overflow-hidden rounded-tile px-5 py-16 text-center text-white lg:mt-24 lg:min-h-130"
    >
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[rgb(32_34_29/.75)]" />
      <div className="relative">
        <h2 className="mx-auto max-w-[16ch] text-[clamp(36px,5vw,68px)]">{title}</h2>
        {text && <p className="mx-auto mt-4 max-w-[46ch] text-lg text-white/85">{text}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </Reveal>
  );
}
