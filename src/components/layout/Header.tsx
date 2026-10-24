"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks, mainNav } from "@/config/site";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

/**
 * Routes whose first block is a full-bleed photo: the header starts transparent over it.
 */
const OVERLAY_ROUTES: readonly string[] = ["/"];

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const header = headerRef.current;
    const trigger = menuButtonRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
      }
      if (e.key !== "Tab" || !header) return;
      const controls = Array.from(header.querySelectorAll<HTMLElement>("a[href], button"))
        .filter((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility === "visible");
      const index = controls.findIndex((el) => el === document.activeElement);
      const nextIndex = (index + (e.shiftKey ? -1 : 1) + controls.length) % controls.length;
      e.preventDefault();
      controls[nextIndex]?.focus();
    };
    const desktop = window.matchMedia("(min-width: 960px)");
    const onDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    document.documentElement.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => header?.querySelector<HTMLElement>("#mobile-menu a")?.focus());
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      document.documentElement.style.overflow = "";
      trigger?.focus();
    };
  }, [menuOpen]);

  const overHero = OVERLAY_ROUTES.includes(pathname) && !scrolled;
  const solid = !overHero && !menuOpen;

  return (
    <header
      ref={headerRef}
      role={menuOpen ? "dialog" : undefined}
      aria-modal={menuOpen || undefined}
      aria-label={menuOpen ? "Menú de navegación" : undefined}
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

        <button
          ref={menuButtonRef}
          type="button"
          className="-mr-2.5 grid size-11 place-items-center lg:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <MobileMenu open={menuOpen} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
    </header>
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
  open,
  pathname,
  onNavigate,
}: {
  open: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav
      id="mobile-menu"
      aria-label="Menú"
      inert={!open}
      className={cn(
        "fixed inset-0 flex flex-col overflow-y-auto bg-charcoal px-6 pt-24 pb-10 text-white transition-[opacity,visibility] lg:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      {mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={open ? null : false}
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
