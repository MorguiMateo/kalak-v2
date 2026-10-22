"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import type { ReactNode } from "react";

type Item = { id: string; title: ReactNode; content: ReactNode };

/** One item open at a time; the + icon turns into ×. Height animates with grid rows. */
export function Accordion({ items, defaultOpen }: { items: Item[]; defaultOpen?: string }) {
  return (
    <RadixAccordion.Root type="single" collapsible defaultValue={defaultOpen}>
      {items.map((item) => (
        <RadixAccordion.Item key={item.id} value={item.id} className="group/item border-b border-line">
          <RadixAccordion.Header asChild>
            <h3>
              <RadixAccordion.Trigger className="flex w-full items-start justify-between gap-6 py-5.5 text-left font-display text-xl leading-snug font-medium tracking-normal">
                {item.title}
                <span
                  aria-hidden
                  className="relative mt-0.5 size-7 flex-none transition-transform group-data-[state=open]/item:rotate-45 before:absolute before:top-1/2 before:left-1/2 before:h-[1.5px] before:w-3.5 before:-translate-1/2 before:bg-current after:absolute after:top-1/2 after:left-1/2 after:h-[1.5px] after:w-3.5 after:-translate-1/2 after:rotate-90 after:bg-current"
                />
              </RadixAccordion.Trigger>
            </h3>
          </RadixAccordion.Header>
          <RadixAccordion.Content
            forceMount
            className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 data-[state=open]:grid-rows-[1fr] data-[state=closed]:invisible data-[state=closed]:[transition:grid-template-rows_300ms,visibility_0s_300ms]"
          >
            <div className="overflow-hidden">
              <div className="pr-10 pb-6 text-base text-muted">{item.content}</div>
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
