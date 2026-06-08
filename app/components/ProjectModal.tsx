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

const renderDetails = (details: DetailItem[] = []) =>
  details
    .filter((item) => {
      if (item.list && Array.isArray(item.value)) {
        return item.value.some((entry) => entry.trim().length > 0);
      }
      if (Array.isArray(item.value)) {
        return item.value.some((entry) => entry.trim().length > 0);
      }
      return typeof item.value === "string" && item.value.trim().length > 0;
    })
    .map((item, index) => (
      <div key={`${item.label}-${index}`}>
        <p className="text-sm text-white/60">{item.label}</p>
        {item.list && Array.isArray(item.value) ? (
          <ul className="mt-2 space-y-1 text-base text-white/80 list-disc list-outside ml-5">
            {item.value
              .filter((entry) => entry.trim().length > 0)
              .map((entry, entryIndex) => (
                <li key={entryIndex}>{entry}</li>
              ))}
          </ul>
        ) : (
          <p className="text-base text-white/80">{renderMultilineText(item.value ?? "")}</p>
        )}
      </div>
    ));

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
          className="fixed inset-0 z-40 bg-black/70 px-4 py-6 flex items-center justify-center backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#111111] text-white shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[85vh] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex-none flex items-center justify-between bg-[#111111] px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 z-10">
              <div className="flex items-center gap-3">
                {activeProject.logo && (
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image src={activeProject.logo} alt={activeProject.title} fill className="object-contain" />
                  </div>
                )}
                <h3 className="text-sm md:text-base font-semibold pr-4">{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="flex-shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 transition hover:border-white/60 hover:text-white"
                onClick={onClose}
                aria-label="Close Project Modal"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-6 space-y-6">
              {(activeProject.period || (activeProject.roleLabel && activeProject.role)) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeProject.period && (
                    <div>
                      <p className="text-sm text-white/60">Period</p>
                      <p className="text-base text-white">{activeProject.period}</p>
                    </div>
                  )}
                  {activeProject.roleLabel && activeProject.role && (
                    <div>
                      <p className="text-sm text-white/60">{activeProject.roleLabel}</p>
                      <p className="text-base text-white">{activeProject.role}</p>
                    </div>
                  )}
                </div>
              )}

              {renderDetails(activeProject.details)}

              {items.length > 0 && (
                <div>
                  <p className="text-sm text-white/60">Documentation</p>
                  <div
                    className="mt-3 flex overflow-x-auto gap-3 pb-4 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40"
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
                  <p className="mb-2 text-sm text-white/60">Link</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.links.map((item: { label: string; href: string }, index: number) => (
                      <Link
                        key={`${item.href}-${index}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white hover:bg-white hover:text-black"
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
                  <p className="mb-2 text-sm text-white/60">Link</p>
                  <Link
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white hover:bg-white hover:text-black"
                  >
                    {activeProject.ctaLabel ?? "Open Project"}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
