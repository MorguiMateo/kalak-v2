import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { ingredients } from "@/content/home";
import { images } from "@/lib/images";
import { CarouselArrows } from "./CarouselArrows";

const TRACK_ID = "ingredientes";

export function Ingredients() {
  const [a, highlight, b] = ingredients.title;
  return (
    <section aria-labelledby="ingredients-title">
      <div className="container-site flex items-end justify-between gap-6 pt-16 pb-5 lg:pt-24 lg:pb-8">
        <Reveal as="h2" className="max-w-[18ch] text-[clamp(32px,3.6vw,48px)]">
          <span id="ingredients-title">
            {a}
            <em>{highlight}</em>
            {b}
          </span>
        </Reveal>
        <CarouselArrows trackId={TRACK_ID} />
      </div>
      <ul
        id={TRACK_ID}
        tabIndex={0}
        aria-labelledby="ingredients-title"
        className="flex snap-x snap-mandatory scroll-px-(--edge) gap-gap overflow-x-auto px-(--edge) pb-2 [--edge:max(20px,calc((100vw-var(--container-site))/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ingredients.items.map((item, i) => (
          <Reveal as="li" key={item.name} index={i} className="flex-[0_0_clamp(240px,24vw,320px)] snap-start">
            <Card className="h-full">
              <div className="aspect-square overflow-hidden">
                <Image src={images[item.image]} alt={item.alt} sizes="(max-width: 1000px) 240px, (max-width: 1333px) 24vw, 320px" className="size-full object-cover" />
              </div>
              <div className="px-5 pt-4.5 pb-5.5">
                <h3 className="text-2xl">{item.name}</h3>
                <p className="mt-1 text-[15px] text-muted">{item.text}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
