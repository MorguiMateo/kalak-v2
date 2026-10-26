import { surfaceClasses } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Feature = { title: string; text: string };
const columnClasses = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;

export function FeatureGrid({
  items,
  numbered,
  columns = 3,
  className,
}: {
  items: readonly Feature[];
  numbered?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-gap sm:grid-cols-2", columnClasses[columns], className)}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} index={i % columns} className={cn(surfaceClasses({ variant: "outlined" }), "p-6")}>
          {numbered && (
            <span className="mb-4 grid size-10 place-items-center rounded-full bg-orange font-semibold text-ink">{i + 1}</span>
          )}
          <h3 className="text-[22px]">{item.title}</h3>
          <p className="mt-2 text-[15px] text-muted">{item.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}
