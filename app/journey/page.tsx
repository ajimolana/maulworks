"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Timeline from "../components/Timeline/Timeline";
import ProjectModal from "../components/ProjectModal";
import Lightbox from "../components/Lightbox";
import PillNav from "../components/PillNav/PillNav";
import ColorBends from "../components/ColorBends/ColorBends";
import { Project } from "../data/portfolio";

export default function JourneyPage() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [] as string[],
    captions: [] as string[],
    index: 0
  });

  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      const storedPref = localStorage.getItem("performanceMode");
      if (storedPref) {
        setIsLowPerformanceMode(storedPref === "low");
        return;
      }

      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const isLowEndHardware = hardwareConcurrency < 4;
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setIsLowPerformanceMode(prefersReducedMotion || (isLowEndHardware && isMobile));
    };

    checkPerformance();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      const storedPref = localStorage.getItem("performanceMode");
      if (storedPref) return;
      if (e.matches) setIsLowPerformanceMode(true);
      else checkPerformance();
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const togglePerformanceMode = () => {
    setIsLowPerformanceMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("performanceMode", newMode ? "low" : "high");
      return newMode;
    });
  };

  // 1. BROWSER HISTORY LOGIC
  useEffect(() => {
    const handlePopState = () => {
      if (lightbox.isOpen) {
        setLightbox((prev) => ({ ...prev, isOpen: false }));
      } else if (activeProject) {
        setActiveProject(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox.isOpen) window.history.back();
        else if (activeProject) window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox.isOpen, activeProject]);

  // 2. SCROLL LOCK LOGIC
  const isOverlayOpen = activeProject !== null || lightbox.isOpen;

  useEffect(() => {
    if (isOverlayOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOverlayOpen]);

  // CONTROLLERS
  const openProjectModal = (project: Project) => {
    window.history.pushState({ modalOpen: true }, "");
    setActiveProject(project);
  };
  const closeProjectModal = () => window.history.back();

  const openLightbox = (images: string[], captions: string[], index: number) => {
    window.history.pushState({ lightboxOpen: true }, "");
    setLightbox({ isOpen: true, images, captions, index });
  };
  const closeLightbox = () => window.history.back();
  const setLightboxIndex = (index: number) => setLightbox(prev => ({ ...prev, index }));

  const navItems = [
    { id: "about", label: "About Me", href: "/#about" },
    { id: "experiences", label: "Experiences", href: "/#experiences" },
    { id: "projects", label: "Projects", href: "/#projects" },
    { id: "research", label: "Research", href: "/#research" },
    { id: "organizations", label: "Organizations", href: "/#organizations" },
    { id: "achievements", label: "Achievements", href: "/#achievements" },
    { id: "contacts", label: "Get in Touch", href: "/#contacts" },
    { id: "journey", label: "Journey", href: "/journey" },
  ];

  return (
    <main className="min-h-screen bg-[#101010] py-28 md:py-36 px-4 relative">
      {/* FIXED BACKGROUND */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <div style={{ width: '100%', height: '100%', position: 'relative', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)' }}>
          {!isLowPerformanceMode ? (
            <ColorBends colors={["#19382e"]} rotation={90} speed={0.2} scale={1} frequency={1} warpStrength={1} mouseInfluence={1} noise={0.15} parallax={0.5} iterations={1} intensity={1.5} bandWidth={6} transparent autoRotate={0} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#101010] via-[#15241e] to-[#101010] opacity-80" />
          )}
        </div>
      </div>

      <div className="relative z-10">
        <PillNav 
          items={navItems} 
          forceClose={isOverlayOpen} 
          homeHref="/"
          activeItemOverride="journey"
          disableScrollSpy={true}
          togglePerformanceMode={togglePerformanceMode}
          isLowPerformanceMode={isLowPerformanceMode}
        />

        <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Journey & Milestones</h1>
        <p className="text-white/60 mt-4 text-lg max-w-2xl">
          A chronological look at my academic journey, professional experiences, and key achievements.
        </p>
      </div>

      <div className="pb-20">
        <Timeline onOpenModal={openProjectModal} />
      </div>

      {/* GLOBAL PROJECT MODAL */}
      <ProjectModal
        activeProject={activeProject}
        onClose={closeProjectModal}
        onOpenLightbox={openLightbox}
      />

      {/* LIGHTBOX */}
      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        captions={lightbox.captions}
        index={lightbox.index}
        onClose={closeLightbox}
        setIndex={setLightboxIndex}
      />
      </div>
    </main>
  );
}
