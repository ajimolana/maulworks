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
  togglePerformanceMode?: () => void;
  isGyroEnabled?: boolean;
  toggleGyro?: () => void;
  isLowPerformanceMode?: boolean;
}

export default function PillNav({ items, forceClose, togglePerformanceMode, isGyroEnabled, toggleGyro, isLowPerformanceMode }: PillNavProps) {
  const [activeItem, setActiveItem] = useState<string | null>("profile");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Toggle scrolled state
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isClickingRef.current) return;

      // Check if user is at the bottom of the page
      const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;

      if (isAtBottom && items.length > 0) {
        setActiveItem(items[items.length - 1].id);
      } else {
        // Update active item based on scroll position
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
        // If we haven't scrolled down to the first section yet, set active to profile
        setActiveItem(currentSection || "profile");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  // Lock body scroll when mobile menu is open
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

  return (
    <>
      <div
        className={`fixed top-0 inset-x-0 z-[100] flex justify-center px-2 lg:px-6 pointer-events-none transition-opacity duration-300 ${forceClose ? "opacity-0" : "opacity-100"
          }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0, duration: 1.2 }}
          className={`pointer-events-auto flex items-center justify-between overflow-hidden mt-2 lg:mt-4 py-2 border ${isScrolled
            ? "bg-[#111111]/80 backdrop-blur-md rounded-full border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-4 lg:px-6 w-full lg:max-w-[1366px]"
            : "bg-transparent rounded-none border-transparent px-4 lg:px-6 w-full lg:max-w-[1680px]"
            }`}
        >
          {/* LOGO / TITLE */}
          <motion.div
            layout
            transition={{ type: "spring", bounce: 0, duration: 1.2 }}
            className="flex-shrink-0 flex items-center gap-2 font-semibold tracking-tight transition-colors text-white text-lg"
          >
            <button
              onClick={togglePerformanceMode}
              className="outline-none focus:outline-none relative"
              aria-label="Toggle Performance Mode"
            >
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32}
                height={32}
                unoptimized
                className={`w-auto h-8 object-contain transition-transform duration-300 cursor-pointer ${isLowPerformanceMode ? '-rotate-6' : 'hover:-rotate-6'}`}
              />
              <AnimatePresence>
                {isLowPerformanceMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -bottom-1 -right-2 flex items-center justify-center pointer-events-none"
                    title="Low Performance Mode Active"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#101010] stroke-[#C6F10E] stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <Link
              href="#profile"
              onClick={() => handleItemClick("profile")}
              className={`relative px-4 py-2 flex items-center transition-colors rounded-full ${activeItem === "profile" ? "text-white lg:text-black" : "hover:text-white/80"}`}
            >
              {activeItem === "profile" && (
                <motion.div
                  layoutId="pillNavActiveBackground"
                  className="absolute inset-0 bg-white rounded-full hidden lg:block"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                Maulana&apos;s Portfolio
              </span>
            </Link>
          </motion.div>

          {/* DESKTOP LINKS */}
          <motion.div layout transition={{ type: "spring", bounce: 0, duration: 1.2 }} className="hidden lg:flex items-center gap-1">
            {items.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative px-4 py-2 text-[14px] font-medium transition-colors rounded-full whitespace-nowrap ${isActive ? "text-black" : "text-white/70 hover:text-white"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="pillNavActiveBackground"
                      className="absolute inset-0 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </motion.div>

          {/* MOBILE BURGER */}
          <motion.div layout transition={{ type: "spring", bounce: 0, duration: 1.2 }} className="lg:hidden flex items-center">
            <button
              className="text-white p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <div className="relative w-5 h-4">
                <span
                  className={`block absolute h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? "top-1.5 rotate-45" : "top-0"
                    }`}
                />
                <span
                  className={`block absolute h-0.5 w-full bg-white transition-all duration-300 ease-in-out top-1.5 ${mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                  className={`block absolute h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? "top-1.5 -rotate-45" : "top-3"
                    }`}
                />
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed inset-0 z-[99] bg-[#111111]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 pt-20 pb-10 px-4 pointer-events-auto ${forceClose ? "hidden" : "flex"
              }`}
          >
            {items.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  key={item.id}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      handleItemClick(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-2xl font-semibold tracking-wide transition-colors ${isActive ? "text-[#C6F10E]" : "text-white/70 hover:text-white"
                      }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}

            {/* GYRO SWITCH AT BOTTOM */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <span className="text-white/80 font-medium tracking-wide text-sm">Enable Gyro</span>
              <button
                onClick={toggleGyro}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isGyroEnabled ? 'bg-[#C6F10E]' : 'bg-white/20'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${isGyroEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
