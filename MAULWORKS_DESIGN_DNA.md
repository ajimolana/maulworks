# 🧬 MAULWORKS_DESIGN_DNA.md
### Maulworks — Maulana Raji Shofil Fuadi's Design & Engineering DNA

> **📌 Note to AI / Coding Assistants:**
> This document is the definitive Design & Engineering DNA of **Maulworks** (the personal portfolio & digital creative engineering showcase of Maulana Raji Shofil Fuadi). When assisting with this codebase, internalize all patterns, preferences, and architectural principles below. Treat this as your primary source of truth for the Maulworks aesthetic and technical standards. Do not deviate from this DNA unless explicitly requested.

---

## 0. The Core Philosophy

Maulworks is engineered around digital experiences that feel **premium, alive, and respectful of the user's time and input method.** The project sits at the intersection of design craft and software engineering — it is never enough for an interface to look good or simply function; it must do both with obsessive care.

Three words that define the Maulworks craft: **Tactile. Polished. Intentional.**

---

## 1. 🎨 Visual & Aesthetic DNA (The Look)

### Color System
- **Always dark-first.** Root background is `#101010` or `#111111`. Never pure black (`#000000`) — slightly elevated dark feels significantly more premium, intentional, and easy on the eyes.
- **Use CSS Custom Properties for theming.** The entire color system is driven by CSS variables in `globals.css`:
  ```css
  --theme-main: #101010;        /* Page background */
  --theme-accent: #ffffff;      /* Primary accent color (swappable to lime, cyan, etc.) */
  --theme-bg-gradient: #101e21; /* Used in gradient/aurora backdrop effects */
  ```
- **Accent color is swappable by design.** The accent system is built to pivot when needed while maintaining visual harmony:
  - **Pure White:** `#ffffff` (clean, minimal, high-end editorial feel — current default)
  - **Lime Green:** `#C6F10E` (vibrant, energetic, creative technologist feel)
  - **Vivid Cyan:** `#57e5e1` (tech-forward, computational, crisp feel)
- **Accent on backgrounds must invert:** If `--theme-accent` is used as a background fill, text ON IT must use `--theme-main` as the color (never hardcoded white). This ensures contrast and readability are always preserved regardless of what accent color is currently active.

### Glassmorphism — The Maulworks Signature Texture
Nearly every elevated surface (card, modal, navigation pill) is **semi-transparent with backdrop blur**, not solid opaque:
```css
/* Card / Surface */
bg-[#111111] border border-white/15

/* Floating / Overlay element */
bg-white/5 border border-white/10 backdrop-blur-md

/* Active Nav / Pill that has scrolled */
bg-[#111111]/80 backdrop-blur-md border border-white/10
```
Rule: Never use a flat, opaque background for floating or elevated elements.

### Shape Language — High Radius
All shapes use aggressive, generous border-radius values to feel soft, tactile, and modern:
| Element | Radius |
|---|---|
| Main page containers / modals | `rounded-3xl` |
| Inner image blocks / sub-cards | `rounded-2xl` |
| Nav items / inner list items | `rounded-xl` or `rounded-2xl` |
| Buttons, badges, pills, tags | `rounded-full` |

### Typography — Poppins is the House Font
- **Font:** `Poppins` (Google Font) — loaded via `next/font/google` with weights `400, 500, 600, 700`.
- Applied globally on `<html>` and `<body>` via the `font-sans` utility class and `--font-poppins` CSS variable.
- **Hierarchy rules:**
  - Section headings: `text-3xl sm:text-4xl font-semibold text-white`
  - Hero headline: `text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight`
  - Body text: `text-sm md:text-base text-white` (readable, well-spaced)
  - **Labels / metadata / tags:** `text-[10px] uppercase tracking-wider text-white/60` — strict pattern applied across category labels, metadata rows, and pill tags.
  - Subtle text: `text-white/40` or `text-white/30` for secondary metadata, dates, and item counters.

### Shadows — Glows, Not Shadows
Never use standard drop shadows like `shadow-md` or `shadow-lg` (blurry black shadows). Depth in Maulworks is created through subtle luminous glows and hairline border illumination:
```css
/* Card hover glow */
hover:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)]

/* Header glow on scroll */
shadow-[0_8px_30px_rgba(0,0,0,0.4)]

/* Accent glow on CTA button */
hover:shadow-[0_0_20px_var(--theme-accent)]
```

