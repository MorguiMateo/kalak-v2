import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "ghost" | "text" | "textSuccess";
type Size = "md" | "sm";

const base =
  "group inline-flex shrink-0 items-center whitespace-nowrap justify-center gap-2.5 rounded-pill font-semibold leading-none transition-[background-color,color,transform] active:scale-[.97] active:duration-150 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-orange text-ink hover:bg-orange-hover",
  light:
    "bg-white/14 text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/.5)] backdrop-blur-sm hover:bg-white hover:text-charcoal",
  ghost: "px-3 text-muted hover:text-charcoal",
  text: "px-0 text-charcoal hover:text-charcoal",
  textSuccess: "px-0 text-green-700 hover:text-green-700",
};

const sizes: Record<Size, string> = {
  md: "h-13 text-[15px]",
  sm: "h-10.5 text-sm",
};

const filledPadding: Record<Size, string> = { md: "px-6.5", sm: "px-4.5" };

type StyleProps = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode };

export function buttonClasses({ variant = "primary", size = "md" }: Omit<StyleProps, "children">) {
  return cn(base, sizes[size], (variant === "primary" || variant === "light") && filledPadding[size], variants[variant]);
}

function Content({ arrow, children }: Pick<StyleProps, "arrow" | "children">) {
  return (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...props
}: StyleProps & Omit<ComponentProps<"button">, "children">) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size }), className)} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  arrow,
  className,
  children,
  prefetch = false,
  ...props
}: StyleProps & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link prefetch={prefetch} className={cn(buttonClasses({ variant, size }), className)} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}
