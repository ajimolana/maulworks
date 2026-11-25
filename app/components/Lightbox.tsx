import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useDialogFocus } from "./useDialogFocus";

type Rect = { left: number; top: number; width: number; height: number };

/** A thumbnail on screen that the photo zooms out of or back into */
export interface LightboxThumb {
  /** The thumbnail file already on screen, so the zoom starts without waiting for anything to load */
  src: string;
  rect: Rect;
  /** The photo's own width / height, to land exactly where the full-size photo will be */
  aspect: number;
}

/** The clicked thumbnail, plus a way to find the thumbnail of whichever photo is on screen when the Lightbox closes */
export interface LightboxOrigin extends LightboxThumb {
  index: number;
  locate: (index: number) => LightboxThumb | undefined;
}

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  captions: string[];
  index: number;
  origin?: LightboxOrigin;
  onClose: () => void;
  setIndex: (index: number) => void;
}

// The photo inside the image box, as object-contain lays it out
const containedRect = (box: Rect, aspect: number): Rect => {
  const width = box.width / box.height > aspect ? box.height * aspect : box.width;
  const height = width / aspect;
  return { left: box.left + (box.width - width) / 2, top: box.top + (box.height - height) / 2, width, height };
};

const zoomEase = [0.22, 1, 0.36, 1] as const;

// The Lightbox is where people inspect a shot: WebP at 85 looks like the original but is 5-20x lighter than the raw
// PNGs (the site serves WebP only, see next.config). sizes matches the on-screen width, so a 1x laptop gets ~1200px and
// retina screens and phones get the full 1920px. Every slide uses the same props, so the neighbours waiting beside the
// screen load exactly the URL they will show once they slide in.
const imageProps = { fill: true, quality: 85, sizes: "(max-width: 1280px) 90vw, 1200px" } as const;
const imageBoxClass = "absolute w-[90vw] max-w-[1200px] h-[70vh]";

const wrap = (n: number, length: number) => ((n % length) + length) % length;

