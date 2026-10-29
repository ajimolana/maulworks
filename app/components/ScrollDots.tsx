"use client";

import { useEffect, useState, RefObject } from "react";

// Position indicator for a horizontal snap carousel. Renders nothing when the content doesn't overflow.
export default function ScrollDots({ scrollRef, count, className = "" }: { scrollRef: RefObject<HTMLDivElement>; count: number; className?: string }) {
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

  if (!overflows || count < 2) return null;

  return (
    <div className={`flex justify-center gap-1.5 mt-2 ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-4 bg-white/80" : "w-1.5 bg-white/25"}`}
        />
      ))}
    </div>
  );
}
