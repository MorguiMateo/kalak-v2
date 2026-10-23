"use client";

import * as Select from "@radix-ui/react-select";
import { breedsBySpecies } from "@/config/breeds";
import type { Species } from "@/features/ration";

type Props = { id: string; species: Species; value: string; onChange: (breed: string) => void };

export function BreedSelect({ id, species, value, onChange }: Props) {
  return (
    <Select.Root value={value || undefined} onValueChange={onChange}>
      <Select.Trigger
        id={id}
        className="flex h-14 w-full items-center justify-between gap-3 rounded-tile bg-white px-5 text-left text-[17px] shadow-[inset_0_0_0_1.5px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1.5px_var(--color-charcoal)] data-placeholder:text-muted"
      >
        <Select.Value placeholder="Selecciona una raza" />
        <Select.Icon aria-hidden>
          <Chevron />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-tile bg-white shadow-[0_18px_40px_-12px_rgb(32_34_29/.35),0_0_0_1px_var(--color-line)]"
        >
          <Select.ScrollUpButton className="grid h-7 place-items-center text-muted">
            <Chevron up />
          </Select.ScrollUpButton>
          <Select.Viewport className="max-h-80 p-1.5">
            {breedsBySpecies[species].map((breed) => (
              <Select.Item
                key={breed}
                value={breed}
                className="relative flex cursor-pointer items-center rounded-lg py-2.5 pr-3 pl-9 text-[15px] outline-none select-none data-highlighted:bg-sand-100 data-[state=checked]:font-semibold"
              >
                <Select.ItemIndicator className="absolute left-3 text-green-700">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </Select.ItemIndicator>
                <Select.ItemText>{breed}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="grid h-7 place-items-center text-muted">
            <Chevron />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className={up ? "rotate-180" : undefined}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
