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
Rule: Floating elements (nav pill, close/lightbox controls, badges) use translucent fills with backdrop blur. In-flow content cards and modal panels use the solid `#111111` surface with a `border-white/15` hairline.

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
  - **Card titles:** `text-base sm:text-lg font-semibold` on every card (Project, Research, Experience, Organization), the same as the modal title. Project cards already stand out through their hero image; a bigger title on top of that reads as a headline.
  - **Project modal (reading surface):** labels `text-[11px] sm:text-xs`, body `text-[13px] sm:text-sm leading-relaxed`, title `text-base sm:text-lg`. Compact, but people read here longest, so nothing below 11px.
  - Subtle text: `text-white/50` minimum (`/40` only for purely decorative glyphs) for secondary metadata, dates, and item counters, at `text-[11px]` or larger. Lower opacities fail WCAG AA contrast on `#111`.

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
Achievement cards feature a hairline animated gradient line at the top edge that reveals itself on hover:
```tsx
<div className="
  pointer-events-none absolute inset-x-0 top-0 h-px
  bg-gradient-to-r from-transparent via-white/30 to-transparent
  opacity-0 group-hover:opacity-100 transition-opacity duration-300
" />
```

### Achievements List
Achievements are a quiet list, not cards: they are secondary to Projects/Research and should not compete with them. One row pattern everywhere (icon · title over "organizer · date" · arrow on clickable rows). Mobile pages through 5 rows with Prev/Next; from `md` all rows show in two columns that fill top-to-bottom (`grid-flow-col`), so date order reads down. Not one full-width column: at desktop width the arrow drifts far from the text. Every row has the same `-mx-3 px-3` so dividers line up whether or not the row is clickable.

Each row shows a small decorative line icon (`w-4 h-4 text-white/50`). No category label or pill: without a filter it only repeats what the title already says. The data field is `icon`, typed as `AchievementIcon`. No oversized watermark icons: at low opacity they vanish on most screens.

### Uniform Line Counts
Card texts that sit side by side share one line count: two lines only when every one of them needs two, otherwise one line for all, truncated with an ellipsis. Mixed counts leave empty gaps in the shorter cards. It needs measuring, so it lives in `useUniformLines` (mark texts with `data-uniform-lines="<key>"`); Project and Research cards use it for title and description, measured per section (all cards in the grid or carousel, not per visual row). Apply it to any new side-by-side card text instead of a fixed `line-clamp-2` or `min-h` reservation.

### Tactile Feedback (Active States)
Primary clickable elements (CTAs, project/organization cards, achievement cards, contact submit) feature `active:scale-95` or `active:scale-[0.98]`. Small utility controls (carousel arrows, About info cards) may rely on hover/background feedback instead.

### Hover States — Glow, No Lift
Hoverable cards stay in place. Feedback comes from light, not movement:
```css
hover:border-white/40         /* Border illumination */
hover:shadow-[...]            /* Luminous glow activation */
transition-all duration-300   /* Smooth transition */
```
Never use `hover:-translate-y-*` on cards: it stacks with the glow and image zoom, and Tailwind's `hover:` sticks after a tap on touch devices. Keyboard focus (`focus-visible:`) mirrors the hover border and glow.

### Clickable Card Signal
Only Achievement cards and rows show a ↗ arrow, because only some of them link to a detail modal. Project, Research, Experience and Organization cards are all clickable, so they carry no arrow: an arrow beside the year reads as if it opens the year.

Achievement rows on mobile show the date after the organizer (`Organizer · Oct 2025`), never in a right-hand column that the arrow would push out of line, and carry no index numbers (`01`, `02`, …).

