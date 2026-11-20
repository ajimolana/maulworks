// Press feedback that runs on click instead of CSS :active. iOS Safari redirects near-miss taps to the closest
// button and fires its click without ever applying :active, so a control could react with no visible press.
// Running the scale from the click handler shows it for every activation: direct taps, redirected taps, keyboard.
export function pressPulse(el: HTMLElement) {
  if (typeof el.animate !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0.95)" }, { transform: "scale(1)" }],
    { duration: 180, easing: "ease-out" }
  );
}
