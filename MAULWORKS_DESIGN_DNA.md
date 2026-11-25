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

### Hero — Monochrome and One Action
- **Aurora is monochrome silver:** `colorStops={["#2a2a2e", "#c8c8d0", "#2a2a2e"]}`, one hue, light in the middle and dark at the edges, so it fades into `#101010` instead of reading as a rainbow. Never the React Bits demo palette (`#7cff67` / `#B497CF` / `#5227FF`) or electric violet: both read as template or "AI startup" and match nothing else on the site. If the accent ever changes, the aurora follows it as a single hue.
- **Badge is a label, not a button:** one outline pill (`border-white/10 bg-white/[0.03] backdrop-blur-md`) holding a single sentence at one size, "Based in" in `#a1a1aa` and "Jakarta, Indonesia" in `text-white/90`. No solid white inner pill: white fill with black bold text is the primary CTA's look and makes the badge read as a second button.
- **Hero logo strip keeps full color:** the "Experiences & Affiliations" logos stay in their original colors. A grayscale version was tried and rejected.
- **Hero name scales with the viewport on desktop:** `lg:text-[clamp(4.5rem,8vw,5.5rem)]` with `lg:whitespace-nowrap`. A fixed `5.5rem` left the one-line name about 10px from the edges at 1024px (also roughly a 1366px laptop at 125% Windows scaling); now it keeps at least ~44px each side.
- **One CTA:** "Explore Projects" (`#projects`) is the only hero button. "About Me" was dropped because About sits right below the hero and is already first in the nav. The CTA row has no bottom margin on phones (`sm:mb-16` only): with `mb-16` the hero block sat high, about 190px under the nav but 240px above the logo strip.

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
| Main page containers / modals | `rounded-3xl` (`rounded-2xl` on phones, below `sm`) |
| Inner image blocks / sub-cards | `rounded-2xl` |
| Nav items / inner list items | `rounded-xl` or `rounded-2xl` |
| Buttons, badges, pills, tags | `rounded-full` |

### Typography — Poppins is the House Font
- **Font:** `Poppins` (Google Font) — loaded via `next/font/google` with weights `400, 500, 600, 700`.
- Applied globally on `<html>` and `<body>` via the `font-sans` utility class and `--font-poppins` CSS variable.
- **Hierarchy rules:**
  - Section headings: `text-2xl sm:text-4xl font-semibold text-white`, `mb-4 sm:mb-6`
  - Phones (below `sm`) run a compact scale modelled on the Achievement shelf, while `sm` and up stay as they were: card titles `text-sm`, descriptions `text-[11px]`, tags `text-[10px]`; cards `rounded-2xl` with `p-2.5`/`p-3`, organization logos 40px; carousel cards `w-[74vw]`; grid and carousel gaps `gap-3`; sections `mt-10`; the About card `p-4`, its rows `text-[13px]` over `text-[11px]` with `py-1.5`, groups `pt-3`/`space-y-3`
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

### Intentional Layout Choices (Not Bugs)
- **Research titles truncate to one line on desktop** (they wrap on phones). Keep it.
- **Card titles may truncate at tight widths.** Projects, Experiences and Organizations titles cut off around 1024–1100px (a 1366px laptop at 125% scaling lands there), and Research keeps 3 columns at 768px even though its labels and titles cut off. Both were reviewed and accepted: don't add a second title line, shrink the title or change the column count to avoid it.
- **Grids keep their column count when a section has fewer cards** (two Experiences or Organizations in a 3-column grid, Projects as 3 + 2). The empty slot is accepted; don't switch those sections to 2 columns to fill the width.