### The "Shine" Effect on CTA Buttons
Primary CTA buttons ("Explore Projects", "Send Message") have an animated shimmer that sweeps across on hover:
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
```
The button container must have `overflow-hidden` and `group` class, and inner text must have `relative z-10`.

### Image Loading — Fade-In Skeleton
Large images that load on demand (modal gallery, Lightbox) show a spinner while loading and fade in (`opacity-0 → opacity-100` via `transition-opacity duration-500 ease-in-out` on the `onLoad` event). Card thumbnails rely on `next/image` lazy loading.

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
1. **ProjectModal** (`z-40`) and **ContactModal** (`z-[9999]`) — Primary content modals. They scale and fade in; ContactModal uses spring physics.
2. **Lightbox** — Full-screen media viewer (`z-[100]`), ultra-dark backdrop (`bg-black/95`).
3. **PillNav Mobile Sheet** — Navigation bottom drawer (`z-[99]`).

### Modal Structure — Standard Architecture
Every modal follows this verified pattern:
- Outer `<motion.div>`: Backdrop — `bg-black/60 md:bg-black/70 backdrop-blur-sm`. Clicking closes the modal.
- Inner `<motion.div>`: Content card — `bg-[#111111] border border-white/20 rounded-3xl`. Clicking stops event propagation.
- Close trigger: ProjectModal uses the floating close button below the card (see below); ContactModal has a header close button.
- Dialog semantics: the panel carries `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing at its title. `useDialogFocus` moves focus into the panel on open and restores it to the trigger on close.

### Lightbox — Advanced Capabilities
The `<Lightbox>` component includes:
- **Touch swipe gestures** to navigate between media items (50px swipe threshold).
- **Keyboard navigation** (`ArrowLeft` / `ArrowRight` to navigate). `Escape` is handled once, centrally in `page.tsx`, via `history.back()`. Overlay components must not also handle `Escape`, or the history is popped twice.
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
- Horizontal carousels snap items to the center (`snap-center snap-always`) and show `ScrollDots` (`app/components/ScrollDots.tsx`, decorative, `aria-hidden`): the active dot stretches to `w-4 bg-white/80`, the rest are `w-1.5 bg-white/25`. Page carousels show them below `md`; the modal Documentation gallery shows them at every size. Dots hide themselves when nothing overflows.
- Touch targets are at least 44px (`w-11 h-11`), even when the visible icon is smaller (footer social icons). The larger hit area stays invisible: footer icons keep their `hover:opacity-80` feedback, no background.
- Touch users interact via natural touch swipe.
- Custom scrollbar styling is scoped to mouse environments (`@media (pointer: fine)`).

### Adaptive Component Layouts (Mobile vs. Desktop)
Key components feature distinct structural adaptations for mobile and desktop served by a single component:
- **AchievementShelf:** Tablet = `grid-cols-2`, desktop (`lg`) = `grid-cols-5` card grid; Mobile = paginated list rows with dot indicators.
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
- **Framework:** Next.js 14 (App Router, clean `"use client"` scoping)
- **Styling:** TailwindCSS + custom CSS properties in `globals.css`
- **Animation:** Motion (`motion/react`: `motion`, `AnimatePresence`, `useInView`, `layoutId`, `MotionConfig`)
- **WebGL:** `ogl` powers the hero Aurora backdrop. It renders only while on screen, caps DPR at 1.5, and draws a single static frame under reduced motion.
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

### Detail Content — Data Order, One Style
Modal details render in the order they appear in `portfolio.ts` (e.g. Problem → My Role → Method → Result), all with the same label + body style. No label gets a callout box or is pulled to the top: a boxed Result above the Problem reads backwards.

### useMemo & useCallback — Performance Hygiene
Heavy object transformations, filtered lists, and callback handlers passed to children are systematically wrapped in `useMemo` and `useCallback` to prevent redundant re-renders.

---

## 7. ♿ Accessibility (a11y) DNA

- Visually hidden skip-to-content anchor: `<a href="#about" className="sr-only focus:not-sr-only ...">Skip to content</a>`.
- Descriptive `aria-label` attributes on all icon-only buttons and modal controls.
- Anything clickable is a real `<button>` or `<a>`, never a `<div onClick>`.
- Modals expose `role="dialog"` + `aria-modal` and manage focus (see Overlay DNA).
- Motion honors `prefers-reduced-motion` through `MotionProvider`.
- Comprehensive keyboard operability: `Escape` closes active overlays; `ArrowLeft`/`ArrowRight` navigates media carousels and Lightbox.
- Scrollable horizontal containers include `overscroll-x-contain` to prevent page scroll chaining.

---

## 8. 🌐 SEO & Metadata DNA

- `layout.tsx` exposes complete Next.js `Metadata` and `Viewport` exports.
- Rigorous OpenGraph and Twitter card metadata. The preview is `public/og-image.jpg` at 1200x630 and under ~300KB (some platforms crop other ratios or skip larger previews); capture the hero at 1920x1008 on desktop, then scale down. Re-export it whenever the hero design changes.
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

## 10. 🧹 Maintenance Rules

- **Layout components live outside `page.tsx`.** `AboutSection` and `Footer` are their own files; their copy (scholarships, About modal data) comes from `portfolio.ts`. About: a profile row (small round portrait `w-12`/`w-16` from `public/assets/about/portrait.png`, the only photo of the owner on the site, plus name and field), a full-width bio adapted from the CV profile (below `sm` only the opening line "I turn numbers into decisions." shows, the rest sits behind "..." and an inline "more" link (no "less": tapping the open text collapses it; bio text is `text-sm` on phones) at the end of the text, social-caption style, not on its own line; always full from `sm` up), then two equal columns from `lg` up, Education + Tech Stack and Certifications + Scholarships, with near-equal row counts so both columns end close to level. Rows, not cards; a row without a detail modal (Apple Developer Academy, until it has content) renders as plain text with no hover. Keep the row counts balanced when adding items. Tech Stack lists tools only (skills belong in projects and the bio), one row per category: label left, `·`-separated tools right from `sm` up; below `sm` the label stacks above the tools so no tool list wraps. Below `lg` (single column) Tech Stack moves to the bottom of the card as a collapsed section with a chevron toggle.
- **No unused dependencies or dead code.** Remove a package when its last import goes; run `npx tsc --noEmit` and `npm run lint` before committing.
- **Size assets for their display size.** Logos are exported at ~4x their rendered size; screenshots stay under ~500KB. Public files are world-readable, so do not put private documents (e.g. the CV) in `public/`.
- **Portfolio copy lives in `app/data/portfolio.ts`.** Keep it in English, keep `year` consistent with `period`, and never commit placeholder values such as `"-"`. A project `link` that points to a section must use an in-page action, not `target="_blank"` to a `#hash`.
- **Don't resurrect Tailwind v4 / shadcn tooling.** The project is on Tailwind v3; the shadcn CSS imports were removed because they target v4.

---

*By deeply understanding and adhering to all patterns in this document, you ensure that every feature, component, and commit maintains the signature Maulworks craft: tactile, polished, and unmistakably intentional.*
