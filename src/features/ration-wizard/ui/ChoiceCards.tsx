import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type CardOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  image: StaticImageData;
  alt?: string;
};

type Props<T extends string> = {
  name: string;
  value: T | null;
  options: readonly CardOption<T>[];
  onChange: (value: T) => void;
};

/** Big image options (radio group). Selected: green border and check. */
export function ChoiceCards<T extends string>({ name, value, options, onChange }: Props<T>) {
  return (
    <div
      className="grid grid-cols-(--cols) gap-1.5 lg:gap-gap"
      style={{ "--cols": `repeat(${options.length}, minmax(0, 1fr))` } as CSSProperties}
    >
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-tile bg-white transition-[box-shadow,transform] active:scale-[.98] active:duration-150",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-orange",
              checked ? "shadow-[inset_0_0_0_3px_var(--color-green-700)]" : "shadow-[inset_0_0_0_1.5px_var(--color-line)]",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full shadow-[0_2px_8px_rgb(0_0_0/.15)] transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] lg:top-3 lg:right-3 lg:size-8",
                checked ? "scale-110 bg-green-700 text-white" : "bg-white text-transparent",
              )}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="block aspect-[4/3.4] overflow-hidden bg-option-bg">
              <Image
                src={option.image}
                alt={option.alt ?? ""}
                sizes="(max-width: 960px) 33vw, 300px"
                className="size-full object-cover transition-transform duration-800 group-hover:scale-105"
              />
            </span>
            <span className="flex flex-col px-2.5 pt-2.5 pb-3 lg:px-4.5 lg:pt-4 lg:pb-5">
              <span className="font-display text-[17px] leading-tight font-semibold lg:text-[22px]">
                {option.label}
              </span>
              {option.description && (
                <span className="mt-1 hidden text-sm text-muted lg:block">{option.description}</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
