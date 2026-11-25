import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Project, DetailItem, GalleryItem } from "../data/portfolio";
import { useDialogFocus } from "./useDialogFocus";
import ScrollDots from "./ScrollDots";
import LinkIcon from "./LinkIcon";
import { pageCarousel, usePageCount, useScrollEdges } from "./carousel";
import type { LightboxOrigin, LightboxThumb } from "./Lightbox";

// Not clipped by any scrolling ancestor (the carousel sideways, the modal body vertically) or the screen
const isFullyVisible = (el: Element) => {
  const r = el.getBoundingClientRect();
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const style = getComputedStyle(p);
    if (style.overflowX === "visible" && style.overflowY === "visible") continue;
    const c = p.getBoundingClientRect();
    if (r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1) return false;
  }
  return r.top >= 0 && r.bottom <= window.innerHeight;
};

interface ProjectModalProps {
  activeProject: Project | null;
  onClose: () => void;
  onOpenLightbox: (images: string[], captions: string[], index: number, origin?: LightboxOrigin) => void;
  /** Set when the modal was opened from somewhere other than its own card (an Achievement row) */
  viewInSection?: { label: string; onClick: () => void };
}

const linkPillClass = "inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-xs text-white transition hover:border-white hover:bg-white hover:text-black";

const galleryItems = (gallery: GalleryItem[] = []) =>
  gallery
    .map((item) => {
      if (typeof item === "string") {
        return { src: item, caption: "" };
      }
      const [src, caption] = item;
      return { src, caption: caption ?? "" };
    })
    .filter((item) => item.src && item.src.trim().length > 0);

const renderMultilineText = (text: string | string[]) =>
  Array.isArray(text)
    ? text.map((line: string, index: number) => (
      <span key={index}>
        {line}
        {index < text.length - 1 && <br />}
      </span>
    ))
    : text;

const renderDetailItem = (item: DetailItem, index: number) => {
  if (!item.value) return null;
  const hasContent = item.list && Array.isArray(item.value) 
    ? item.value.some((entry) => entry.trim().length > 0)
    : (Array.isArray(item.value) ? item.value.some((entry) => entry.trim().length > 0) : typeof item.value === "string" && item.value.trim().length > 0);
  
  if (!hasContent) return null;

  return (
    <div key={`${item.label}-${index}`}>
      <p className="text-[11px] sm:text-xs uppercase text-white/60 tracking-wider mb-1">
        {item.label}
      </p>
      {item.list && Array.isArray(item.value) ? (
        // Drawn bullet instead of list-disc: the browser marker sat far left of the text with no way to tighten the gap.
        // The dot is centred on the first line (half of leading-relaxed's 1.625em, minus half the dot)
        <ul className="mt-2 space-y-1 text-[13px] sm:text-sm leading-relaxed text-white/80 max-w-[70ch]">
          {item.value
            .filter((entry) => entry.trim().length > 0)
            .map((entry, entryIndex) => (
              <li key={entryIndex} className="relative pl-4 before:content-[''] before:absolute before:left-1 before:top-[calc(0.8125em-2px)] before:w-1 before:h-1 before:rounded-full before:bg-white/60">{entry}</li>
            ))}
        </ul>
      ) : (
        <p className="text-[13px] sm:text-sm leading-relaxed text-white/80 max-w-[70ch]">
          {renderMultilineText(item.value ?? "")}
        </p>
      )}
    </div>
  );
};

// Details render in their data order (e.g. Problem → My Role → Method → Result), all styled alike. Lines stop at
// 70 characters: across the full desktop modal they ran ~100, too long to read comfortably.
const renderDetails = (details: DetailItem[] = []) => (
  <>{details.map((item, index) => renderDetailItem(item, index))}</>
);

