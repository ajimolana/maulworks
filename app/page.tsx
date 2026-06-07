"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import RotatingText from "./components/RotatingText/RotatingText";
import PillNav from "./components/PillNav/PillNav";
import dynamic from "next/dynamic";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

const Lanyard = dynamic(() => import("./components/Lanyard/Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center z-[-1]">
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
      <div className="flex flex-col gap-2 mt-40 sm:mt-48 md:mt-80 lg:mt-10 xl:mt-0">
        <span className="text-white/50 text-sm tracking-widest font-medium text-center">Loading Lanyard</span>
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gray-400 rounded-full" style={{ animation: 'loading-bar 1.5s infinite ease-in-out' }} />
        </div>
      </div>
    </div>
  )
});
const ColorBends = dynamic(() => import("./components/ColorBends/ColorBends"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-main)] via-[var(--theme-bg-gradient)] to-[var(--theme-main)] opacity-80" />
});
const LogoLoop = dynamic(() => import("./components/LogoLoop/LogoLoop"));
const ProjectCard = dynamic(() => import("./components/ProjectCard"));
const ProjectModal = dynamic(() => import("./components/ProjectModal"));
const Lightbox = dynamic(() => import("./components/Lightbox"));

import {
  experiencesData,
  projectsData,
  researchData,
  organizationsData,
  achievements,
  Project,
  aboutModalData
} from "./data/portfolio";

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [] as string[],
    captions: [] as string[],
    index: 0
  });
  const [lanyardOffsetY, setLanyardOffsetY] = useState(0);

  // --- GYROSCOPE LANYARD STATE ---
  const [gyroGravity, setGyroGravity] = useState<[number, number, number]>([0, -40, 0]);
  const [isGyroEnabled, setIsGyroEnabled] = useState(false);

  const [pageReady, setPageReady] = useState(false);

  const { isLowPerformanceMode, togglePerformanceMode } = usePerformanceMode();

  useEffect(() => {
    setPageReady(true);

    // Conditionally preload Lanyard assets if performance mode is high
    if (!isLowPerformanceMode) {
      const preloadAssets = [
        { href: "/assets/lanyard/card.glb", as: "fetch", crossOrigin: "anonymous" },
        { href: "/assets/lanyard/lanyard.png", as: "image" }
      ];

      preloadAssets.forEach(asset => {
        if (!document.querySelector(`link[href="${asset.href}"]`)) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = asset.href;
          link.as = asset.as;
          if (asset.crossOrigin) link.crossOrigin = asset.crossOrigin;
          document.head.appendChild(link);
        }
      });
    }
  }, [isLowPerformanceMode]);

  useEffect(() => {
    const mql1366 = window.matchMedia("(min-width: 1366px)");
    const mql1024 = window.matchMedia("(min-width: 1024px) and (max-width: 1365px)");
    const mql768 = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");

    const updateLanyardOffset = () => {
      if (mql1366.matches) {
        setLanyardOffsetY(0.4);
      } else if (mql1024.matches) {
        setLanyardOffsetY(0.6);
      } else if (mql768.matches) {
        setLanyardOffsetY(-0.8);
      } else {
        setLanyardOffsetY(0);
      }
    };

    updateLanyardOffset();
    mql1366.addEventListener("change", updateLanyardOffset);
    mql1024.addEventListener("change", updateLanyardOffset);
    mql768.addEventListener("change", updateLanyardOffset);

    return () => {
      mql1366.removeEventListener("change", updateLanyardOffset);
      mql1024.removeEventListener("change", updateLanyardOffset);
      mql768.removeEventListener("change", updateLanyardOffset);
    };
  }, []);

  const navItems = [
    { id: "about", label: "About Me", href: "#about" },
    { id: "experiences", label: "Experiences", href: "#experiences" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "research", label: "Research", href: "#research" },
    { id: "organizations", label: "Organizations", href: "#organizations" },
    { id: "achievements", label: "Achievements", href: "#achievements" },
    { id: "contacts", label: "Get in Touch", href: "#contacts" },
    { id: "journey", label: "Journey", href: "/journey" },
  ];

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

  // 2. GYROSCOPE LOGIC
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let { beta, gamma } = event;
    if (beta === null || gamma === null) return;

    beta = Math.max(-90, Math.min(90, Math.floor(beta)));
    gamma = Math.max(-90, Math.min(90, Math.floor(gamma)));

    const gx = gamma * 0.6;
    const gz = (beta - 45) * 0.6;

    setGyroGravity([gx, -40, gz]);
  }, []);

  useEffect(() => {
    if (isGyroEnabled && typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      if (typeof window !== "undefined") {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      setGyroGravity([0, -40, 0]);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [isGyroEnabled, handleOrientation]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
        setIsGyroEnabled(true);
      }
    }
  }, []);

  const toggleGyro = async () => {
    if (isGyroEnabled) {
      setIsGyroEnabled(false);
    } else {
      if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission === 'granted') {
              setIsGyroEnabled(true);
            }
          } catch (e) {
            console.error("Gyro error:", e);
          }
        } else {
          setIsGyroEnabled(true);
        }
      }
    }
  };

  // 3. SCROLL LOCK LOGIC
  const isOverlayOpen = activeProject !== null || lightbox.isOpen;

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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

  const achievementTargetById = useCallback((id: string) =>
    researchData.find((project) => project.id === id) ||
    projectsData.find((project) => project.id === id) ||
    experiencesData.find((project) => project.id === id) ||
    organizationsData.find((project) => project.id === id)
    , []);

  const techLogos = useMemo(() => achievements.map((item, index) => {
    const combinedTitle = item.title.trim();
    const isExternal = item.href?.startsWith("http");
    const targetId = item.href?.startsWith("#") ? item.href.slice(1) : undefined;
    const modalTarget = targetId ? achievementTargetById(targetId) : undefined;

    const card = (
      <div className="w-[260px] sm:w-[300px] rounded-3xl border border-white/15 bg-[#111111] p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:border-white my-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-white/60 truncate">{item.competitionType}</p>
          <p className="text-xs uppercase tracking-wide text-white/60 truncate">{item.date}</p>
        </div>
        <h3 className="mt-1 text-base font-semibold text-white truncate">{combinedTitle}</h3>
        <p className="mt-1 text-xs text-white/60 truncate">{item.organizer}</p>
      </div>
    );

    if (modalTarget) {
      return {
        node: (
          <button
            type="button"
            onClick={() => openProjectModal(modalTarget)}
            className="block"
            aria-label={`Open ${combinedTitle}`}
          >
            {card}
          </button>
        ),
        title: combinedTitle
      };
    }

    if (item.href && isExternal) {
      return {
        node: (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block"
            aria-label={`Open ${combinedTitle}`}
          >
            {card}
          </a>
        ),
        title: combinedTitle
      };
    }

    if (item.href) {
      return {
        node: (
          <Link href={item.href} className="block" aria-label={`Open ${combinedTitle}`}>
            {card}
          </Link>
        ),
        title: combinedTitle
      };
    }

    return {
      node: <div className="block">{card}</div>,
      title: combinedTitle,
      ariaLabel: `Achievement ${index + 1}`
    };
  }), [achievementTargetById]);

  return (
    <div id="profile" className="min-h-screen overflow-x-hidden bg-[var(--theme-main)] relative pt-0 pb-10">
      <a href="#about" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--theme-accent)] text-[var(--theme-main)] px-4 py-2 z-[1000] rounded-md font-bold">
        Skip to content
      </a>

      {/* PILL NAV */}
      <PillNav
        items={navItems}
        forceClose={isOverlayOpen}
        togglePerformanceMode={togglePerformanceMode}
        isGyroEnabled={isGyroEnabled}
        toggleGyro={toggleGyro}
        isLowPerformanceMode={isLowPerformanceMode}
      />

      {/* HEADER SECTION */}
      <div className="w-full relative overflow-visible">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div style={{ width: '100%', height: '100%', position: 'relative', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)' }}>
            {!isLowPerformanceMode ? (
              <>
                <ColorBends colors={["#10282b"]} rotation={90} speed={0.2} scale={1} frequency={1} warpStrength={1} mouseInfluence={1} noise={0.15} parallax={0.5} iterations={1} intensity={1.5} bandWidth={6} transparent autoRotate={0} />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-main)] via-[var(--theme-bg-gradient)] to-[var(--theme-main)] opacity-80" />
            )}
          </div>
        </div>
        <div className={`mx-auto max-w-[1366px] min-h-[100svh] xl:min-h-screen px-4 sm:px-6 ${isLowPerformanceMode ? 'flex items-center' : 'flex items-center xl:items-stretch'}`}>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-0 w-full min-h-[100svh] xl:min-h-screen">
            <div className={`col-span-1 h-full relative z-10 order-2 xl:order-1 ${!isLowPerformanceMode ? 'xl:col-span-6' : 'xl:col-span-12'}`}>
              <div className={`flex ${!isLowPerformanceMode ? 'items-start xl:items-center' : 'items-center'} h-full w-full`}>
                <div className={`flex flex-col gap-6 ${!isLowPerformanceMode ? '-mt-28 sm:-mt-20 md:-mt-10 lg:-mt-64 xl:mt-0' : 'w-full max-w-5xl mx-auto mt-0 sm:mt-4'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-0 sm:mt-0 md:mt-14">
                    <p className="text-lg sm:text-2xl text-white font-bold">Open to Position as a</p>
                    <RotatingText texts={['Data Analyst', 'Data Scientist', 'Risk Analyst', 'Management Trainee']} mainClassName="text-[var(--theme-accent)] overflow-hidden text-lg sm:text-2xl font-bold inline-flex" staggerFrom="first" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-120%" }} staggerDuration={0.025} splitLevelClassName="overflow-hidden" transition={{ type: "spring", damping: 30, stiffness: 400 }} rotationInterval={2000} animatePresenceMode="wait" animatePresenceInitial={false} splitBy="characters" auto loop />
                  </div>
                  <h1 className="flex flex-col items-start gap-4">
                    <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-start whitespace-normal lg:whitespace-nowrap text-white">I'm Maulana Raji Shofil Fuadi</span>
                    <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-start text-[var(--theme-accent)]">Actuarial Science Graduate</span>
                  </h1>
                  <div className="flex flex-col items-start">
                    <p className="text-sm sm:text-base font-medium text-white/70 mb-4">Based in Makassar, South Sulawesi, Indonesia</p>
                    <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-white">I turn numbers into decisions. My background is a unique blend of actuarial science, research nerd, and proven leadership. Driven by curiosity, I'm always chasing the next frontier, currently pushing into AI automation.</p>
                    <div className="flex flex-wrap gap-4 mt-2 mb-6 md:mb-8">
                      <Link href="/journey" className="px-6 py-3 bg-[var(--theme-accent)] text-[var(--theme-main)] font-bold rounded-full hover:scale-105 transition-transform duration-300">
                        See My Journey
                      </Link>
                      <a href="#projects" className="px-6 py-3 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors duration-300">
                        See My Work
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`col-span-1 xl:col-span-6 relative z-0 overflow-visible order-1 xl:order-2 ${!isLowPerformanceMode ? '-mt-40 sm:-mt-48 md:-mt-80 lg:-mt-10 xl:-mt-0' : 'hidden'}`}>
              <div className="relative h-[100svh] xl:h-screen w-[280%] -ml-[90%] sm:w-[300%] sm:-ml-[100%] md:w-[350%] md:-ml-[125%] lg:w-[350%] lg:-ml-[125%] xl:w-[400%] xl:-ml-[130%] 2xl:w-[450%] 2xl:-ml-[150%] flex items-center justify-center">
                {!isLowPerformanceMode && (
                  <Lanyard position={[0, 0, 15]} gravity={gyroGravity} lanyardOffsetY={lanyardOffsetY} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: ABOUT ME */}
      <section id="about" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">About Me</h2>
          <div className="bg-[#111111] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ROW 1: Bio + Education */}
              {/* Bio: Left, 2/3 width */}
              <div className="space-y-6 lg:col-span-2">
                <p className="text-white leading-relaxed text-base sm:text-lg">
                  I don't fit neatly into one box. Analytically trained in actuarial science and certified in data analytics, I'm equally drawn to the creative and human side of problem solving. I research things, build things, and lead people along the way. The common thread across all of it? Curiosity, and a refusal to stop at good enough.
                </p>
              </div>

              {/* Education: Right, 1/3 width */}
              <div className="space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-xl">Education</h3>
                <div className="cursor-pointer group bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(aboutModalData.education)}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                    <p className="font-medium text-white text-sm">Hasanuddin University</p>
                    <p className="text-white/60 text-xs whitespace-nowrap">Aug 2021 – Feb 2026</p>
                  </div>
                  <p className="text-white/80 text-xs">Bachelor of Actuarial Science</p>
                </div>
              </div>

              {/* ROW 2: Tech Stack, Certifications, Scholarships */}
              {/* Tech Stack */}
              <div className="space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-xl">Technical Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'Predictive Modelling', 'n8n', 'SQL', 'R', 'Power BI', 'Looker Studio', 'Tableau', 'Excel', 'Canva'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/90">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-xl">Certifications</h3>
                <div className="space-y-3">
                  <div className="cursor-pointer group bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(aboutModalData.cert_data_analyst)}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <p className="font-medium text-white text-sm">Data Analyst</p>
                      <p className="text-white/60 text-xs whitespace-nowrap">Oct 2024</p>
                    </div>
                    <p className="text-white/80 text-xs">National Professional Certification Agency</p>
                  </div>
                  <div className="cursor-pointer group bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(aboutModalData.cert_data_science)}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <p className="font-medium text-white text-sm">Data Science & AI</p>
                      <p className="text-white/60 text-xs whitespace-nowrap">Feb 2024 - Jun 2024</p>
                    </div>
                    <p className="text-white/80 text-xs">Startup Campus</p>
                  </div>
                </div>
              </div>

              {/* Scholarships */}
              <div className="space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-xl">Scholarships</h3>
                <div className="space-y-3">
                  {[
                    { name: 'BSI Scholarship Prestasi', year: '2022', desc: 'Bank Syariah Indonesia', modalData: aboutModalData.schol_prestasi },
                    { name: 'BSI Scholarship Talenta', year: '2024', desc: 'Bank Syariah Indonesia', modalData: aboutModalData.schol_talenta },
                  ].map((s) => (
                    <div key={s.name} className="cursor-pointer group bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(s.modalData)}>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                        <p className="font-medium text-white text-sm">{s.name}</p>
                        <p className="text-white/60 text-xs whitespace-nowrap">{s.year}</p>
                      </div>
                      <p className="text-white/80 text-xs">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 1. SECTION EXPERIENCES */}
      <section id="experiences" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiencesData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="default" />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SECTION PROJECTS */}
      <section id="projects" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="default" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION RESEARCH */}
      <section id="research" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {researchData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="research" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION ORGANIZATIONS */}
      <section id="organizations" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationsData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="organization" />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION ACHIEVEMENTS */}
      <section id="achievements" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Achievements</h2>
          <div className="py-2 overflow-visible">
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="left"
              gap={12}
              pauseOnHover
              enableDrag
              fadeOut
              fadeOutColor="var(--theme-main)"
              ariaLabel="Achievements"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="w-full mt-28 border-t border-white/10 pt-10 pb-6 flex flex-col scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] w-full px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 w-full">
            {/* Left: Get in Touch */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Get in Touch</h2>
            </div>

            {/* Center: Social Icons */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="flex items-center gap-6">
                <a href="mailto:maulanarajisf@gmail.com" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80" aria-label="Email Maulana">
                  <Image src="/assets/footer/mail.svg" alt="Email Logo" width={28} height={28} />
                </a>
                <a href="https://github.com/ajimolana" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80" aria-label="GitHub Profile">
                  <Image src="/assets/footer/github.svg" alt="GitHub Logo" width={28} height={28} />
                </a>
                <a href="https://linkedin.com/in/maulanaraji/" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80" aria-label="LinkedIn Profile">
                  <Image src="/assets/footer/linkedin.svg" alt="LinkedIn Logo" width={28} height={28} />
                </a>
                <a href="https://instagram.com/ajimolana/" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80" aria-label="Instagram Profile">
                  <Image src="/assets/footer/instagram.svg" alt="Instagram Logo" width={28} height={28} />
                </a>
              </div>
            </div>

            {/* Right: Download CV */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end">
              <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-[var(--theme-accent)] text-[var(--theme-main)] font-bold rounded-full hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                Download CV
              </a>
            </div>
          </div>

          <div className="mt-12 md:mt-16 w-full text-center">
            <p className="text-sm text-[#dfdfdf] px-4">
              Copyright &copy; 2026 Maulana Raji Shofil Fuadi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* GLOBAL PROJECT MODAL */}
      <ProjectModal
        activeProject={activeProject}
        onClose={closeProjectModal}
        onOpenLightbox={openLightbox}
      />

      {/* LIGHTBOX UNTUK PREVIEW GAMBAR */}
      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        captions={lightbox.captions}
        index={lightbox.index}
        onClose={closeLightbox}
        setIndex={setLightboxIndex}
      />
    </div>
  );
}