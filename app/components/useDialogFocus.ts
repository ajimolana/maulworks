import { useEffect, useRef } from "react";

// Moves focus into a dialog when it opens and restores it to the trigger on close.
export function useDialogFocus<T extends HTMLElement>(isOpen: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => trigger?.focus?.({ preventScroll: true });
  }, [isOpen]);

  return ref;
}
