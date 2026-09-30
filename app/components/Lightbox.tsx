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

  // Touch swipe states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setIndex((index + 1) % images.length);
    } else if (isRightSwipe) {
      setIndex((index - 1 + images.length) % images.length);
    }
  };

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
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 pb-28"
          onClick={onClose}
        >
          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex items-center justify-center max-w-[90vw] xl:max-w-[1200px] w-full h-full"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
                className={`max-h-[70vh] max-w-[90vw] xl:max-w-[1200px] object-contain w-auto h-auto rounded-lg transition-opacity duration-500 ease-in-out ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-3 z-[110] px-4">
            {/* Caption */}
            <AnimatePresence mode="wait">
              {captions[index] && (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-white/60 text-center max-w-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 pointer-events-none"
                >
                  {captions[index]}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div
              className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev */}
              <button
                onClick={prevImage}
                aria-label="Previous image"
                disabled={images.length <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition disabled:opacity-20 disabled:pointer-events-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Counter */}
              {images.length > 1 && (
                <span className="text-xs text-white/40 tabular-nums px-1 min-w-[2.5rem] text-center">
                  {index + 1} / {images.length}
                </span>
              )}

              {/* Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close Lightbox"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={nextImage}
                aria-label="Next image"
                disabled={images.length <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition disabled:opacity-20 disabled:pointer-events-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
