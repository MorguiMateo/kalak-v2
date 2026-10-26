import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { benefits } from "@/content/home";
import { cn } from "@/lib/cn";
import { images } from "@/lib/images";

const layout = ["col-span-2 lg:col-span-1 lg:row-span-2", "", "", "col-span-2"];
const sizes = ["(max-width: 960px) 100vw, 40vw", "(max-width: 960px) 50vw, 30vw", "(max-width: 960px) 50vw, 30vw", "(max-width: 960px) 100vw, 60vw"];

export function Benefits() {
  return (
    <section aria-label="Beneficios" className="grid grid-cols-2 grid-rows-[320px] auto-rows-[230px] gap-gap px-gap lg:grid-cols-[1.4fr_1fr_1fr] lg:grid-rows-[repeat(2,minmax(240px,27vw))]">
      {benefits.map((benefit, i) => (
        <Reveal
          as="figure"
          key={benefit.image}
          variant="zoom"
          index={i}
          className={cn("group relative overflow-hidden rounded-tile bg-sand-100 text-white", layout[i])}
        >
          <Image
            src={images[benefit.image]}
            alt={benefit.alt}
            fill
            sizes={sizes[i]}
            className="object-cover transition-transform duration-1400 group-hover:scale-[1.06]"
            style={"position" in benefit ? { objectPosition: benefit.position } : undefined}
          />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[rgb(32_34_29/.85)] via-[rgb(32_34_29/.75)_35%] to-transparent to-80%" />
          <figcaption className="absolute inset-x-4 bottom-3.5 max-w-[20ch] font-display text-lg leading-tight font-medium lg:inset-x-6 lg:bottom-5.5 lg:text-[clamp(20px,2vw,28px)]">
            {benefit.text}
          </figcaption>
        </Reveal>
      ))}
    </section>
  );
}