### Achievements List
Achievements are a quiet list, not cards: they are secondary to Projects/Research and should not compete with them. One row pattern everywhere (icon · title over "organizer · date" · arrow on clickable rows). Mobile pages through 5 rows with Prev/Next; from `md` all rows show in two columns that fill top-to-bottom (`grid-flow-col`), so date order reads down. Not one full-width column: at desktop width the arrow drifts far from the text. Every row has the same `-mx-3 px-3` so text lines up whether or not the row is clickable. The divider sits on a square wrapper around the row, never on the rounded row itself: a `border-b` on a `rounded-xl` element curls up at both ends.

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
The button container must have `overflow-hidden` and `group` class, and inner text must have `relative z-10`. Hover is glow + shimmer only, no `hover:scale-*`: three effects at once read as overdone (same no-zoom rule as the Project card hero). `active:scale-95` stays as press feedback.

### Image Loading — Fade-In Skeleton
Image quality: card hero images and modal gallery thumbnails use `quality={85}`. They are UI screenshots full of small text and thin borders: at 50 AVIF smears them visibly, and 85 costs only ~2-6 KB more per image than 75. The site serves WebP only (`next.config.mjs`): AVIF visibly softens small text and thin borders even at 85, while WebP at 85 looks like the original. The Lightbox also uses `quality={85}` through the optimizer, not the raw files: originals are 141 KB to 1.4 MB, WebP is 5-20x lighter for screenshots. It sizes the photo with a fixed box (`w-[90vw] max-w-[1200px] h-[70vh]`, `fill` + `object-contain`), because with a responsive srcset the image's intrinsic size shrinks on retina screens and `w-auto h-auto` rendered it at half size. Always pass a `sizes` that matches the rendered width (remember `object-cover` can render wider than the box): without it `fill` images default to `100vw` and download a full-viewport file. The Project card hero box is `aspect-video` (16:9, like every project screenshot), not a fixed height: a fixed height changes the box ratio with card width and crops the sides on phones and tablets. New project screenshots should be 16:9. On hover the hero brightens slightly (`brightness-[1.08]`) instead of zooming: a zoom crops the shot again and softens its small text.

Modal gallery thumbnails show a spinner while loading and fade in (`opacity-0 → opacity-100` via `transition-opacity duration-500 ease-in-out` on the `onLoad` event). Card thumbnails rely on `next/image` lazy loading.

The Lightbox photos sit on a strip, one screen width apart: previous off the left edge, current, next off the right, all with the same image props so the neighbours are loaded before they slide in. On a phone the strip follows the finger once the drag is clearly sideways; letting go past a fifth of the screen or with a quick flick slides on to the next photo (0.32s, `[0.22, 1, 0.36, 1]`), otherwise it springs back. A single photo only gives a little. The Prev/Next buttons and the arrow keys slide the same way. Each slide shows its photo only once loaded, fading it in (0.2s), never half-drawn. The spinner appears only when a load takes longer than 200ms, fades in, and is absolutely centred on the photo area (never `position: fixed` inside the scaling container, which made it jump down once the spring settled). Opening from a documentation thumbnail zooms: the already-loaded thumbnail grows from its card to the exact spot the full photo will occupy (0.4s, `[0.22, 1, 0.36, 1]`, corner radius 16 → 0) while the backdrop darkens, then the full-size photo crossfades in over it. Closing reverses it: the photo on screen shrinks back into its own thumbnail (the carousel is first scrolled, instantly and hidden, to the card of whichever photo is open) while the overlay fades out. The real thumbnail stays in its card throughout (the backdrop is see-through, so hiding it left a visible hole that popped back): the copy lifts off it and settles back onto it. Reduced motion, a thumbnail that hasn't loaded, or one cut off by a scroll edge falls back to the plain fade.

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
- Closes on Escape, a backdrop tap or a drag down; the menu button carries `aria-expanded`.
- Features a **drag handle** at the top (rounded white pill).
- Dismissible by **dragging down >80px** (powered by the Pointer Events API — works seamlessly across both touch and mouse drag).
- Drawer items animate in with staggered entrance delays (`delay: i * 0.04`).
- Items are plain text rows: the active one gets `bg-white/10` + a border and white text. No bullets and no "Navigate" label; the handle heads the sheet.
- It rises from the bottom although the button is at the top on purpose: the items land in thumb reach, the same as the system share sheet.

