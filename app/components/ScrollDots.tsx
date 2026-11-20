"use client";

import { useEffect, useState, RefObject } from "react";

// Position indicator and controls for a horizontal snap carousel: Prev / Next and clickable dots,
// styled like the AchievementShelf pager, so the carousel works without a swipe gesture (WCAG 2.5.1).
// Renders nothing when the content doesn't overflow.
export default function ScrollDots({
  scrollRef,
  count,
  itemLabel = "item",
  showNav = true,
  className = "",
}: {
  scrollRef: RefObject<HTMLDivElement>;
  count: number;
  itemLabel?: string;
  // false when the section already shows its own arrow buttons (mouse users), so the controls aren't doubled
  showNav?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setOverflows(max > 1);
      if (max > 1) setActive(Math.round((el.scrollLeft / max) * (count - 1)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRef, count]);

  // Dot i maps to an even share of the scroll range (the same mapping `active` uses), so it works whether
  // a dot stands for one card or a page of photos; scroll snapping settles the exact position
  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: (i / (count - 1)) * max, behavior: reduceMotion ? "auto" : "smooth" });
  };

  if (!overflows || count < 2) return null;

  // -my-[11px]: a 44px tap area that only takes 22px of layout, so Prev / Next doesn't push the row away from the cards
  const navClass =
    "flex items-center gap-1.5 min-h-11 -my-[11px] px-2 -mx-2 text-sm text-white/60 disabled:opacity-20 transition-opacity active:scale-95";

  return (
    <div className={`flex items-center ${showNav ? "justify-between" : "justify-center"} ${className}`}>
      {showNav && (
      <button
        type="button"
        onClick={() => goTo(Math.max(0, active - 1))}
        disabled={active === 0}
        className={navClass}
        aria-label={`Previous ${itemLabel}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Prev
      </button>
      )}

      {/* Dots sit 6px apart: no gap, 3px side padding per button. Their tap areas stay small, which is fine
          because Prev / Next is the full-size control (WCAG 2.5.8 equivalent-control exception) */}
      <div className="flex items-center">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to ${itemLabel} ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className="px-[3px] py-2 group/dot"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-4 bg-white/80" : "w-1.5 bg-white/25 group-hover/dot:bg-white/40"}`}
            />
          </button>
        ))}
      </div>

      {showNav && (
      <button
        type="button"
        onClick={() => goTo(Math.min(count - 1, active + 1))}
        disabled={active === count - 1}
        className={navClass}
        aria-label={`Next ${itemLabel}`}
      >
        Next
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      )}
    </div>
  );
}
