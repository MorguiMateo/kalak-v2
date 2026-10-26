"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks, mainNav } from "@/config/site";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

const OVERLAY_ROUTES: readonly string[] = ["/"];

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [menu, setMenu] = useState<{ path: string | null; restoreFocus: boolean }>({
    path: null,
    restoreFocus: true,
  });
  const menuOpen = menu.path === pathname;
  const menuContentRef = useRef<HTMLDivElement>(null);

  if (menu.path !== null && menu.path !== pathname) {
    setMenu({ path: null, restoreFocus: false });
  }

  const closeForNavigation = () => setMenu({ path: null, restoreFocus: false });

  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 960px)");
    const onDesktop = () => {
      if (desktop.matches) setMenu({ path: null, restoreFocus: false });
    };
    desktop.addEventListener("change", onDesktop);
    return () => desktop.removeEventListener("change", onDesktop);
  }, [menuOpen]);

  const overHero = OVERLAY_ROUTES.includes(pathname) && !scrolled;
  const solid = !overHero && !menuOpen;

  return (
    <Dialog.Root
      open={menuOpen}
      onOpenChange={(open) => setMenu({ path: open ? pathname : null, restoreFocus: true })}
    >
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow]",
          solid ? "bg-cream/90 text-charcoal shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "on-dark text-white",
        )}
      >
        <div
          className={cn(
            "container-site relative z-10 flex items-center justify-between transition-[height]",
            scrolled ? "h-15" : "h-19",
          )}
        >
          <Link href="/" aria-label="Kalak, inicio" className="shrink-0">
            <LogoMark className={cn("transition-[height]", scrolled ? "h-9.5" : "h-11.5")} />
          </Link>

          <nav aria-label="Principal" className="hidden gap-0.5 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="rounded-md px-3 py-2 text-[15px] font-medium opacity-85 transition-opacity duration-150 hover:opacity-100 aria-[current=page]:opacity-100 aria-[current=page]:underline aria-[current=page]:underline-offset-6"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <ButtonLink href={ctaLinks.calculator.href} size="sm">
              {ctaLinks.calculator.label}
            </ButtonLink>
          </div>

          <Dialog.Trigger asChild>
            <button
              type="button"
              className="-mr-2.5 grid size-11 place-items-center lg:hidden"
              aria-label="Abrir menú"
            >
              <MenuIcon open={false} />
            </button>
          </Dialog.Trigger>
        </div>
      </header>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal lg:hidden" />
        <Dialog.Content
          ref={menuContentRef}
          aria-describedby={undefined}
          className="on-dark fixed inset-0 z-50 overflow-y-auto bg-charcoal text-white outline-none lg:hidden"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            menuContentRef.current?.querySelector<HTMLAnchorElement>("nav a")?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            // Navigation owns the next page's focus; desktop has no visible menu trigger.
            if (
              !menu.restoreFocus ||
              (menu.path !== null && menu.path !== pathname) ||
              window.matchMedia("(min-width: 960px)").matches
            ) {
              event.preventDefault();
            }
          }}
        >
          <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
          <div className="fixed inset-x-0 top-0 z-10 bg-charcoal">
            <div className={cn("container-site flex items-center justify-between transition-[height]", scrolled ? "h-15" : "h-19")}>
              <Link href="/" aria-label="Kalak, inicio" className="shrink-0" onClick={closeForNavigation}>
                <LogoMark className={cn("transition-[height]", scrolled ? "h-9.5" : "h-11.5")} />
              </Link>
              <Dialog.Close asChild>
                <button type="button" className="-mr-2.5 grid size-11 place-items-center" aria-label="Cerrar menú">
                  <MenuIcon open />
                </button>
              </Dialog.Close>
            </div>
          </div>
          <MobileMenu pathname={pathname} onNavigate={closeForNavigation} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  const line = "absolute left-0 h-0.5 w-5 bg-current transition-transform";
  return (
    <span aria-hidden className="relative block h-3.5 w-5">
      <span className={cn(line, "top-0", open && "translate-y-1.5 rotate-45")} />
      <span className={cn(line, "top-1.5 transition-opacity", open && "opacity-0")} />
      <span className={cn(line, "top-3", open && "-translate-y-1.5 -rotate-45")} />
    </span>
  );
}

function MobileMenu({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav aria-label="Menú" className="flex min-h-dvh flex-col px-6 pt-24 pb-10">
      {mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          onClick={onNavigate}
          className="py-3.5 font-display text-[30px] leading-none font-medium aria-[current=page]:text-orange-300"
        >
          {item.label}
        </Link>
      ))}
      <div className="mt-auto grid gap-3 pt-8">
        <ButtonLink href={ctaLinks.calculator.href} arrow onClick={onNavigate}>
          {ctaLinks.calculator.label}
        </ButtonLink>
        <ButtonLink href={ctaLinks.order.href} variant="light" onClick={onNavigate}>
          {ctaLinks.order.label}
        </ButtonLink>
      </div>
    </nav>
  );
}