---

## 4. 🪟 Overlay & Modal DNA

### The Three Overlay Layers
Maulworks maintains a strict z-index and interaction hierarchy for overlays:
1. **ProjectModal** (`z-40`) and **ContactModal** (`z-[9999]`) — Primary content modals. They scale and fade in; ContactModal uses spring physics.
2. **Lightbox** — Full-screen media viewer (`z-[100]`), see-through backdrop with a barely-there blur (`bg-black/70 backdrop-blur-[2px]`): the photo stays the focus while the modal behind still shows, so the zoom in and out of a thumbnail reads as one movement.
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
- Horizontal carousels snap items to the center (`snap-center snap-always`) for touch. For mouse users, who get arrow buttons, they snap to the start (`snap-start`, with `scroll-px-*` matching the side padding) and the arrows page through `pageCarousel` in `app/components/carousel.ts`: each click moves by every fully visible card and only clamps at the ends, so every card is shown whole at some point; `useScrollEdges` dims an arrow at its end. Never step by a fixed pixel offset: with center snapping that gave a first click of ~37px and cards cut on both sides. Carousels show `ScrollDots` (`app/components/ScrollDots.tsx`), a pager styled like the AchievementShelf one so no carousel depends on a swipe gesture (WCAG 2.5.1): every dot is a button, 6px apart, the active dot stretches to `w-4 bg-white/80`, the rest are `w-1.5 bg-white/25`, and Prev / Next buttons sit on either side unless `showNav` is false because the section already shows its mouse arrows. The pager row is `relative z-10`: the track's bottom padding overlaps it, and on iOS Safari that scroll layer otherwise takes taps on the Prev / Next labels and dots (only the strip below the track responded). Prev / Next and dots scroll to the card's exact snap position with scroll snapping switched off for that scroll (`scroll-snap-type: none`, restored after 150ms of idle, 1.2s at most): iOS Safari otherwise pulls a programmatic smooth scroll back to a snap point, often the starting card. Quick repeated taps step from the pending target, not from a mid-scroll position. Page carousels show them below `md`; the modal Documentation gallery shows them at every size. Dots hide themselves when nothing overflows. Exception: the modal Documentation gallery, for touch and mouse alike. Fixed 256px cards left it showing ~2.7 photos, so some photo was always cut and could never be seen whole. Instead a whole number of 16:9 (`aspect-video`) cards fills the gallery, narrowing with the screen: 1 per view on phones (`w-full`), 2 from 480px (`min-[480px]:`; at `sm` a lone card was ~550px wide), 3 from `md` (`w-[calc((100%-1.5rem)/3)]`), all `snap-start`. Each arrow click pages by that count and the last page aligns to the end (5 photos at 3 per view: 1-3, then 3-5). No card is ever cut. `usePageCount` gives the page count at the current width: dots count pages, and the mouse arrows only appear with more than one page. Each photo is a `<button>` (Tab + Enter open the Lightbox) and on hover or focus it brightens with a lighter border, like the Project card; it never dims.
- Touch targets are at least 44px (`w-11 h-11`), even when the visible icon is smaller (footer social icons, the mobile menu button with `-mr-1` so the icon stays put). The larger hit area stays invisible: footer icons keep their `hover:opacity-80` feedback, no background.
- **Prev / Next press feedback runs on click, not `:active`.** Prev / Next in the carousels (`ScrollDots`) and Achievements keep a 44px tap area (`min-h-11`, `px-3 -mx-3`) and call `pressPulse(e.currentTarget)` (`app/components/pressPulse.ts`, a 180ms scale to 0.95 and back via the Web Animations API, skipped under reduced motion) in their click handler. iOS Safari redirects near-miss taps to the closest button and fires its click without ever applying `:active`, so CSS-only feedback left taps just outside the button paging with no visible press, at any tap-area size. No pressed background or pill: the owner turned it down. Rule: if a control reacts to a tap, it shows it was pressed. The hero "Explore Projects" CTA uses `pressPulse` too. Other elements keep CSS `:active` on purpose: cards and full-width rows open a modal right away, so that result is the feedback, and they are big enough that redirected taps are rare. Not every element needs a press effect; what must not happen is the same action showing it only sometimes.
- Touch users interact via natural touch swipe.
- Custom scrollbar styling is scoped to mouse environments (`@media (pointer: fine)`).

