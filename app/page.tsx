"use client";

import { useState, useEffect, useCallback, useMemo, useRef, RefObject } from "react";
import PillNav from "./components/PillNav/PillNav";
import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("./components/Aurora/Aurora"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-main)] via-[var(--theme-bg-gradient)] to-[var(--theme-main)] opacity-80" />
});
const LogoLoop = dynamic(() => import("./components/LogoLoop/LogoLoop"));
const ProjectModal = dynamic(() => import("./components/ProjectModal"));
const Lightbox = dynamic(() => import("./components/Lightbox"));
const ContactModal = dynamic(() => import("./components/ContactModal"));
import type { LightboxOrigin } from "./components/Lightbox";
import AnimatedSection from "./components/AnimatedSection";
import ProjectCard from "./components/ProjectCard";
import AchievementShelf from "./components/AchievementShelf/AchievementShelf";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import ScrollDots from "./components/ScrollDots";
import { pressPulse } from "./components/pressPulse";
import { useUniformLines } from "./components/useUniformLines";
import { pageCarousel, useScrollEdges } from "./components/carousel";

import {
  experiencesData,
  projectsData,
  researchData,
  organizationsData,
  achievements,
  Project,
} from "./data/portfolio";

const CARD_LINE_KEYS = ["title", "desc"] as const;

