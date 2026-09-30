import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project, DetailItem, GalleryItem } from "../data/portfolio";

interface ProjectModalProps {
  activeProject: Project | null;
  onClose: () => void;
  onOpenLightbox: (images: string[], captions: string[], index: number) => void;
}

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

const renderDetailItem = (item: DetailItem, index: number, isHighlight = false) => {
  if (!item.value) return null;
  const hasContent = item.list && Array.isArray(item.value) 
    ? item.value.some((entry) => entry.trim().length > 0)
    : (Array.isArray(item.value) ? item.value.some((entry) => entry.trim().length > 0) : typeof item.value === "string" && item.value.trim().length > 0);
  
  if (!hasContent) return null;

  return (
    <div key={`${item.label}-${index}`} className={isHighlight ? "bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 rounded-2xl p-5" : ""}>
      <p className={`text-[10px] sm:text-xs uppercase ${isHighlight ? "text-[var(--theme-accent)] font-semibold tracking-widest mb-1.5" : "text-white/60 tracking-wider mb-1"}`}>
        {item.label}
      </p>
      {item.list && Array.isArray(item.value) ? (
        <ul className={`mt-2 space-y-1 ${isHighlight ? "text-sm sm:text-base text-white font-medium" : "text-xs sm:text-sm text-white/80"} list-disc list-outside ml-4`}>
          {item.value
            .filter((entry) => entry.trim().length > 0)
            .map((entry, entryIndex) => (
              <li key={entryIndex}>{entry}</li>
            ))}
        </ul>
      ) : (
        <p className={`${isHighlight ? "text-sm sm:text-base text-white font-medium leading-relaxed" : "text-xs sm:text-sm text-white/80"}`}>
          {renderMultilineText(item.value ?? "")}
        </p>
      )}
    </div>
  );
};

const renderDetails = (details: DetailItem[] = []) => {
  const highlightLabels = ['result', 'impact', 'metrics', 'hasil'];
  const highlightItems = details.filter(d => highlightLabels.includes(d.label.toLowerCase()));
  const standardItems = details.filter(d => !highlightLabels.includes(d.label.toLowerCase()));

  return (
    <>
      {highlightItems.map((item, index) => renderDetailItem(item, index, true))}
      {standardItems.map((item, index) => renderDetailItem(item, index, false))}
    </>
  );
};

const ModalImage = ({ src, idx, onOpenLightbox, srcs, caps }: { src: string, idx: number, onOpenLightbox: any, srcs: string[], caps: string[] }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  return (
    <div className="flex-none relative h-40 w-64 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={`Documentation ${idx + 1}`}
        fill
        className={`rounded-2xl object-cover cursor-pointer hover:opacity-70 transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onClick={() => onOpenLightbox(srcs, caps, idx)}
        sizes="(max-width: 768px) 256px, 256px"
        quality={50}
        priority={true}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default function ProjectModal({ activeProject, onClose, onOpenLightbox }: ProjectModalProps) {
  const items = React.useMemo(() => activeProject ? galleryItems(activeProject.gallery) : [], [activeProject]);
  const srcs = React.useMemo(() => items.map(i => i.src), [items]);
  const caps = React.useMemo(() => items.map(i => i.caption ?? ""), [items]);

  return (
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed inset-0 z-40 bg-black/70 p-4 sm:p-6 pb-24 sm:pb-28 flex items-center justify-center backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#111111] text-white shadow-2xl flex flex-col max-h-[85dvh] md:max-h-[80vh] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex-none flex items-center bg-[#111111] px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 z-10">
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                {activeProject.logo && (
                  <div className="relative w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0">
                    <Image src={activeProject.logo} alt={activeProject.title} fill className="object-contain" />
                  </div>
                )}
                <h3 className="text-sm sm:text-lg font-semibold pr-4 leading-5 sm:leading-7">{activeProject.title}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-y-contain px-5 py-6 sm:px-6 sm:py-6 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              {(activeProject.period || (activeProject.roleLabel && activeProject.role)) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeProject.period && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-0.5">Period</p>
                      <p className="text-xs sm:text-sm text-white">{activeProject.period}</p>
                    </div>
                  )}
                  {activeProject.roleLabel && activeProject.role && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-0.5">{activeProject.roleLabel}</p>
                      <p className="text-xs sm:text-sm text-white">{activeProject.role}</p>
                    </div>
                  )}
                </div>
              )}

              {renderDetails(activeProject.details)}

              {items.length > 0 && (
                <div>
                  <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-2">Documentation</p>
                  <div
                    className="mt-3 flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory overscroll-x-contain scrollbar-hide md:scrollbar-default"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {items.map((item, idx: number) => {
                      return (
                        <ModalImage 
                          key={item.src + idx}
                          src={item.src}
                          idx={idx}
                          srcs={srcs}
                          caps={caps}
                          onOpenLightbox={onOpenLightbox}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {Array.isArray(activeProject.links) && activeProject.links.length > 0 && (
                <div>
                  <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-2">Link</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.links.map((item: { label: string; href: string }, index: number) => (
                      <Link
                        key={`${item.href}-${index}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-xs text-white transition hover:border-white hover:bg-white hover:text-black"
                      >
                        {item.label}
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!activeProject.links && activeProject.link && (
                <div>
                  <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-2">Link</p>
                  <Link
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-xs text-white transition hover:border-white hover:bg-white hover:text-black"
                  >
                    {activeProject.ctaLabel ?? "Open Project"}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Close Button Fixed outside the box */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center z-50 px-4 pointer-events-none">
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
