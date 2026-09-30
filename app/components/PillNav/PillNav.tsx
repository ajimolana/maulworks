"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export interface PillNavItem {
  id: string;
  label: string;
  href: string;
}

interface PillNavProps {
  items: PillNavItem[];
  forceClose?: boolean;
  titleOverride?: string;
  homeHref?: string;
  activeItemOverride?: string;
  disableScrollSpy?: boolean;
}

export default function PillNav({ items, forceClose, titleOverride, homeHref, activeItemOverride, disableScrollSpy }: PillNavProps) {
  const [activeItem, setActiveItem] = useState<string | null>(activeItemOverride || "profile");
  const [isScrolled, setIsScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 50 : false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillReady, setPillReady] = useState(false);
  const [memojiHovered, setMemojiHovered] = useState(false);
  const [memojiClicked, setMemojiClicked] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setPillReady(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (disableScrollSpy) return;
      if (isClickingRef.current) return;

      const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;

      if (isAtBottom && items.length > 0) {
        let found = false;
        for (let i = items.length - 1; i >= 0; i--) {
          if (document.getElementById(items[i].id)) {
            setActiveItem(items[i].id);
            found = true;
            break;
          }
        }
        if (!found) {
          setActiveItem(items[items.length - 1].id);
        }
      } else {
        let currentSection: string | null = null;
        const triggerPoint = window.innerHeight * 0.5;
        for (const item of items) {
          const section = document.getElementById(item.id);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= triggerPoint) {
              currentSection = item.id;
            }
          }
        }
        setActiveItem(currentSection || "profile");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setDragOffset(0);
      dragStartY.current = null;
    }
  }, [mobileMenuOpen]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    sheetRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.clientY - dragStartY.current;
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handlePointerUp = () => {
    if (dragOffset > 80) {
      setMobileMenuOpen(false);
    } else {
      setDragOffset(0);
    }
    dragStartY.current = null;
  };

  return (
    <>
      <div
        className={`fixed top-0 inset-x-0 z-[100] flex justify-center px-2 lg:px-6 pointer-events-none transition-opacity duration-150 ${forceClose ? "opacity-0" : "opacity-100"}`}
      >
        <div
          className={`${forceClose ? "pointer-events-none" : "pointer-events-auto"} flex items-center justify-between overflow-hidden mt-2 lg:mt-4 py-2 border transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
            ? "bg-[#111111]/80 backdrop-blur-md rounded-full border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-4 lg:px-6 w-full lg:max-w-[1366px]"
            : "bg-transparent rounded-none border-transparent px-4 lg:px-6 w-full lg:max-w-[1680px]"
            }`}
        >
          {/* LOGO / TITLE */}
          <div className="flex-shrink-0 flex items-center gap-2 font-semibold tracking-tight transition-colors text-white text-lg">
            <button
              onClick={() => { setMemojiClicked(true); }}
              onMouseEnter={() => {
                if (typeof window !== "undefined" && window.innerWidth >= 768) {
                  setMemojiHovered(true);
                }
              }}
              onMouseLeave={() => {
                setMemojiHovered(false);
                setMemojiClicked(false);
              }}
              className="outline-none focus:outline-none relative"
              aria-label="Logo"
            >
              <Image
                src="/assets/icon/memoji.png"
                alt="Logo"
                width={128}
                height={128}
                quality={100}
                className={`w-auto h-8 object-contain transition-transform duration-300 cursor-pointer ${memojiHovered ? "scale-125" : "scale-100"} ${memojiHovered && !memojiClicked ? "-rotate-6" : "rotate-0"}`}
              />
            </button>
            <Link
              href={homeHref || "#profile"}
              onClick={() => handleItemClick("profile")}
              className={`relative px-4 py-2 flex items-center transition-colors rounded-full ${activeItem === "profile" ? "text-white xl:text-black" : "hover:text-white/80"}`}
            >
              {activeItem === "profile" && (
                pillReady ? (
                  <motion.div
                    layoutId="pillNavActiveBackground"
                    className="absolute inset-0 bg-white rounded-full hidden xl:block"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white rounded-full hidden xl:block" />
                )
              )}
              <span className="relative z-10 flex items-center">
                {titleOverride || "Maulana's Portfolio"}
              </span>
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden xl:flex items-center gap-1 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            {items.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative px-4 py-2 text-[14px] font-medium transition-colors rounded-full whitespace-nowrap ${isActive ? "text-black" : "text-white/70 hover:text-white"}`}
                >
                  {isActive && (
                    pillReady ? (
                      <motion.div
                        layoutId="pillNavActiveBackground"
                        className="absolute inset-0 bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white rounded-full" />
                    )
                  )}
                  <span className="relative z-10 tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* MOBILE BURGER */}
          <div className="xl:hidden flex items-center transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <button
              className="text-white p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <div className="relative w-5 h-4">
                <span className={`block absolute h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`block absolute h-0.5 w-full bg-white transition-all duration-300 ease-in-out top-1.5 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`block absolute h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET MENU */}
      <AnimatePresence>
        {mobileMenuOpen && !forceClose && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              key="bottom-sheet"
              ref={sheetRef}
              initial={{ y: "100%" }}
              animate={{ y: dragOffset > 0 ? dragOffset : 0 }}
              exit={{ y: "100%" }}
              transition={
                dragOffset > 0
                  ? { type: "tween", duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 40 }
              }
              style={{ touchAction: "none" }}
              className="fixed bottom-0 inset-x-0 z-[99] xl:hidden bg-[#111111] border-t border-white/10 rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1 select-none">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Section label */}
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mt-1 mb-4 select-none">
                Navigate
              </p>

              {/* Nav Links */}
              <nav className="flex flex-col px-6 gap-1 pb-10">
                {items.map((item, i) => {
                  const isActive = activeItem === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          handleItemClick(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? "bg-white/10 border border-white/15"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                            isActive
                              ? "bg-[var(--theme-accent)] shadow-[0_0_6px_var(--theme-accent)] scale-110"
                              : "bg-white/20"
                          }`}
                        />
                        <span
                          className={`text-[17px] font-semibold tracking-wide transition-colors ${
                            isActive ? "text-white" : "text-white/50"
                          }`}
                        >
                          {item.label}
                        </span>

                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