### The "Top Highlight Line" Micro-Detail
Cards and interactive containers feature a hairline animated gradient line at the top edge that reveals itself on hover:
```tsx
<div className="
  pointer-events-none absolute inset-x-0 top-0 h-px
  bg-gradient-to-r from-transparent via-white/30 to-transparent
  opacity-0 group-hover:opacity-100 transition-opacity duration-300
" />
```

### Decorative Background Icons
In achievement/metric cards, large SVG icons are placed as atmospheric watermarks in the bottom corner with ultra-low opacity:
```css
/* Watermark icon in card background */
absolute -bottom-4 -right-4 w-32 h-32 text-white/[0.03] -rotate-12
group-hover:text-white/[0.05] transition-colors duration-300
```

---

## 2. ⚡ Interaction & Animation DNA (The Feel)

### Animation Library: Framer Motion
All mounting/unmounting transitions, layout morphs, and gestures use **Framer Motion** (`motion`, `AnimatePresence`, `layoutId`). No choppy CSS-only hacks for overlay states.

### Easing — The Signature Curves
Consistently applied easing values:
- **For modals/overlays:** `ease: [0.32, 0.72, 0, 1]` — rapid entry with an ultra-smooth, cushioned stop.
- **For spring animations:** `type: "spring", stiffness: 350, damping: 30` (nav active pill) or `damping: 25, stiffness: 300` (modals/lightbox).

### Scroll-Into-View Animations (AnimatedSection)
Every major section wraps its content in `<AnimatedSection>` — a reusable component leveraging `useInView`. Sections enter smoothly from `y: 30, opacity: 0` to `y: 0, opacity: 1` with `staggerChildren: 0.1` when entering the viewport.
```tsx
// Usage
<AnimatedSection id="projects" className="w-full mt-12 md:mt-20 scroll-mt-28">
  ...
</AnimatedSection>
```

### Tactile Feedback (Active States)
**Every** clickable element (buttons, interactive cards, chips) must feature `active:scale-95` or `active:scale-[0.98]`. Micro-tactility simulates physical responsiveness and is non-negotiable.

### Hover States — Elevation & Glow
Hoverable cards use a consistent trio of micro-interactions:
```css
hover:-translate-y-1          /* Subtle vertical lift */
hover:border-white/40         /* Border illumination */
hover:shadow-[...]            /* Luminous glow activation */
transition-all duration-300   /* Smooth transition */
```

