"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Lanyard from "./components/Lanyard/Lanyard";
import RotatingText from "./components/RotatingText/RotatingText";
import SplitText from "./components/SplitText/SplitText";
import BlurText from "./components/BlurText/BlurText";
import AnimatedContent from "./components/AnimatedContent/AnimatedContent";
import DotGrid from "./components/DotGrid/DotGrid";
import ColorBends from "./components/ColorBends/ColorBends";
import PillNav from "./components/PillNav/PillNav";
import LogoLoop from "./components/LogoLoop/LogoLoop";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import Lightbox from "./components/Lightbox";

import {
  experiencesData,
  projectsData,
  researchData,
  organizationsData,
  achievements,
  Project
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
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  useEffect(() => {
    setPageReady(true);

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

  useEffect(() => {
    const updateLanyardOffset = () => {
      const width = window.innerWidth;
      if (width >= 1366) {
        setLanyardOffsetY(0.4);
      } else if (width >= 1024) {
        setLanyardOffsetY(0.6);
      } else if (width >= 768) {
        setLanyardOffsetY(-0.8);
      } else {
        setLanyardOffsetY(0);
      }
    };

    updateLanyardOffset();
    window.addEventListener("resize", updateLanyardOffset);
    return () => window.removeEventListener("resize", updateLanyardOffset);
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

  const achievementTargetById = (id: string) =>
    researchData.find((project) => project.id === id) ||
    projectsData.find((project) => project.id === id) ||
    experiencesData.find((project) => project.id === id) ||
    organizationsData.find((project) => project.id === id);

  const techLogos = achievements.map((item, index) => {
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
  });

  return (
    <div id="profile" className="min-h-screen overflow-x-hidden bg-[#101010] relative pt-0 pb-10">
      <a href="#about" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#C6F10E] text-black px-4 py-2 z-[1000] rounded-md font-bold">
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
                <ColorBends colors={["#19382e"]} rotation={90} speed={0.2} scale={1} frequency={1} warpStrength={1} mouseInfluence={1} noise={0.15} parallax={0.5} iterations={1} intensity={1.5} bandWidth={6} transparent autoRotate={0} />
                <DotGrid dotSize={5} gap={15} baseColor="#2F293A" activeColor="#5227FF" proximity={120} shockRadius={250} shockStrength={5} resistance={750} returnDuration={1.5} />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#101010] via-[#15241e] to-[#101010] opacity-80" />
            )}
          </div>
        </div>
        <div className={`mx-auto max-w-[1366px] min-h-screen px-4 sm:px-6 ${isLowPerformanceMode ? 'flex items-center' : ''}`}>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-0 w-full">
            <div className={`col-span-1 h-full relative z-10 order-2 xl:order-1 ${!isLowPerformanceMode ? 'xl:col-span-6' : 'xl:col-span-12'}`}>
              <div className={`flex ${!isLowPerformanceMode ? 'items-start xl:items-center' : 'items-center'} h-full w-full`}>
                <div className={`flex flex-col gap-6 ${!isLowPerformanceMode ? '-mt-28 sm:-mt-20 md:-mt-10 lg:-mt-64 xl:mt-0' : 'w-full max-w-5xl mx-auto'} transition-opacity duration-300 ${!pageReady ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                  <AnimatedContent distance={100} direction="vertical" reverse={false} duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1} delay={0}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-0 sm:mt-0 md:mt-14">
                      <h1 className="text-lg sm:text-2xl text-white font-bold">Open to Position as a</h1>
                      <RotatingText texts={['Data Analyst', 'Data Scientist', 'Risk Analyst', 'Management Trainee']} mainClassName="px-2 sm:px-2 md:px-3 bg-[#C6F10E] text-black overflow-hidden py-0.5 sm:py-1 justify-center rounded-lg text-lg sm:text-2xl font-bold inline-flex transition-all" staggerFrom="last" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-120%" }} staggerDuration={0.025} splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1" transition={{ type: "spring", damping: 30, stiffness: 400 }} rotationInterval={2000} animatePresenceMode="wait" animatePresenceInitial={false} splitBy="characters" auto loop />
                    </div>
                  </AnimatedContent>
                  <div className="flex flex-col items-start gap-4">
                    <SplitText text="I'm Maulana Raji Shofil Fuadi" className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-start whitespace-normal lg:whitespace-nowrap" textAlign="left" delay={50} from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} to={{ opacity: 1, transform: 'translate3d(0,0,0)' }} threshold={0.1} rootMargin="-0px" />
                    <SplitText text="Actuarial Science Graduate" className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-start text-[#C6F10E]" textAlign="left" delay={75} from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} to={{ opacity: 1, transform: 'translate3d(0,0,0)' }} threshold={0.1} rootMargin="-0px" />
                  </div>
                  <div className="flex flex-col items-start">
                    <BlurText text="Based in Makassar • Open to Remote / Relocation" delay={15} animateBy="words" direction="top" className="text-sm sm:text-base font-medium text-white/70 mb-4" />
                    <BlurText text="Built ML models that predict food security for 127 regional points. Automated 5,000+ monthly data entries. Led a 76-member student organization to a national championship." delay={20} animateBy="words" direction="top" className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-xl sm:max-w-2xl md:max-w-7xl" />
                    <div className="flex flex-wrap gap-4 mt-2 mb-6 md:mb-8">
                      <Link href="/journey" className="px-6 py-3 bg-[#C6F10E] text-black font-bold rounded-full hover:scale-105 transition-transform duration-300">
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
            <div className={`col-span-1 xl:col-span-6 relative z-0 overflow-visible order-1 xl:order-2 ${!isLowPerformanceMode ? '-mt-56 sm:-mt-64 md:-mt-80 lg:-mt-10 xl:-mt-0' : 'hidden'}`}>
              <div className="relative w-[280%] -ml-[90%] sm:w-[300%] sm:-ml-[100%] md:w-[350%] md:-ml-[125%] lg:w-[350%] lg:-ml-[125%] xl:w-[400%] xl:-ml-[130%] 2xl:w-[450%] 2xl:-ml-[150%] flex items-center justify-center">
                {!isLowPerformanceMode && (
                  <Lanyard position={[0, 0, 15]} gravity={gyroGravity} lanyardOffsetY={lanyardOffsetY} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: ABOUT ME */}
      <section id="about" className="w-full mt-10 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">About Me</h2>
          <div className="bg-[#111111] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed text-base sm:text-lg">
                  Hello! I'm a passionate Data Analyst and Actuarial Science graduate.
                  My journey blends rigorous statistical modeling with a deep interest in modern
                  AI automation and business intelligence. I thrive at the intersection of
                  complex data and actionable decision-making.
                </p>
                <div className="space-y-4">
                  <h3 className="text-[#C6F10E] font-semibold text-xl">Technical Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'SQL', 'Power BI', 'Streamlit', 'n8n', 'Next.js', 'Machine Learning', 'Data Visualization'].map((skill) => (
                      <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/90">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-xl">Education</h3>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <p className="font-medium text-white">Hasanuddin University</p>
                      <p className="text-white/60 text-sm whitespace-nowrap">Aug 2021 – Feb 2026</p>
                    </div>
                    <p className="text-white/80 text-sm">Bachelor of Actuarial Science • GPA: 3.51/4.00</p>
                    <p className="text-white/60 text-sm">Scholarships: BSI Scholarship Prestasi (2022), BSI Scholarship Talenta (2024)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-xl">Interests</h3>
                  <p className="text-white/80 leading-relaxed text-base">
                    Beyond writing code and querying databases, I love analyzing business trends, participating in scientific research competitions, and enjoying a good game of softball.
                  </p>
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
              fadeOutColor="#101010"
              ariaLabel="Achievements"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="w-full mt-28 mb-20 border-t border-white/10 pt-10 flex flex-col items-center justify-center gap-6 scroll-mt-24 md:scroll-mt-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">Get in Touch</h2>

        <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-[#C6F10E] text-black font-bold rounded-full hover:scale-105 transition-transform duration-300">
          Download CV
        </a>

        <div className="flex items-center justify-center gap-6 mt-2">
          <a
            href="mailto:maulanarajisf@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="Email Maulana"
          >
            <Image src="/assets/footer/mail.png" alt="Email Logo" width={28} height={28} />
          </a>
          <a
            href="https://github.com/ajimolana"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="GitHub Profile"
          >
            <Image src="/assets/footer/github.png" alt="GitHub Logo" width={28} height={28} />
          </a>
          <a
            href="https://linkedin.com/in/maulanaraji/"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="LinkedIn Profile"
          >
            <Image src="/assets/footer/linkedin.png" alt="LinkedIn Logo" width={28} height={28} />
          </a>
          <a
            href="https://instagram.com/ajimolana/"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="Instagram Profile"
          >
            <Image src="/assets/footer/instagram.png" alt="Instagram Logo" width={28} height={28} />
          </a>
        </div>
        <p className="text-sm text-[#dfdfdf] text-center px-4 mt-2">
          Copyright &copy; 2026 Maulana Raji Shofil Fuadi. All rights reserved.
        </p>
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