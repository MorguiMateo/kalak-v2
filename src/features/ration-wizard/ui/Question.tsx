import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const titleClass = "font-display text-[clamp(26px,3vw,36px)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance";

/** A question answered with a group of options (radio buttons). */
export function QuestionGroup({
  title,
  hint,
  children,
  className,
}: {
  title: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      {/* Floated so the legend joins the normal flow (fieldset padding/borders behave). */}
      <legend className={cn(titleClass, "float-left mb-2 w-full")}>{title}</legend>
      {hint && <p className="clear-both mb-6 text-muted">{hint}</p>}
      <div className={cn("clear-both", !hint && "pt-4")}>{children}</div>
    </fieldset>
  );
}

/** A question answered with a single control: the title is its label. */
export function QuestionField({
  htmlFor,
  title,
  hint,
  children,
  className,
}: {
  htmlFor: string;
  title: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={cn(titleClass, "block")}>
        {title}
      </label>
      {hint && <div className="mt-2 text-muted">{hint}</div>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Stack of per-pet questions, separated by a line when there are several pets. */
export function PetStack({ children }: { children: ReactNode }) {
  return <div className="grid gap-10 [&>*+*]:border-t [&>*+*]:border-line [&>*+*]:pt-10">{children}</div>;
}
