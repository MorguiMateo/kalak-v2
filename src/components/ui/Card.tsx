import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** White card with the brand radius; images inside zoom slowly on hover. */
export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-tile bg-white [&_img]:transition-transform [&_img]:duration-1000 hover:[&_img]:scale-[1.06]",
        className,
      )}
      {...props}
    />
  );
}
