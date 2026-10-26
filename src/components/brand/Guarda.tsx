import { cn } from "@/lib/cn";

export function Guarda({ className }: { className?: string }) {
  return <div aria-hidden className={cn("guarda", className)} />;
}
