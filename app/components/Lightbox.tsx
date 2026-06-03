import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  captions: string[];
  index: number;
  onClose: () => void;
  setIndex: (index: number) => void;
}

export default function Lightbox({ isOpen, images, captions, index, onClose, setIndex }: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleLightboxKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((index + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((index - 1 + images.length) % images.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleLightboxKey);
    return () => window.removeEventListener("keydown", handleLightboxKey);
  }, [isOpen, index, images.length, onClose, setIndex]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((index + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2 z-10"
            onClick={onClose}
            aria-label="Close Lightbox"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></svg>
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[90vw] 2xl:max-w-[1400px] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full flex-col items-center relative h-[85vh]">
              <Image
                src={images[index]}
                alt={captions[index] || "Preview image"}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 1024px) 100vw, 1024px"
                unoptimized
              />
              {captions[index] && (
                <p className="absolute -bottom-10 text-sm text-white/70 bg-black/50 px-3 py-1 rounded-full">
                  {captions[index]}
                </p>
              )}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-r-lg sm:rounded-full transition"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-l-lg sm:rounded-full transition"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
