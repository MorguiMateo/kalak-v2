import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  image?: StaticImageData;
  alt?: string;
};

type Props<T extends string> = {
  name: string;
  value: T | null;
  options: readonly CardOption<T>[];
  onChange: (value: T) => void;
  /** Defaults to one column per option. */
  columns?: number;
};

/** Card shell shared by single (radio) and multiple (checkbox) choices. */
export function cardClass(checked: boolean, disabled = false) {
  return cn(
    "group relative flex flex-col overflow-hidden rounded-tile bg-white text-left transition-[box-shadow,transform,opacity]",
    "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-orange-600",
    disabled ? "cursor-not-allowed" : "cursor-pointer active:scale-[.98] active:duration-150",
    checked ? "shadow-[inset_0_0_0_3px_var(--color-orange)]" : "shadow-[inset_0_0_0_1.5px_var(--color-line)]",
  );
}

export function CheckBadge({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full shadow-[0_2px_8px_rgb(0_0_0/.15)] transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] lg:top-3 lg:right-3 lg:size-8",
        checked ? "scale-110 bg-orange text-ink" : "bg-white text-transparent",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function CardImage({ image, alt = "", sizes }: { image: StaticImageData; alt?: string; sizes: string }) {
  return (
    <span className="block aspect-[4/3.4] overflow-hidden bg-option-bg">
      <Image
        src={image}
        alt={alt}
        sizes={sizes}
        className="size-full object-cover transition-transform duration-800 group-hover:scale-105"
      />
    </span>
  );
}

export function CardText({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <span className="flex flex-col px-2.5 pt-2.5 pb-3 lg:px-4.5 lg:pt-4 lg:pb-5">
      <span className="pr-8 font-display text-[17px] leading-tight font-semibold lg:text-[22px]">{label}</span>
      {children}
    </span>
  );
}

/** Single choice as cards (radio group). Selected: brand-orange border and check. */
export function ChoiceCards<T extends string>({ name, value, options, onChange, columns }: Props<T>) {
  const cols = columns ?? options.length;
  const textOnly = options.every((o) => !o.image);
  return (
    <div
      className="grid grid-cols-(--cols) gap-1.5 lg:gap-gap"
      style={{ "--cols": `repeat(${cols}, minmax(0, 1fr))` } as CSSProperties}
    >
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label key={option.value} className={cn(cardClass(checked), textOnly && "min-h-28 justify-end")}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <CheckBadge checked={checked} />
            {option.image && (
              <CardImage image={option.image} alt={option.alt} sizes={`(max-width: 960px) ${Math.round(100 / cols)}vw, 300px`} />
            )}
            <CardText label={option.label}>
              {option.description && (
                <span className={cn("mt-1 text-sm text-muted", !textOnly && "hidden lg:block")}>{option.description}</span>
              )}
            </CardText>
          </label>
        );
      })}
    </div>
  );
}
