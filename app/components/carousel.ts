import { RefObject, useEffect, useState } from "react";

// Arrow paging for snap-start carousels: moves by every fully visible card, so each click shows new cards
// instead of nudging one. Only clamps at the ends: jumping early to the edge would skip a card that never
// gets shown whole (with one card per view, the 4th of 5 was passed over).
export function pageCarousel(el: HTMLElement | null, direction: 1 | -1) {
  const [first, second] = Array.from(el?.children ?? []) as HTMLElement[];
  if (!el || !first || !second) return;
  const pitch = second.offsetLeft - first.offsetLeft;
  const gap = pitch - first.offsetWidth;
  // The left scroll padding is the gutter cards snap to; it isn't room for cards
  const visible = el.clientWidth - (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0);
  // + 0.01 absorbs sub-pixel widths, so cards sized to fill the view count in full
  const perPage = Math.max(1, Math.floor((visible + gap) / pitch + 0.01));
  const index = Math.round(el.scrollLeft / pitch);
  const max = el.scrollWidth - el.clientWidth;
  const left = Math.min(max, Math.max(0, (index + direction * perPage) * pitch));
  el.scrollTo({ left, behavior: "smooth" });
}

// How many arrow pages the carousel has at its current width (cards per view can change with the breakpoint)
// deps: pass whatever swaps the carousel element (e.g. the open project), or the observer stays on the old one
export function usePageCount(ref: RefObject<HTMLElement>, count: number, deps: unknown[] = []) {
  const [pages, setPages] = useState(count);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const first = el.children[0] as HTMLElement | undefined;
      if (!first) return;
      const perPage = Math.max(1, Math.round(el.clientWidth / first.offsetWidth));
      setPages(Math.ceil(count / perPage));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, count, ...deps]);

  return pages;
}

// Whether the carousel sits at either end, for dimming its arrows
export function useScrollEdges(ref: RefObject<HTMLElement>, deps: unknown[] = []) {
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft >= max - 1 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  return edges;
}
