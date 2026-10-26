import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type SurfaceVariant = "plain" | "outlined";

export function surfaceClasses({ variant = "plain" }: { variant?: SurfaceVariant } = {}) {
  return cn(
    "rounded-tile bg-white",
    variant === "outlined" && "shadow-[inset_0_0_0_1.5px_var(--color-line)]",
  );
}

export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        surfaceClasses(),
        "group overflow-hidden [&_img]:transition-transform [&_img]:duration-1000 hover:[&_img]:scale-[1.06]",
        className,
      )}
      {...props}
    />
  );
}