### Adaptive Component Layouts (Mobile vs. Desktop)
Key components feature distinct structural adaptations for mobile and desktop served by a single component:
- **AchievementShelf:** Tablet = `grid-cols-2`, desktop (`lg`) = `grid-cols-5` card grid; Mobile = paginated list rows with dot indicators.
- **Project & Research Sections:** Desktop = CSS Grid (`md:grid-cols-3`); Mobile = Horizontal snap-scroll carousel.

### Footer Heading on Small Phones
"Get in Touch" is `whitespace-nowrap`, `text-lg` below 360px (`min-[360px]:text-xl`), and the four 44px icon buttons have no gap below 360px. At 320px it otherwise broke onto two lines.

### Horizontal Snap Scroll (Mobile Carousel Pattern)
For mobile card rows:
```tsx
<div ref={ref} className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide
  ... md:grid md:grid-cols-3 md:overflow-visible">
  {items.map(item => (
    <div className="snap-center snap-always flex-none w-[74vw] sm:w-[45vw] md:w-auto">
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
- **WebGL:** `ogl` powers the hero Aurora backdrop. It renders only while on screen, caps DPR at 1.5, and draws a single static frame under reduced motion. `uResolution` is the drawing-buffer size (`gl.canvas.width/height`), not the CSS size, because `gl_FragCoord` is in device pixels; the noise frequency scales with aspect (`clamp(aspect / 1.6, 0.4, 1.0)`) so portrait phones get wide waves instead of squeezed ones.
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
Modal layout: the links are plain pills with no "Link" label. From `sm` up they sit in the fixed header beside the title, the way App Store, GitHub or Behance put the main action next to the name, and stay in reach while the details are read. On phones they are the first row of the body, right under the title: in the header they doubled its height and squeezed the body. The body runs Period/Role, then Documentation, then the details: short first, longest last, with the photos as the quickest proof. Sections without content are left out. While the body has more to scroll, a 48px fade from `#111111` sits over its bottom edge and goes once the end is reached. Detail paragraphs and lists stop at `max-w-[70ch]` (full-width desktop lines ran ~100 characters). Focus is trapped in the modal's layer (the floating X included) by `useDialogFocus`, and the Lightbox uses the same hook, so over a modal Tab stays in the photo viewer and focus returns to the thumbnail on close.

Modal details render in the order they appear in `portfolio.ts` (e.g. Problem → My Role → Method → Result), all with the same label + body style. No label gets a callout box or is pulled to the top: a boxed Result above the Problem reads backwards. List details use a drawn 4px dot (`before:` on the `li`, `pl-4`, dot at `left-1`, centred on the first line), not `list-disc`: the browser marker sat far left of the text with a gap that can't be tightened. Wrapped lines align with the text, not the dot.

The header's link pills are the external links (`links`, or a single `link` + `ctaLabel`) — each pill is the destination's mark, then the label, with no arrow: the Google Colab logo (Simple Icons, in currentColor), a bar chart for Looker Studio, and a globe for any website, including project apps on Streamlit and Vercel. The mark is read from the address; short links (bit.ly) set `platform` in the data and, when the modal was opened from an Achievement row, a "View in Research/Projects/Organizations/Experiences" pill with an up arrow before the label (in-page, not the external ↗; every section it can lead to sits above Achievements, so if it is ever offered from elsewhere the arrow must follow the real direction). It closes the modal, scrolls the card to the middle of the screen (sliding a phone carousel to it) and pulses a white ring around it. Opened from the card itself, the pill is not shown. Cards carry `data-card-id={project.id}` for this.

