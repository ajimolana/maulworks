import React, { useEffect, useState } from "react";
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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1366 : true
  );

  // Track image loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1366);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset loading state when the image index changes or lightbox opens
  useEffect(() => {
    setIsLoading(true);
  }, [index, isOpen]);

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
          {/* Close Button */}
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

          {/* Navigation Buttons (Fixed to screen edges) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition z-[110]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition z-[110]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}

          {/* Caption (Fixed to bottom of screen) */}
          {captions[index] && (
            <div className="absolute bottom-8 sm:bottom-10 inset-x-0 flex justify-center z-[110] pointer-events-none">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-white/70 bg-black/50 px-3 py-1 rounded-full whitespace-nowrap pointer-events-auto"
              >
                {captions[index]}
              </motion.p>
            </div>
          )}

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex items-center justify-center max-w-[90vw] xl:max-w-[1200px] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              {/* Loading Spinner */}
              {isLoading && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110]">
                  <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
                </div>
              )}

              <Image
                src={images[index]}
                alt={captions[index] || "Preview image"}
                width={1200}
                height={800}
                quality={85}
                priority={true}
                unoptimized={false}
                onLoad={() => setIsLoading(false)}
                className={`max-h-[80vh] max-w-[90vw] xl:max-w-[1200px] object-contain w-auto h-auto rounded-lg transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
