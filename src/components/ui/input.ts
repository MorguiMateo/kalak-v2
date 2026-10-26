import { cn } from "@/lib/cn";
import { surfaceClasses } from "./Card";

type InputStyles = { variant?: "input" | "textarea"; width?: "compact" | "constrained" | "full" };

const variants = { input: "h-14", textarea: "h-auto resize-y py-4" } as const;
const widths = { compact: "max-w-60", constrained: "max-w-md", full: "max-w-none" } as const;

export function inputClasses({ variant = "input", width = "constrained" }: InputStyles = {}) {
  return cn(
    surfaceClasses({ variant: "outlined" }),
    "w-full px-5 text-[17px] transition-shadow placeholder:text-muted/70 hover:shadow-[inset_0_0_0_1.5px_var(--color-charcoal)] focus-visible:shadow-[inset_0_0_0_2px_var(--color-charcoal)]",
    variants[variant],
    widths[width],
  );
}

export const inputClass = inputClasses();
