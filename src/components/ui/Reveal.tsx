"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  /** `up`: fade + 28px rise. `zoom`: fade + scale .96 → 1 (photos, tiles). */
  variant?: "up" | "zoom";
  /** Position in a group; each step delays the entrance by 90ms. */
  index?: number;
  className?: string;
  children: ReactNode;
};

let observer: IntersectionObserver | undefined;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-shown", "");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

export function Reveal({ as: Tag = "div", variant = "up", index = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = getObserver();
    io.observe(el);
    el.setAttribute("data-reveal-ready", "");
    return () => {
      io.unobserve(el);
      el.removeAttribute("data-reveal-ready");
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={className}
      style={index ? ({ "--i": index } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
