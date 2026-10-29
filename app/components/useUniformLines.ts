import { RefObject, useEffect, useState } from "react";

export type LineCount = 1 | 2;

// Gives every text marked data-uniform-lines="<key>" inside the container the same line count:
// two lines only when every one of them actually needs two, otherwise one line for all (truncated).
// Re-measures when the container resizes, so the answer follows the current layout.
export function useUniformLines<K extends string>(ref: RefObject<HTMLElement>, keys: readonly K[]) {
  const keyList = keys.join(",");
  const [lines, setLines] = useState(() => Object.fromEntries(keys.map((k) => [k, 1])) as Record<K, LineCount>);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const measure = () => {
      const next = {} as Record<K, LineCount>;
      for (const key of keyList.split(",") as K[]) {
        const els = Array.from(container.querySelectorAll<HTMLElement>(`[data-uniform-lines="${key}"]`));
        const allNeedTwo = els.length > 0 && els.every((el) => naturalLines(el) >= 2);
        next[key] = allNeedTwo ? 2 : 1;
      }
      setLines((prev) => (keyList.split(",").every((k) => prev[k as K] === next[k as K]) ? prev : next));
    };

    measure();
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [ref, keyList]);

  return lines;
}

// Lines the text would take with no clamping, measured by briefly lifting truncate/line-clamp.
function naturalLines(el: HTMLElement) {
  const prev = el.style.cssText;
  el.style.cssText += ";display:block;white-space:normal;overflow:visible;-webkit-line-clamp:unset";
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
  // offsetHeight ignores transforms, so entrance animations that scale the section don't skew it
  const lines = Math.round(el.offsetHeight / lineHeight);
  el.style.cssText = prev;
  return lines;
}
