import { useEffect, useRef } from "react";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Moves focus into a dialog when it opens, keeps Tab and Shift+Tab cycling inside it (instead of wandering to the
// page behind), and restores focus to the trigger on close.
export function useDialogFocus<T extends HTMLElement>(isOpen: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });

    const handleKey = (e: KeyboardEvent) => {
      // The trap covers the dialog's layer when it marks one (the project modal's X floats outside its box)
      const dialog = ref.current?.closest<HTMLElement>("[data-dialog-layer]") ?? ref.current;
      if (e.key !== "Tab" || !dialog) return;
      // Focus already in another layer on top (the Lightbox over the project modal) is that layer's business
      const active = document.activeElement;
      if (active && active !== document.body && !dialog.contains(active)) return;

      // Only what is actually shown: the link pills exist twice, one copy hidden per screen size
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (active === first || active === ref.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      trigger?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  return ref;
}
