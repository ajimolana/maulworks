"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { pressPulse } from "./pressPulse";

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

  // Index the last tap is heading to, so quick repeated taps step from there, not from a mid-scroll position
  const pendingRef = useRef<number | null>(null);
  // Removes the listeners/timers of the scroll in flight and turns snapping back on
  const settleRef = useRef<(() => void) | null>(null);

  useEffect(() => () => settleRef.current?.(), []);

  // Where card i rests when snapped: its snap-center or snap-start position, clamped to the scroll range.
  // When a dot stands for a page of photos (count != number of children), use an even share of the range.
  const targetLeft = (el: HTMLDivElement, i: number) => {
    const max = el.scrollWidth - el.clientWidth;
    const card = el.children[i] as HTMLElement | undefined;
    if (!card || el.children.length !== count) return (i / (count - 1)) * max;
    const elRect = el.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset = el.scrollLeft + cardRect.left - elRect.left;
    const left = getComputedStyle(card).scrollSnapAlign.includes("center")
      ? offset - (el.clientWidth - cardRect.width) / 2
      : offset - (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0);
    return Math.min(max, Math.max(0, left));
  };

  // iOS Safari pulls a programmatic smooth scroll on a scroll-snap container back to a snap point mid-way,
  // often the card it started from. So snapping is switched off for the scroll and restored once the scroll
  // has been idle for 150ms (1.2s at most). The target is the card's exact snap position, so restoring snap
  // doesn't move it.
  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    settleRef.current?.();
    pendingRef.current = i;

    let idle: ReturnType<typeof setTimeout> | undefined;
    let cap: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(idle);
      idle = setTimeout(settle, 150);
    };
    const settle = () => {
      clearTimeout(idle);
      clearTimeout(cap);
      el.removeEventListener("scroll", onScroll);
      el.style.scrollSnapType = "";
      pendingRef.current = null;
      settleRef.current = null;
    };
    settleRef.current = settle;

    el.style.scrollSnapType = "none";
    el.addEventListener("scroll", onScroll, { passive: true });
    idle = setTimeout(settle, 300); // in case no scroll event fires (already at the target)
    cap = setTimeout(settle, 1200);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: targetLeft(el, i), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const current = () => pendingRef.current ?? active;

  if (!overflows || count < 2) return null;

  // 44px tap area (-my-[11px] keeps it to 22px of layout). The press scale runs from the click handler (pressPulse),
  // not CSS :active, so taps iOS Safari redirects to the button still show it. No pressed background (owner's choice).
  const navClass =
    "flex items-center gap-1.5 min-h-11 -my-[11px] px-3 -mx-3 text-sm text-white/60 transition-opacity [-webkit-tap-highlight-color:transparent] disabled:opacity-20";

  return (
    // relative z-10: the carousel track's bottom padding (room for card shadows) reaches into this row, and iOS Safari
    // lets that scroll layer swallow taps on Prev / Next and the dots unless this row sits above it
    <div className={`relative z-10 flex items-center ${showNav ? "justify-between" : "justify-center"} ${className}`}>
      {showNav && (
      <button
        type="button"
        onClick={(e) => { pressPulse(e.currentTarget); goTo(Math.max(0, current() - 1)); }}
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
        onClick={(e) => { pressPulse(e.currentTarget); goTo(Math.min(count - 1, current() + 1)); }}
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