// Whole cards per view, narrowing with the screen: 1 on phones, 2 from 480px (at sm a lone card was ~550px wide), 3 from md. A card is never cut, so with
// 5 photos and 3 per view the pages are 1-3 then 3-5. 16:9 like the project screenshots, so nothing is cropped.
const ModalImage = ({ src, idx, onOpen, caps }: { src: string, idx: number, onOpen: (index: number) => void, caps: string[] }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  // A button, so the photos are reachable with Tab and open with Enter like every other card.
  // Hover brightens (same as the Project card hero) instead of dimming to 70%.
  return (
    <button
      type="button"
      onClick={() => onOpen(idx)}
      aria-label={`Open ${caps[idx] || `documentation ${idx + 1}`} full size`}
      className="group snap-start snap-always flex-none relative aspect-video w-full min-[480px]:w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-1.5rem)/3)] bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 transition-colors duration-300 hover:border-white/30 focus-visible:outline-none focus-visible:border-white/40"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={`Documentation ${idx + 1}`}
        fill
        className={`rounded-2xl object-cover transition-[opacity,filter] duration-500 ease-in-out group-hover:brightness-[1.08] group-focus-visible:brightness-[1.08] ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        // Matches the card width at 1, 2 and 3 per view; 85 keeps small text and borders crisp
        sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, 240px"
        quality={85}
        onLoad={() => setIsLoading(false)}
      />
    </button>
  );
};

export default function ProjectModal({ activeProject, onClose, onOpenLightbox, viewInSection }: ProjectModalProps) {
  const items = React.useMemo(() => activeProject ? galleryItems(activeProject.gallery) : [], [activeProject]);
  // `links` wins; a single legacy `link` becomes one entry with its ctaLabel
  const externalLinks = activeProject?.links?.length
    ? activeProject.links
    : activeProject?.link ? [{ label: activeProject.ctaLabel ?? "Open Project", href: activeProject.link }] : [];
  const srcs = React.useMemo(() => items.map(i => i.src), [items]);
  const caps = React.useMemo(() => items.map(i => i.caption ?? ""), [items]);
  
  const dialogRef = useDialogFocus<HTMLDivElement>(activeProject !== null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isMouse, setIsMouse] = React.useState(false);

  React.useEffect(() => {
    setIsMouse(window.matchMedia('(pointer: fine)').matches);
  }, []);

  // The Lightbox zooms out of a thumbnail and back into one, so it gets the thumbnail's place on screen and its
  // already-loaded file. A thumbnail that hasn't loaded or is cut off by a scroll edge has nothing to zoom from or to,
  // and the Lightbox falls back to a plain fade.
  const thumbAt = (i: number): LightboxThumb | undefined => {
    const img = scrollRef.current?.children[i]?.querySelector("img");
    if (!img || !img.complete || !img.naturalWidth || !isFullyVisible(img)) return;
    const { left, top, width, height } = img.getBoundingClientRect();
    return { src: img.currentSrc || img.src, rect: { left, top, width, height }, aspect: img.naturalWidth / img.naturalHeight };
  };
  // On close the photo shown may not be the one that was clicked: its card is scrolled into view first, instantly
  // (hidden behind the Lightbox), so the photo can land on it. Aligning to an edge keeps it on a snap point.
  const locateThumb = (i: number) => {
    const scroller = scrollRef.current;
    const card = scroller?.children[i];
    if (scroller && card) {
      const s = scroller.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const shift = c.left < s.left ? c.left - s.left : c.right > s.right ? c.right - s.right : 0;
      if (shift) scroller.scrollTo({ left: scroller.scrollLeft + shift, behavior: "instant" });
    }
    return thumbAt(i);
  };
  const openPhoto = (i: number) => {
    const thumb = thumbAt(i);
    onOpenLightbox(srcs, caps, i, thumb && { ...thumb, index: i, locate: locateThumb });
  };

  // The links as plain pills. Desktop: in the fixed header beside the title, the way App Store, GitHub or Behance put
  // the main action next to the name. Phones: first thing in the body, right under the title, so the header stays
  // one slim line and the body keeps its room.
  const linkPills = (className: string) =>
    (externalLinks.length > 0 || viewInSection) && (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {externalLinks.map((item, index) => (
          <Link
            key={`${item.href}-${index}`}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={linkPillClass}
          >
            {/* The logo of the site it opens, then the label: it says where you go, so no arrow */}
            <LinkIcon link={item} />
            {item.label}
          </Link>
        ))}
        {/* In-page jump to the card this modal belongs to. Up arrow: it is only offered from Achievements, and
            every section it can lead to sits above Achievements. Icon first like the link pills beside it. */}
        {viewInSection && (
          <button type="button" onClick={viewInSection.onClick} className={linkPillClass}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
            View in {viewInSection.label}
          </button>
        )}
      </div>
    );

  // Whether the body has more below what is on screen. Checked on open, on scroll and on resize.
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [moreBelow, setMoreBelow] = React.useState(false);
  const updateMoreBelow = React.useCallback(() => {
    const el = bodyRef.current;
    if (el) setMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  }, []);
  React.useLayoutEffect(() => {
    if (!activeProject) return;
    updateMoreBelow();
    window.addEventListener("resize", updateMoreBelow);
    return () => window.removeEventListener("resize", updateMoreBelow);
  }, [activeProject, updateMoreBelow]);

  const page = (direction: 1 | -1) => pageCarousel(scrollRef.current, direction);
  const edges = useScrollEdges(scrollRef, [items]);
  const pages = usePageCount(scrollRef, items.length, [items]);

  return (
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed inset-0 z-40 bg-black/70 p-4 sm:p-6 pb-24 sm:pb-28 flex items-center justify-center backdrop-blur-sm"
          data-dialog-layer
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#111111] text-white shadow-2xl flex flex-col max-h-[85dvh] md:max-h-[80vh] overflow-hidden outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header: the title, and from sm up the links beside it. The header does not scroll, so there they stay in
                reach while the details below are read. */}
            <div className="flex-none flex items-center justify-between gap-6 bg-[#111111] px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 z-10">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                {activeProject.logo && (
                  <div className="relative w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0">
                    <Image src={activeProject.logo} alt={activeProject.title} fill className="object-contain" />
                  </div>
                )}
                <h3 id="project-modal-title" className="text-base sm:text-lg font-semibold leading-6 sm:leading-7">{activeProject.title}</h3>
              </div>
              {linkPills("hidden sm:flex sm:justify-end sm:shrink-0")}
            </div>

            {/* A soft fade at the bottom while there is more to scroll, gone once the end is reached, so a long read
                never looks finished halfway */}
            <div className="relative flex-1 min-h-0 flex flex-col">
            <div ref={bodyRef} onScroll={updateMoreBelow} className="flex-1 overflow-y-auto overscroll-y-contain px-5 py-6 sm:px-6 sm:py-6 space-y-6 scrollbar-default" style={{ WebkitOverflowScrolling: 'touch' }}>
              {linkPills("sm:hidden")}

              {(activeProject.period || (activeProject.roleLabel && activeProject.role)) && (
                // Phones: side by side in equal halves when both fit on one line in half the width, stacked full width
                // when either is longer (a long period, many tools). Each item is at least half wide and starts at its
                // own one-line width, so a long one overflows the row and wraps. sm+: always two columns.
                <div className="flex flex-wrap gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
                  {activeProject.period && (
                    <div className="grow basis-auto min-w-[calc(50%-0.375rem)] sm:min-w-0">
                      <p className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wider mb-0.5">Period</p>
                      <p className="text-[13px] sm:text-sm text-white break-words">{activeProject.period}</p>
                    </div>
                  )}
                  {activeProject.roleLabel && activeProject.role && (
                    <div className="grow basis-auto min-w-[calc(50%-0.375rem)] sm:min-w-0">
                      <p className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wider mb-0.5">{activeProject.roleLabel}</p>
                      <p className="text-[13px] sm:text-sm text-white break-words">{activeProject.role}</p>
                    </div>
                  )}
                </div>
              )}

              {items.length > 0 && (
                <div>
                  <div className="flex flex-row items-center justify-between mb-2">
                    <p className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wider">Documentation</p>
                    {isMouse && pages > 1 && (
                      <div className="flex items-center gap-2 pr-1">
                        <button onClick={() => page(-1)} disabled={edges.atStart} aria-label="Scroll documentation left" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-default">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => page(1)} disabled={edges.atEnd} aria-label="Scroll documentation right" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-default">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    ref={scrollRef}
                    className="mt-3 flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory overscroll-x-contain scrollbar-hide"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {items.map((item, idx: number) => {
                      return (
                        <ModalImage
                          key={item.src + idx}
                          src={item.src}
                          idx={idx}
                          caps={caps}
                          onOpen={openPhoto}
                        />
                      );
                    })}
                  </div>
                  {/* One dot per page (1, 2 or 3 photos depending on width), not per photo */}
                  <ScrollDots scrollRef={scrollRef} count={pages} itemLabel="photo page" showNav={!isMouse} />
                </div>
              )}

              {renderDetails(activeProject.details)}
            </div>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#111111] to-transparent transition-opacity duration-200 ${moreBelow ? "opacity-100" : "opacity-0"}`}
            />
            </div>
          </motion.div>

          {/* Close Button Fixed outside the box. 29px puts its centre 53px up, the same spot as the Lightbox's close
              (its 58px control bar sits at bottom-6), so opening a photo over the modal leaves the X where it was. */}
          <div className="absolute bottom-[29px] inset-x-0 flex justify-center z-50 px-4 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              aria-label="Close Modal"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-white/10 text-white transition shadow-xl pointer-events-auto"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