// Mouse-only arrows for the phone/tablet carousels; they page like the modal gallery and dim at either end
function ScrollArrows({ scrollRef }: { scrollRef: RefObject<HTMLDivElement> }) {
  const edges = useScrollEdges(scrollRef);
  const buttonClass = "flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-default";
  return (
    <div className="flex md:hidden items-center gap-2">
      <button onClick={() => pageCarousel(scrollRef.current, -1)} disabled={edges.atStart} aria-label="Scroll left" className={buttonClass}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => pageCarousel(scrollRef.current, 1)} disabled={edges.atEnd} aria-label="Scroll right" className={buttonClass}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [] as string[],
    captions: [] as string[],
    index: 0,
    origin: undefined as LightboxOrigin | undefined
  });
  const [isContactOpen, setIsContactOpen] = useState(false);

  const projectsRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);
  const projectLines = useUniformLines(projectsRef, CARD_LINE_KEYS);
  const researchLines = useUniformLines(researchRef, CARD_LINE_KEYS);
  const [isMouse, setIsMouse] = useState(false);

  useEffect(() => {
    setIsMouse(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const logosData = useMemo(() => [
    { file: "Apple Developer Academy.png", name: "Apple Developer Academy" },
    { file: "Bank Indonesia.png", name: "Bank Indonesia" },
    { file: "BSI Scholarship.png", name: "BSI Scholarship" },
    { file: "CBP Rupiah.png", name: "CBP Rupiah" },
    { file: "PT Asuransi Kredit Indonesia.png", name: "PT Asuransi Kredit Indonesia" },
    { file: "Startup Campus.png", name: "Startup Campus" }
  ], []);

  const homeLogoNodes = useMemo(() => logosData.map(({ file, name }) => {
    return {
      node: (
        <div className="flex flex-col items-center justify-center px-6 sm:px-8 gap-2 sm:gap-3">
          <div className="h-7 sm:h-9 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/homeLogos/${encodeURIComponent(file)}`}
              alt={name}
              height="36"
              className="h-full w-auto object-contain select-none [-webkit-user-drag:none]"
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs sm:text-sm font-medium text-white/80 whitespace-nowrap font-sans tracking-tight">{name}</span>
        </div>
      ),
      title: name
    };
  }), [logosData]);

  const navItems = useMemo(() => [
    { id: "about", label: "About Me", href: "#about" },
    { id: "experiences", label: "Experiences", href: "#experiences" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "research", label: "Research", href: "#research" },
    { id: "organizations", label: "Organizations", href: "#organizations" },
    { id: "achievements", label: "Achievements", href: "#achievements" },
    { id: "contacts", label: "Get in Touch", href: "#contacts" },
  ], []);

  // 1. BROWSER HISTORY LOGIC
  useEffect(() => {
    const handlePopState = () => {
      if (lightbox.isOpen) {
        setLightbox((prev) => ({ ...prev, isOpen: false }));
      } else if (activeProject) {
        setActiveProject(null);
      } else if (isContactOpen) {
        setIsContactOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox.isOpen) window.history.back();
        else if (activeProject) window.history.back();
        else if (isContactOpen) window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox.isOpen, activeProject, isContactOpen]);

  // 3. SCROLL LOCK LOGIC
  const isOverlayOpen = activeProject !== null || lightbox.isOpen || isContactOpen;

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOverlayOpen]);

  // CONTROLLERS
  // fromAchievement: opened from an Achievement row, so the modal offers a jump to the card it belongs to
  const [modalFromAchievement, setModalFromAchievement] = useState(false);
  const openProjectModal = useCallback((project: Project, fromAchievement = false) => {
    window.history.pushState({ modalOpen: true }, "");
    setModalFromAchievement(fromAchievement);
    setActiveProject(project);
  }, []);
  const openFromAchievement = useCallback((project: Project) => openProjectModal(project, true), [openProjectModal]);
  const closeProjectModal = useCallback(() => window.history.back(), []);

  const openLightbox = useCallback((images: string[], captions: string[], index: number, origin?: LightboxOrigin) => {
    window.history.pushState({ lightboxOpen: true }, "");
    setLightbox({ isOpen: true, images, captions, index, origin });
  }, []);
  const closeLightbox = useCallback(() => window.history.back(), []);
  const setLightboxIndex = useCallback((index: number) => setLightbox(prev => ({ ...prev, index })), []);

  const openContactModal = useCallback(() => {
    window.history.pushState({ contactModalOpen: true }, "");
    setIsContactOpen(true);
  }, []);

  // "View in Research" etc.: close the modal, bring the card into view (sliding a phone carousel to it) and pulse it
  const viewInSection = useMemo(() => {
    if (!activeProject || !modalFromAchievement) return undefined;
    const id = activeProject.id;
    const label =
      researchData.some((p) => p.id === id) ? "Research" :
      projectsData.some((p) => p.id === id) ? "Projects" :
      organizationsData.some((p) => p.id === id) ? "Organizations" :
      experiencesData.some((p) => p.id === id) ? "Experiences" : null;
    if (!label) return undefined;
    return {
      label,
      onClick: () => {
        window.history.back();
        // Wait for the modal to close and release the scroll lock
        setTimeout(() => {
          const card = document.querySelector<HTMLElement>(`[data-card-id="${id}"]`);
          if (!card) return;
          const carousel = card.closest<HTMLElement>(".snap-x");
          if (carousel && carousel.scrollWidth > carousel.clientWidth) {
            const c = carousel.getBoundingClientRect(), r = card.getBoundingClientRect();
            carousel.scrollTo({ left: carousel.scrollLeft + r.left - c.left - (c.width - r.width) / 2, behavior: "smooth" });
          }
          const r = card.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + r.top - (window.innerHeight - r.height) / 2, behavior: "smooth" });
          setTimeout(() => card.animate(
            [{ boxShadow: "0 0 0 2px rgba(255,255,255,0.7)" }, { boxShadow: "0 0 0 2px rgba(255,255,255,0)" }],
            { duration: 1600, easing: "ease-out" }
          ), 500);
        }, 350);
      },
    };
  }, [activeProject, modalFromAchievement]);

  // Used by AchievementShelf to resolve linkedProjectId strings
  const findProject = useCallback((id: string) =>
    researchData.find((project) => project.id === id) ||
    projectsData.find((project) => project.id === id) ||
    experiencesData.find((project) => project.id === id) ||
    organizationsData.find((project) => project.id === id)
  , []);

  return (
    <div id="profile" className="min-h-screen overflow-x-hidden bg-[var(--theme-main)] relative pt-0 pb-10">
      <a href="#about" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--theme-accent)] text-[var(--theme-main)] px-4 py-2 z-[1000] rounded-md font-bold">
        Skip to content
      </a>

      {/* PILL NAV */}
      <PillNav
        items={navItems}
        forceClose={isOverlayOpen}
      />

      {/* HEADER SECTION */}
      <div className="w-full relative overflow-visible">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div style={{ width: '100%', height: '100%', position: 'relative', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)' }}>
            <Aurora
              colorStops={["#2a2a2e", "#c8c8d0", "#2a2a2e"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
        </div>
        <div className="min-h-[100svh] xl:min-h-screen flex flex-col">
        <div className="mx-auto max-w-[1366px] w-full flex-1 px-4 sm:px-6 pt-24 flex items-center justify-center">
          <div className="w-full max-w-5xl relative z-10 flex flex-col items-center justify-center text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-10 sm:mb-8 text-xs sm:text-sm font-medium">
              <span className="text-[#a1a1aa]">Based in</span>
              <span className="text-white/90">Jakarta, Indonesia</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(4.5rem,8vw,5.5rem)] font-bold tracking-tight text-white leading-[1.1] mb-2 sm:mb-4 font-sans text-balance lg:whitespace-nowrap">
              Maulana Raji Shofil Fuadi
            </h1>

            {/* Subtitle */}
            <h2 className="text-base sm:text-xl md:text-2xl font-medium text-[#a1a1aa] mb-10 sm:mb-12">
              Actuarial & Data Science
            </h2>

            {/* CTAs */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:mb-16 px-4">
              {/* Press scale runs on click (pressPulse), not CSS :active, so taps iOS Safari redirects to the button still show it */}
              <a href="#projects" onClick={(e) => pressPulse(e.currentTarget)} className="relative px-4 py-2 sm:px-8 sm:py-3 text-xs sm:text-base bg-[var(--theme-accent)] text-[var(--theme-main)] font-bold rounded-full transition-all duration-300 whitespace-nowrap overflow-hidden group hover:shadow-[0_0_20px_var(--theme-accent)] [-webkit-tap-highlight-color:transparent]">
                <span className="relative z-10">Explore Projects</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </a>
            </div>


          </div>
        </div>

        {/* Hero Logos */}
        <div className="relative w-full z-10 pb-4 sm:pb-8">
          <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
            <p className="text-center text-[#a1a1aa] text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mb-5 sm:mb-6">Experiences & Affiliations</p>
            <div className="min-h-[80px]">
              <LogoLoop
                logos={homeLogoNodes}
                speed={50}
                direction="left"
                gap={24}
                pauseOnHover={false}
                enableDrag
                fadeOut
                fadeOutColor="var(--theme-main)"
                ariaLabel="Home Logos"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      <AboutSection onOpenProject={openProjectModal} />

      {/* 1. SECTION EXPERIENCES */}
      <AnimatedSection id="experiences" className="w-full mt-10 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-4 sm:mb-6">Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {experiencesData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="organization" />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 2. SECTION PROJECTS */}
      <AnimatedSection id="projects" className="w-full mt-10 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <div className="flex flex-row items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-4xl font-semibold text-white">Projects</h2>
            {isMouse && <ScrollArrows scrollRef={projectsRef} />}
          </div>
          <div ref={projectsRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 overscroll-x-contain gap-3 sm:gap-4 pt-12 -mt-12 pb-12 -mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pt-0 md:mt-0 md:pb-0 md:mb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 scrollbar-hide md:overflow-visible">
            {projectsData.map((project) => (
              <div key={project.id} className={`${isMouse ? "snap-start" : "snap-center"} snap-always flex-none w-[74vw] sm:w-[45vw] md:w-auto`}>
                <ProjectCard project={project} onClick={openProjectModal} variant="default" lines={projectLines} />
              </div>
            ))}
          </div>
          <ScrollDots scrollRef={projectsRef} count={projectsData.length} itemLabel="project" showNav={!isMouse} className="md:hidden" />
        </div>
      </AnimatedSection>

      {/* 3. SECTION RESEARCH */}
      <AnimatedSection id="research" className="w-full mt-10 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <div className="flex flex-row items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-4xl font-semibold text-white">Research</h2>
            {isMouse && <ScrollArrows scrollRef={researchRef} />}
          </div>
          <div ref={researchRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 overscroll-x-contain gap-3 sm:gap-4 pt-12 -mt-12 pb-12 -mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pt-0 md:mt-0 md:pb-0 md:mb-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-6 scrollbar-hide md:overflow-visible">
            {researchData.map((project) => (
              <div key={project.id} className={`${isMouse ? "snap-start" : "snap-center"} snap-always flex-none w-[74vw] sm:w-[45vw] md:w-auto`}>
                <ProjectCard project={project} onClick={openProjectModal} variant="research" lines={researchLines} />
              </div>
            ))}
          </div>
          <ScrollDots scrollRef={researchRef} count={researchData.length} itemLabel="paper" showNav={!isMouse} className="md:hidden" />
        </div>
      </AnimatedSection>

      {/* 4. SECTION ORGANIZATIONS */}
      <AnimatedSection id="organizations" className="w-full mt-10 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-4 sm:mb-6">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {organizationsData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="organization" />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 5. SECTION ACHIEVEMENTS */}
      <AnimatedSection id="achievements" className="w-full mt-10 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-4 sm:mb-6">Achievements</h2>
          <AchievementShelf
            items={achievements}
            findProject={findProject}
            onOpenModal={openFromAchievement}
          />
        </div>
      </AnimatedSection>

      <Footer onContact={openContactModal} />

      {/* GLOBAL PROJECT MODAL */}
      <ProjectModal
        activeProject={activeProject}
        onClose={closeProjectModal}
        viewInSection={viewInSection}
        onOpenLightbox={openLightbox}
      />

      {/* LIGHTBOX UNTUK PREVIEW GAMBAR */}
      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        captions={lightbox.captions}
        index={lightbox.index}
        origin={lightbox.origin}
        onClose={closeLightbox}
        setIndex={setLightboxIndex}
      />

      {/* CONTACT MODAL */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          if (window.history.state?.contactModalOpen) {
            window.history.back();
          }
        }}
      />
    </div>
  );
}