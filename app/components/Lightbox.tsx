import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  captions: string[];
  index: number;
  onClose: () => void;
  setIndex: (index: number) => void;
}

export default function Lightbox({ isOpen, images, captions, index, onClose, setIndex }: LightboxProps) {
  const [isDesktop, setIsDesktop] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 1366 : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1366);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            className="absolute top-6 right-4 sm:top-8 sm:right-8 text-white p-3 z-[110] bg-black/60 hover:bg-black/90 rounded-full backdrop-blur-sm transition-all shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close Lightbox"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></svg>
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex items-center justify-center max-w-[90vw] xl:max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center relative">
              <img
                src={isDesktop ? images[index] : `/_next/image?url=${encodeURIComponent(images[index])}&w=1080&q=75`}
                alt={captions[index] || "Preview image"}
                className="max-h-[85vh] max-w-[90vw] xl:max-w-[1200px] object-contain rounded-lg"
              />
              {captions[index] && (
                <p className="absolute -bottom-10 text-sm text-white/70 bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
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