export default function Lightbox({ isOpen, images, captions, index, origin, onClose, setIndex }: LightboxProps) {
  // Photos that have finished loading. A slide shows its photo only once loaded, fading it in, never half-drawn.
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const markLoaded = useCallback((src: string) => setLoaded((prev) => (prev.has(src) ? prev : new Set(prev).add(src))), []);
  const waiting = !loaded.has(images[index]);
  // Spinner only when a load is actually slow, not on every switch
  const [slow, setSlow] = useState(false);

  // Opening from a thumbnail: the thumbnail grows from its card to where the full photo will sit, then the full
  // photo fades in on top of it. Until it has landed the full photo is held back, so it never appears mid-flight.
  const reduceMotion = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLImageElement>(null);
  type Flight = { index: number; src: string; from: Rect; to: Rect; landed: boolean };
  const [flight, setFlight] = useState<Flight | null>(null);
  // Closing: the photo on screen shrinks back into its thumbnail. Drawn outside the fading overlay, so it stays solid.
  const [returning, setReturning] = useState<Omit<Flight, "index" | "landed"> | null>(null);
  const flying = flight !== null && !flight.landed;
  const zooming = isOpen && !!origin && !reduceMotion;
  const wasOpen = useRef(false);
  // Like the modals: focus moves in on open, Tab cycles inside the viewer, and focus returns to the thumbnail on close
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen);

  // The photo currently in the middle of the strip
  const currentImg = () => containerRef.current?.querySelector<HTMLImageElement>('[data-slot="0"] img');

  useLayoutEffect(() => {
    if (isOpen) setReturning(null);
    if (!isOpen || !origin || reduceMotion || !boxRef.current) return setFlight(null);
    const box = boxRef.current.getBoundingClientRect();
    setFlight({ index: origin.index, src: origin.src, from: origin.rect, to: containedRect(box, origin.aspect), landed: false });
  }, [isOpen, origin, reduceMotion]);

  // On close the overlay is still in the page while it fades out, so the photo's spot can be measured. The photo
  // there is hidden at once and a copy of it flies back to the thumbnail of whichever photo is open now.
  useLayoutEffect(() => {
    const closed = wasOpen.current && !isOpen;
    wasOpen.current = isOpen;
    if (!closed || !origin || reduceMotion || !boxRef.current) return;

    // What is on screen: the full photo, or the zoomed-in thumbnail still standing in while it loads
    let src: string | undefined;
    let aspect: number | undefined;
    const img = currentImg();
    if (!waiting && !flying && img?.naturalWidth) {
      src = img.currentSrc || img.src;
      aspect = img.naturalWidth / img.naturalHeight;
    } else if (flight?.landed && flight.index === index) {
      src = flight.src;
      aspect = flight.to.width / flight.to.height;
    }
    if (!src || !aspect) return;

    const thumb = origin.locate(index);
    if (!thumb) return;
    const from = containedRect(boxRef.current.getBoundingClientRect(), aspect);
    if (containerRef.current) containerRef.current.style.visibility = "hidden";
    if (flightRef.current) flightRef.current.style.visibility = "hidden";
    setReturning({ src, from, to: thumb.rect });
  }, [isOpen, origin, reduceMotion, index, waiting, flying, flight]);

  // The real thumbnail stays in its card the whole time: the backdrop is see-through, so hiding it would leave a
  // visible hole that pops back when the copy lands. The copy lifts off it and settles back onto it instead.

  // Once the full photo has faded in over the thumbnail, the thumbnail goes. Moving to another photo drops it at once.
  useEffect(() => {
    if (!flight) return;
    if (index !== flight.index) return setFlight(null);
    if (!flight.landed || waiting) return;
    const timer = setTimeout(() => setFlight(null), 250);
    return () => clearTimeout(timer);
  }, [flight, index, waiting]);

  useEffect(() => {
    setSlow(false);
    if (!waiting) return;
    const timer = setTimeout(() => setSlow(true), 200);
    return () => clearTimeout(timer);
  }, [waiting, index]);

  // The photos sit side by side on a strip, one screen width apart: the previous one off the left edge, the next one
  // off the right. Swiping drags the strip under the finger; changing photo slides it one screen over, and once there
  // the strip is moved back under the new photo in the same frame, so nothing visibly jumps. `position` counts slides
  // without wrapping and keys each slide, so the photo that slid in keeps its element (and its loaded image).
  const trackX = useMotionValue(0);
  const [position, setPosition] = useState(0);
  const sliding = useRef(false);
  const count = images.length;
  // The photo a slide is on its way to. The caption and counter follow it at once instead of waiting for the landing.
  const [target, setTarget] = useState<number | null>(null);
  const heading = target ?? index;

  useLayoutEffect(() => {
    trackX.set(0);
    setTarget(null);
  }, [index, trackX]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (count <= 1 || sliding.current) return;
      sliding.current = true;
      setTarget(wrap(index + dir, count));
      animate(trackX, -dir * window.innerWidth, {
        duration: reduceMotion ? 0 : 0.32,
        ease: zoomEase,
        onComplete: () => {
          setPosition((p) => p + dir);
          setIndex(wrap(index + dir, count));
          sliding.current = false;
        },
      });
    },
    [count, index, reduceMotion, setIndex, trackX]
  );

  // Swipe: the strip follows the finger once the movement is clearly sideways. Let go past a fifth of the screen, or
  // with a quick flick, and it carries on to the next photo; otherwise it springs back.
  const touch = useRef<{ x: number; y: number; t: number; dx: number; axis: "x" | "y" | null } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (sliding.current) return;
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, t: performance.now(), dx: 0, axis: null };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const s = touch.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (s.axis !== "x") return;
    s.dx = dx;
    // A single photo has nowhere to go, so it only gives a little
    trackX.set(count > 1 ? dx : dx * 0.25);
  };

  const handleTouchEnd = () => {
    const s = touch.current;
    touch.current = null;
    if (!s || s.axis !== "x") return;
    const velocity = s.dx / Math.max(1, performance.now() - s.t);
    const far = Math.abs(s.dx) > window.innerWidth * 0.2;
    const flick = Math.abs(velocity) > 0.4 && Math.abs(s.dx) > 30;
    if (count > 1 && (far || flick)) go(s.dx < 0 ? 1 : -1);
    else animate(trackX, 0, { type: "spring", stiffness: 400, damping: 40 });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleLightboxKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("keydown", handleLightboxKey);
    return () => window.removeEventListener("keydown", handleLightboxKey);
  }, [isOpen, go]);

  // The photo area is a fixed 90vw x 70vh box, much bigger than a landscape photo inside it on a phone. Only a tap
  // on the photo itself keeps the Lightbox open; a tap on the empty part of the box closes it like the backdrop.
  const handleStageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const box = boxRef.current?.getBoundingClientRect();
    const img = currentImg();
    const photo = box && !waiting && img?.naturalWidth ? containedRect(box, img.naturalWidth / img.naturalHeight) : flight?.landed ? flight.to : null;
    if (photo && e.clientX >= photo.left && e.clientX <= photo.left + photo.width && e.clientY >= photo.top && e.clientY <= photo.top + photo.height) return;
    onClose();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    go(1);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    go(-1);
  };

  // With two photos the previous and the next are the same one, shown on both sides
  const offsets = count > 1 ? [-1, 0, 1] : [0];

  return (
    <>
    {returning && (
      // eslint-disable-next-line @next/next/no-img-element
      <motion.img
        src={returning.src}
        alt=""
        aria-hidden="true"
        initial={{ ...returning.from, borderRadius: 0 }}
        animate={{ ...returning.to, borderRadius: 16 }}
        transition={{ duration: 0.4, ease: zoomEase }}
        onAnimationComplete={() => setReturning(null)}
        className="fixed z-[101] object-cover pointer-events-none select-none"
      />
    )}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          tabIndex={-1}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-28 overflow-hidden outline-none"
          onClick={onClose}
        >
          {/* Backdrop fades on its own, so the zooming thumbnail stays fully visible while it darkens */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: zooming ? 0.35 : 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
          />

          {/* The thumbnail growing into place. Not inside the image container: that one scales, and a fixed element
              inside a transformed parent is positioned against the parent rather than the screen. */}
          {flight && (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              ref={flightRef}
              src={flight.src}
              alt=""
              aria-hidden="true"
              initial={{ ...flight.from, borderRadius: 16 }}
              animate={{ ...flight.to, borderRadius: 0 }}
              transition={{ duration: 0.4, ease: zoomEase }}
              onAnimationComplete={() => setFlight((f) => (f ? { ...f, landed: true } : f))}
              className="fixed object-cover pointer-events-none select-none"
            />
          )}

          {/* Image Container. When zooming it starts at full size, so the landing spot measured on open is exact. */}
          <motion.div
            ref={containerRef}
            initial={zooming ? false : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex items-center justify-center max-w-[90vw] xl:max-w-[1200px] w-full h-full touch-pan-y"
            onClick={handleStageClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              {/* Where the photo will sit, measured on open as the landing spot of the zoom */}
              <div ref={boxRef} className={`${imageBoxClass} invisible pointer-events-none`} aria-hidden="true" />

              {/* The strip: previous, current and next photo, one screen width apart */}
              <motion.div style={{ x: trackX }} className="absolute inset-0">
                {offsets.map((offset) => {
                  const i = wrap(index + offset, count);
                  const src = images[i];
                  const visible = loaded.has(src) && !(offset === 0 && flying);
                  return (
                    <div
                      key={position + offset}
                      data-slot={offset}
                      aria-hidden={offset !== 0}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transform: `translateX(${offset * 100}vw)` }}
                    >
                      {/* The box sets the size and the photo is contained in it: with a responsive srcset the image's
                          own intrinsic size shrinks on retina screens, so w-auto/h-auto rendered it at half size */}
                      <div className={imageBoxClass}>
                        <Image
                          src={src}
                          alt={offset === 0 ? captions[i] || "Preview image" : ""}
                          {...imageProps}
                          {...(offset === 0 ? { priority: true } : { loading: "eager" as const })}
                          onLoad={() => markLoaded(src)}
                          draggable={false}
                          // Fades in, but hides instantly: on open the photo is held back for the zoom one render
                          // after mounting, and a fade-out there let an already-loaded photo flash in ahead of the zoom
                          className={`object-contain select-none ${visible ? "opacity-100 transition-opacity duration-200 ease-out" : "opacity-0"}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Loading spinner, centred on the photo area. It used to be position: fixed, which inside the scaling
                  container sat against the container until the spring settled and then jumped down to the screen
                  centre. Absolute keeps it on the same spot the whole time. */}
              <AnimatePresence>
                {waiting && slow && !flying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-3 z-[110] px-4"
          >
            {/* Caption */}
            {/* Follows the photo the strip is heading to, so it changes as the slide starts, not after it lands */}
            <AnimatePresence mode="wait">
              {captions[heading] && (
                <motion.p
                  key={heading}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="text-xs text-white/60 text-center max-w-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 pointer-events-none"
                >
                  {captions[heading]}
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
                <span className="text-xs text-white/60 tabular-nums px-1 min-w-[2.5rem] text-center">
                  {heading + 1} / {images.length}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