### Copy — Written by a Person
Portfolio text must not read as AI-written. No em dashes (`—`) in visible copy: use a comma, a period or a new sentence. En dashes stay only in ranges (`2021 – 2026`, `2018–2024`). Avoid the tells: "not just X, it was Y", "true leadership is about", and brochure words like "innovative", "cutting-edge", "seamless". Plain, concrete sentences, like the Method bullets. Team size is not stated in project roles. Project card `shortDesc` lines are sentence case with no trailing period, worded like the matching "Selected Projects" row in the GitHub profile README, so the two stay in sync.

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
- Rigorous OpenGraph and Twitter card metadata. The preview is `public/og-image.jpg` at 1200x630 and under ~300KB (some platforms crop other ratios or skip larger previews). Re-export it whenever the hero changes, and bump the `?v=` query on its URL in `layout.tsx` (both `openGraph.images` and `twitter.images`) so WhatsApp and other apps drop their cached preview.
- **How the preview is captured:** headless Chrome at 1440x756 (same 1.905 ratio; wide enough for the full nav links, not the hamburger) at device scale 2, then scaled to 1200x630 with Lanczos and saved as JPEG quality 90. The `LogoLoop` track is frozen with an injected `transform: translate3d(...) !important` so the **midpoint between Apple Developer Academy and Bank Indonesia sits exactly at the horizontal center** (square crops in chat apps keep both), using a copy of the sequence whose neighbors fill both edges: Askrindo and Startup Campus on the left, BSI and CBP Rupiah on the right. The aurora keeps animating; capture after ~2.5s.
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

- **Layout components live outside `page.tsx`.** `AboutSection` and `Footer` are their own files; their copy (scholarships, About modal data) comes from `portfolio.ts`. About: no portrait, name or tagline (the hero already introduces the owner), just the bio adapted from the CV profile (below `sm` only the opening clause shows, the rest sits behind "..." and an inline "more" link at the end of the text, social-caption style, with no "less": tapping the open text collapses it; always full from `sm` up), then two equal columns from `lg` up, Education + Tech Stack and Certifications + Scholarships, with near-equal row counts so both columns end close to level. Rows, not cards; a row without a detail modal (Apple Developer Academy, until it has content) renders as plain text with no hover. Keep the row counts balanced when adding items. Tech Stack lists tools only (skills belong in projects and the bio), one row per category, each tool a `rounded-full` chip with its monochrome logo (paths in `app/data/techIcons.ts`, the same marks as the GitHub profile README badges; a new tool needs its path there): label left, chips right from `sm` up; below `sm` the label stacks above the chips, which may wrap. Below `lg` (single column) Tech Stack moves to the bottom of the card as a collapsed section with a chevron toggle.
- **No unused dependencies or dead code.** Remove a package when its last import goes; run `npx tsc --noEmit` and `npm run lint` before committing.
- **Size assets for their display size.** Logos are exported at ~4x their rendered size; screenshots stay under ~500KB. Public files are world-readable, so do not put private documents (e.g. the CV) in `public/`.
- **Portfolio copy lives in `app/data/portfolio.ts`.** Keep it in English, keep `year` consistent with `period`, and never commit placeholder values such as `"-"`. A project `link` that points to a section must use an in-page action, not `target="_blank"` to a `#hash`.
- **Don't resurrect Tailwind v4 / shadcn tooling.** The project is on Tailwind v3; the shadcn CSS imports were removed because they target v4.

---

*By deeply understanding and adhering to all patterns in this document, you ensure that every feature, component, and commit maintains the signature Maulworks craft: tactile, polished, and unmistakably intentional.*
