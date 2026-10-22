import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { images, type ImageKey } from "@/lib/images";

type Ingredient = { name: string; percent: string; text: string; image: ImageKey; alt: string };

export function IngredientCards({ title, items }: { title: string; items: readonly Ingredient[] }) {
  return (
    <div>
      <h3 className="mb-5 border-b border-line pb-3 text-2xl">{title}</h3>
      <ul className="grid gap-gap sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal as="li" key={item.name} index={i}>
            <Card className="h-full">
              <div className="aspect-[4/3] overflow-hidden bg-white">
                <Image src={images[item.image]} alt={item.alt} sizes="(max-width: 640px) 100vw, 300px" className="size-full object-cover" />
              </div>
              <div className="px-5 pt-4 pb-5.5">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-[22px] leading-tight font-semibold">{item.name}</h4>
                  <span className="font-display text-2xl font-semibold text-orange-600">{item.percent}</span>
                </div>
                <p className="mt-2 text-[15px] text-muted">{item.text}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
