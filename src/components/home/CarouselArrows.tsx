"use client";

export function CarouselArrows({ trackId }: { trackId: string }) {
  function scroll(direction: 1 | -1) {
    const track = document.getElementById(trackId);
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * (card.offsetWidth + 8), behavior: reduce ? "auto" : "smooth" });
  }
  const button =
    "grid size-12 place-items-center rounded-full text-lg shadow-[inset_0_0_0_1.5px_var(--color-line)] transition-colors hover:bg-charcoal hover:text-white active:scale-95";
  return (
    <div className="hidden gap-2 lg:flex">
      <button type="button" aria-label="Anterior" aria-controls={trackId} className={button} onClick={() => scroll(-1)}>
        ←
      </button>
      <button type="button" aria-label="Siguiente" aria-controls={trackId} className={button} onClick={() => scroll(1)}>
        →
      </button>
    </div>
  );
}
