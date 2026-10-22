import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Width = "site" | "calc" | "bleed";

const widths: Record<Width, string> = {
  site: "container-site",
  calc: "mx-auto w-[min(100%-40px,var(--container-calc))]",
  bleed: "px-gap",
};

type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  /** `bleed` spans the viewport with the 8px gap as side margin. */
  width?: Width;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
};

/** Vertical rhythm: 96px between sections (64px on mobile). */
export function Section({
  width = "site",
  eyebrow,
  title,
  intro,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("pt-16 lg:pt-24", widths[width], className)} {...props}>
      {(eyebrow || title || intro) && (
        <header className="mb-5 max-w-3xl lg:mb-8">
          {eyebrow && <p className="eyebrow mb-3 text-muted">{eyebrow}</p>}
          {title && <h2 className="text-[clamp(32px,4vw,54px)]">{title}</h2>}
          {intro && <p className="mt-4 text-[19px] text-muted">{intro}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