### The "Shine" Effect on CTA Buttons
Primary CTA buttons ("Explore Projects", "Send Message") have an animated shimmer that sweeps across on hover:
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
```
The button container must have `overflow-hidden` and `group` class, and inner text must have `relative z-10`.

### Image Loading — Fade-In Skeleton
Images are never rendered raw without a loading state. Skeletons or spinners hold the layout space, and images smoothly fade in (`opacity-0 → opacity-100` via `transition-opacity duration-500 ease-in-out` on the `onLoad` event).

---

## 3. 🧭 Navigation DNA (PillNav)

The Maulworks navigation is a custom `<PillNav>` component featuring signature behaviors:

### Scroll-Aware Transformation
The nav bar dynamically **morphs** based on scroll depth:
- **At top (scrollY ≤ 50):** Edge-to-edge transparent container, full-width, no border.
- **After scroll (scrollY > 50):** Morphs into a floating pill: `bg-[#111111]/80 backdrop-blur-md rounded-full border-white/10 shadow-xl`. Driven by `transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]` for an organic transition.

### Active Item — Sliding Pill (layoutId)
The active nav item is highlighted by a pill background that **slides** fluidly between tabs using Framer Motion's `layoutId="pillNavActiveBackground"`.

### Scroll Spy with Interaction Debounce
The nav dynamically detects which section occupies the viewport via scroll listeners and `getBoundingClientRect()`, updating active state at the 50% viewport threshold. A `isClickingRef` lock prevents scroll spy from overriding explicit user clicks for 1 second.

### Mobile — Draggable Bottom Sheet
On mobile devices, navigation transforms into a draggable bottom drawer:
- Slides up from the bottom with a spring animation.
- Features a **drag handle** at the top (rounded white pill).
- Dismissible by **dragging down >80px** (powered by the Pointer Events API — works seamlessly across both touch and mouse drag).
- Drawer items animate in with staggered entrance delays (`delay: i * 0.04`).

---

## 4. 🪟 Overlay & Modal DNA

### The Three Overlay Layers
Maulworks maintains a strict z-index and interaction hierarchy for overlays:
1. **ProjectModal / ContactModal** — Primary content modals (`z-40`), slide up from below with spring physics.
2. **Lightbox** — Full-screen media viewer (`z-[100]`), ultra-dark backdrop (`bg-black/95`).
3. **PillNav Mobile Sheet** — Navigation bottom drawer (`z-[99]`).

### Modal Structure — Standard Architecture
Every modal follows this verified pattern:
- Outer `<motion.div>`: Backdrop — `bg-black/60 md:bg-black/70 backdrop-blur-sm`. Clicking closes the modal.
- Inner `<motion.div>`: Content card — `bg-[#111111] border border-white/20 rounded-3xl`. Clicking stops event propagation.
- Close trigger: Always provided — header close button on desktop, floating trigger on mobile.

### Lightbox — Advanced Capabilities
The `<Lightbox>` component includes:
- **Touch swipe gestures** to navigate between media items (50px swipe threshold).
- **Full keyboard navigation** (`ArrowLeft` / `ArrowRight` to navigate; `Escape` to close).
- Media counter (`1 / N` format) and descriptive captions.
- Frosted floating control bar at the bottom: `bg-black/60 backdrop-blur-md border border-white/10 rounded-full`.

### "Close Button Floating Outside" Pattern
For modal experiences on mobile, the close button floats **outside and below** the modal card, centered at the bottom of the viewport (`absolute bottom-6 inset-x-0 flex justify-center`). This ensures effortless thumb reachability and keeps internal content uncluttered:
```tsx
<div className="absolute bottom-6 inset-x-0 flex justify-center z-50 px-4 pointer-events-none">
  <button className="... pointer-events-auto">✕</button>
</div>
```

---

## 5. 📱 Mobile-First UX Patterns (The Polish)

### Browser History Integration (The Back Button Pattern)
Every modal or fullscreen overlay pushes a synthetic state to browser history. A global `popstate` listener dismisses the overlay when the user presses their device's physical or browser back button, preventing unwanted page unloads:
```tsx
// Opening an overlay
window.history.pushState({ modalOpen: true }, "");
setActiveProject(project);

// Listening for back button
window.addEventListener("popstate", handlePopState);
```

### Scroll Locking
When any overlay is active (`activeProject !== null || lightbox.isOpen || isContactOpen`), scroll locking is applied to both `document.body` and `document.documentElement`:
```tsx
document.body.style.overflow = "hidden";
document.documentElement.style.overflow = "hidden";
```
Strictly cleaned up in the `useEffect` unmount callback.

### Input Method Detection — `pointer: fine`
Uses `window.matchMedia('(pointer: fine)').matches` to distinguish mouse users from touch users:
- Horizontal carousel scroll arrows are displayed **only** to mouse users.
- Touch users interact via natural touch swipe.
- Custom scrollbar styling is scoped to mouse environments (`@media (pointer: fine)`).

### Adaptive Component Layouts (Mobile vs. Desktop)
Key components feature distinct structural adaptations for mobile and desktop served by a single component:
- **AchievementShelf:** Desktop = `grid-cols-5` card grid; Mobile = paginated list rows with dot indicators.
- **Project & Research Sections:** Desktop = CSS Grid (`md:grid-cols-3`); Mobile = Horizontal snap-scroll carousel.

### Horizontal Snap Scroll (Mobile Carousel Pattern)
For mobile card rows:
```tsx
<div ref={ref} className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide
  ... md:grid md:grid-cols-3 md:overflow-visible">
  {items.map(item => (
    <div className="snap-center snap-always flex-none w-[80vw] sm:w-[45vw] md:w-auto">
      <Card />
    </div>
  ))}
</div>
```
Negative outer margins (`-mx-4 px-4`) let cards bleed to screen edges while snapping neatly into center focus.

---

## 6. 🏗️ Engineering & Architecture DNA (The Code)

### Tech Stack
- **Framework:** Next.js (App Router, clean `"use client"` scoping)
- **Styling:** TailwindCSS + custom CSS properties in `globals.css`
- **Animation:** Framer Motion (`motion`, `AnimatePresence`, `useInView`, `layoutId`)
- **Typography:** Poppins via `next/font/google`
- **Contact Forms:** Web3Forms API (`NEXT_PUBLIC_WEB3FORMS_KEY`)
- **Images:** `next/image` with `fill`, optimized thumbnail quality (`quality={50}`), and modal display quality (`quality={85}`).

### Data Separation — Single Source of Truth
All portfolio data resides in **one single file**: `app/data/portfolio.ts`. UI components are purely presentational and never hardcode static content:
```ts
export const experiencesData: Project[] = [ ... ];
export const projectsData: Project[] = [ ... ];
export const researchData: Project[] = [ ... ];
export const organizationsData: Project[] = [ ... ];
export const achievements: AchievementItem[] = [ ... ];
export const aboutModalData = { education: ..., cert_data_analyst: ..., ... };
```

### TypeScript — Strict Data Contracts
Structured type definitions guarantee consistency across components:
```ts
export type Project = {
  id: string;
  cardTag: string;       // e.g., "Internship", "Research"
  year: string;
  title: string;
  shortDesc: string;
  period?: string;
  roleLabel?: string;
  role?: string;
  details?: DetailItem[];
  heroImage?: string;
  logo?: string;
  gallery?: GalleryItem[]; // GalleryItem = string | [string, string] (src + caption)
  link?: string | null;
  links?: ProjectLink[];
  ctaLabel?: string;
};
```

### Lazy Loading — Performance by Default
Heavy interactive or visual components are lazy-loaded using `next/dynamic`:
```ts
const Aurora = dynamic(() => import("./components/Aurora/Aurora"), { ssr: false });
const LogoLoop = dynamic(() => import("./components/LogoLoop/LogoLoop"));
const ProjectCard = dynamic(() => import("./components/ProjectCard"));
const ProjectModal = dynamic(() => import("./components/ProjectModal"));
const Lightbox = dynamic(() => import("./components/Lightbox"));
```
Immediate static components (like `AnimatedSection`) use standard imports.

### Prop-Driven Variants — One Component, Multiple Forms
Single components handle diverse presentation variants via a clean `variant` prop:
```tsx
<ProjectCard variant="default" />      // Rich card with hero image
<ProjectCard variant="research" />     // Text-centric, compact layout
<ProjectCard variant="organization" />  // Horizontal row with logo
```

### Detail Content — "Highlight" Impact Pattern
In modal detail views, key outcome labels (`result`, `impact`, `metrics`, `hasil`) automatically receive an accented callout treatment (themed border + accent color) to highlight quantifiable value over routine duties.

### useMemo & useCallback — Performance Hygiene
Heavy object transformations, filtered lists, and callback handlers passed to children are systematically wrapped in `useMemo` and `useCallback` to prevent redundant re-renders.

---

## 7. ♿ Accessibility (a11y) DNA

- Visually hidden skip-to-content anchor: `<a href="#about" className="sr-only focus:not-sr-only ...">Skip to content</a>`.
- Descriptive `aria-label` attributes on all icon-only buttons and modal controls.
- Comprehensive keyboard operability: `Escape` closes active overlays; `ArrowLeft`/`ArrowRight` navigates media carousels and Lightbox.
- Scrollable horizontal containers include `overscroll-x-contain` to prevent page scroll chaining.

---

## 8. 🌐 SEO & Metadata DNA

- `layout.tsx` exposes complete Next.js `Metadata` and `Viewport` exports.
- Rigorous OpenGraph and Twitter card metadata configured with 1200x630 preview assets.
- `metadataBase` resolves from `process.env.NEXT_PUBLIC_BASE_URL` with a reliable production fallback.
- `viewport.themeColor` aligns with `--theme-main` (`#101010`).
- `viewportFit: "cover"` enables edge-to-edge layout on mobile displays with notches.
- `robots.ts` and `sitemap.ts` files provide automated indexing directives.

---

## 9. 🎛️ Scrollbar Styling DNA

Custom scrollbars are refined and restricted exclusively to pointer-fine devices:
```css
@media (pointer: fine) {
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
  * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) rgba(255,255,255,0.05); }
}
```
Horizontal swipe rows use the `scrollbar-hide` utility to preserve clean presentation while retaining native scroll physics.

---

*By deeply understanding and adhering to all patterns in this document, you ensure that every feature, component, and commit maintains the signature Maulworks craft: tactile, polished, and unmistakably intentional.*
