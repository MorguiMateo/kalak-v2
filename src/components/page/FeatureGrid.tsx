import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Feature = { title: string; text: string };

/** Cards with a short title and text. `numbered` adds 1, 2, 3… */
export function FeatureGrid({
  items,
  numbered,
  className,
}: {
  items: readonly Feature[];
  numbered?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-gap sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} index={i % 3} className="rounded-tile bg-white p-6 shadow-[inset_0_0_0_1.5px_var(--color-line)]">
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
