import { cn } from "@/lib/cn";

export type PillOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  name: string;
  value: T | null;
  options: readonly PillOption<T>[];
  onChange: (value: T) => void;
};

/** Text options (radio group) as pills. */
export function ChoicePills<T extends string>({ name, value, options, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "inline-flex h-13 min-w-32 cursor-pointer items-center justify-center rounded-pill px-6 font-semibold transition-[background-color,color,box-shadow,transform] select-none active:scale-[.97] active:duration-150 max-sm:flex-1",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-orange",
              checked
                ? "bg-orange text-ink"
                : "bg-white shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-charcoal)]",
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
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
