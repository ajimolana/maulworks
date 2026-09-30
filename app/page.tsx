"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import PillNav from "./components/PillNav/PillNav";
import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("./components/Aurora/Aurora"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-main)] via-[var(--theme-bg-gradient)] to-[var(--theme-main)] opacity-80" />
});
const LogoLoop = dynamic(() => import("./components/LogoLoop/LogoLoop"));
const ProjectCard = dynamic(() => import("./components/ProjectCard"));
const ProjectModal = dynamic(() => import("./components/ProjectModal"));
const Lightbox = dynamic(() => import("./components/Lightbox"));
const AchievementShelf = dynamic(() => import("./components/AchievementShelf/AchievementShelf"));
const ContactModal = dynamic(() => import("./components/ContactModal"));
import AnimatedSection from "./components/AnimatedSection";

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
  const [pageReady, setPageReady] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const logosData = useMemo(() => [
    { file: "Apple Developer Academy.png", name: "Apple Developer Academy" },
    { file: "Bank Indonesia.png", name: "Bank Indonesia" },
    { file: "BSI Scholarship.png", name: "BSI Scholarship" },
    { file: "CBP Rupiah.png", name: "CBP Rupiah" },
    { file: "PT Asuransi Kredit Indonesia.png", name: "Askrindo" },
    { file: "Startup Campus.png", name: "Startup Campus" }
  ], []);

  useEffect(() => {
    setPageReady(true);
  }, []);

  const homeLogoNodes = useMemo(() => logosData.map(({ file, name }) => {
    return {
      node: (
        <div className="flex flex-col items-center justify-center px-6 sm:px-8 transition-all duration-300 hover:scale-105 gap-2 sm:gap-3">
          <div className="h-7 sm:h-9 flex items-center justify-center">
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

  const navItems = [
    { id: "about", label: "About Me", href: "#about" },
    { id: "experiences", label: "Experiences", href: "#experiences" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "research", label: "Research", href: "#research" },
    { id: "organizations", label: "Organizations", href: "#organizations" },
    { id: "achievements", label: "Achievements", href: "#achievements" },
    { id: "contacts", label: "Get in Touch", href: "#contacts" },
  ];

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

  const openContactModal = () => {
    window.history.pushState({ contactModalOpen: true }, "");
    setIsContactOpen(true);
  };

  const achievementTargetById = useCallback((id: string) =>
    researchData.find((project) => project.id === id) ||
    projectsData.find((project) => project.id === id) ||
    experiencesData.find((project) => project.id === id) ||
    organizationsData.find((project) => project.id === id)
    , []);

  // Used by AchievementShelf to resolve linkedProjectId strings
  const findProject = useCallback((id: string) => achievementTargetById(id), [achievementTargetById]);



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
              colorStops={["#7cff67", "#B497CF", "#5227FF"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
        </div>
        <div className="mx-auto max-w-[1366px] min-h-[100svh] xl:min-h-screen px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl relative z-10 flex flex-col items-center justify-center text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 sm:gap-3 p-1 pr-4 sm:pr-5 rounded-full border border-white/10 bg-[#151515]/60 backdrop-blur-md mb-10 sm:mb-8">
              <span className="bg-white text-black text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wider">
                Based in
              </span>
              <span className="text-[#a1a1aa] text-xs sm:text-sm font-medium">
                Jakarta, Indonesia
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.1] mb-2 sm:mb-4 font-sans whitespace-nowrap">
              Maulana Raji Shofil Fuadi
            </h1>

            {/* Subtitle */}
            <h2 className="text-base sm:text-xl md:text-2xl font-medium text-[#a1a1aa] mb-10 sm:mb-12">
              Data Analyst & AI Enthusiast
            </h2>

            {/* CTAs */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full mb-16 px-4">
              <a href="#projects" className="relative px-4 py-2 sm:px-8 sm:py-3 text-xs sm:text-base bg-[var(--theme-accent)] text-[var(--theme-main)] font-bold rounded-full transition-all duration-300 whitespace-nowrap overflow-hidden group hover:scale-105 hover:shadow-[0_0_20px_var(--theme-accent)] active:scale-95">
                <span className="relative z-10">Explore Projects</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </a>
              <a href="#about" className="relative px-4 py-2 sm:px-8 sm:py-3 text-xs sm:text-base bg-white/5 text-white font-bold rounded-full border border-white/20 transition-all duration-300 whitespace-nowrap overflow-hidden group hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95">
                <span className="relative z-10">About Me</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </a>
            </div>


          </div>
        </div>

        {/* Hero Logos */}
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 w-full z-10">
          <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
            <p className="text-center text-[#a1a1aa] text-[9px] sm:text-[11px] uppercase tracking-widest font-semibold mb-5 sm:mb-6">Experiences & Affiliations</p>
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

      {/* NEW SECTION: ABOUT ME */}
      <AnimatedSection id="about" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">About Me</h2>
          <div className="bg-[#111111] border border-white/15 rounded-3xl p-5 sm:p-10 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-10">

              {/* ROW 1: Bio + Education */}
              {/* Bio: Left, 2/3 width */}
              <div className="space-y-6 lg:col-span-2">
                <p className="text-white leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg text-justify">
                  I turn numbers into decisions. My background is a unique blend of actuarial science, research nerd, and proven leadership. Driven by curiosity, I&apos;m always chasing the next frontier, currently pushing into AI automation.
                </p>
              </div>

              {/* Education: Right, 1/3 width */}
              <div className="space-y-2 sm:space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-lg sm:text-xl">Education</h3>
                <div className="cursor-pointer group bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(aboutModalData.education)}>
                  <div className="flex flex-row justify-between items-center gap-2">
                    <p className="font-medium text-white text-xs sm:text-sm truncate">Hasanuddin University</p>
                    <p className="text-white/60 text-[10px] sm:text-xs whitespace-nowrap shrink-0">Aug 2021 – Feb 2026</p>
                  </div>
                  <p className="text-white/80 text-[10px] sm:text-xs truncate">Bachelor of Actuarial Science</p>
                </div>
              </div>

              {/* ROW 2: Tech Stack, Certifications, Scholarships */}
              {/* Tech Stack */}
              <div className="hidden sm:block space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-lg sm:text-xl">Technical Stack</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {['Machine Learning', 'Predictive Modelling', 'n8n', 'SQL', 'R', 'Power BI', 'Looker Studio', 'Tableau', 'Excel', 'Canva'].map((skill) => (
                    <span key={skill} className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-sm text-white/90">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2 sm:space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-lg sm:text-xl">Certifications</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="cursor-pointer group bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(aboutModalData.cert_data_analyst)}>
                    <div className="flex flex-row justify-between items-center gap-2">
                      <p className="font-medium text-white text-xs sm:text-sm truncate">Data Analyst</p>
                      <p className="text-white/60 text-[10px] sm:text-xs whitespace-nowrap shrink-0">Oct 2024</p>
                    </div>
                    <p className="text-white/80 text-[10px] sm:text-xs truncate">National Professional Certification Agency</p>
                  </div>
                  <div className="cursor-pointer group bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(aboutModalData.cert_data_science)}>
                    <div className="flex flex-row justify-between items-center gap-2">
                      <p className="font-medium text-white text-xs sm:text-sm truncate">Data Science & AI</p>
                      <p className="text-white/60 text-[10px] sm:text-xs whitespace-nowrap shrink-0">Feb – Jun 2024</p>
                    </div>
                    <p className="text-white/80 text-[10px] sm:text-xs truncate">Startup Campus</p>
                  </div>
                </div>
              </div>

              {/* Scholarships */}
              <div className="space-y-2 sm:space-y-3 lg:col-span-1">
                <h3 className="text-[var(--theme-accent)] font-semibold text-lg sm:text-xl">Scholarships</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {[
                    { name: 'BSI Scholarship Prestasi', year: '2022', desc: 'Bank Syariah Indonesia', modalData: aboutModalData.schol_prestasi },
                    { name: 'BSI Scholarship Talenta', year: '2024', desc: 'Bank Syariah Indonesia', modalData: aboutModalData.schol_talenta },
                  ].map((s) => (
                    <div key={s.name} className="cursor-pointer group bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 space-y-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10" onClick={() => openProjectModal(s.modalData)}>
                      <div className="flex flex-row justify-between items-center gap-2">
                        <p className="font-medium text-white text-xs sm:text-sm truncate">{s.name}</p>
                        <p className="text-white/60 text-[10px] sm:text-xs whitespace-nowrap shrink-0">{s.year}</p>
                      </div>
                      <p className="text-white/80 text-[10px] sm:text-xs truncate">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 1. SECTION EXPERIENCES */}
      <AnimatedSection id="experiences" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {experiencesData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="organization" />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 2. SECTION PROJECTS */}
      <AnimatedSection id="projects" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Projects</h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain gap-4 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 scrollbar-hide md:overflow-visible">
            {projectsData.map((project) => (
              <div key={project.id} className="snap-center snap-always flex-none w-[80vw] sm:w-[45vw] md:w-auto">
                <ProjectCard project={project} onClick={openProjectModal} variant="default" />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 3. SECTION RESEARCH */}
      <AnimatedSection id="research" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Research</h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain gap-4 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-6 scrollbar-hide md:overflow-visible">
            {researchData.map((project) => (
              <div key={project.id} className="snap-center snap-always flex-none w-[80vw] sm:w-[45vw] md:w-auto">
                <ProjectCard project={project} onClick={openProjectModal} variant="research" />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 4. SECTION ORGANIZATIONS */}
      <AnimatedSection id="organizations" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {organizationsData.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={openProjectModal} variant="organization" />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 5. SECTION ACHIEVEMENTS */}
      <AnimatedSection id="achievements" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Achievements</h2>
          <AchievementShelf
            items={achievements}
            findProject={findProject}
            onOpenModal={openProjectModal}
          />
        </div>
      </AnimatedSection>

      {/* FOOTER */}
      <footer id="contacts" className="w-full mt-16 md:mt-28 border-t border-white/10 pt-8 md:pt-10 pb-6 flex flex-col scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] w-full px-4 sm:px-6">
          <div className="flex flex-row items-center justify-between w-full">
            {/* Left: Get in Touch */}
            <div className="flex justify-start">
              <h2 className="text-xl sm:text-3xl font-semibold text-white">Get in Touch</h2>
            </div>

            {/* Right: Social Icons */}
            <div className="flex justify-end">
              <div className="flex items-center gap-3 sm:gap-6 scale-[0.85] sm:scale-100 origin-right">
                <button onClick={openContactModal} className="transition-opacity hover:opacity-80" aria-label="Email Maulana">
                  <Image src="/assets/footer/mail.svg" alt="Email Logo" width={28} height={28} />
                </button>
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
          </div>

          <div className="mt-8 md:mt-16 w-full text-center">
            <p className="text-xs sm:text-sm text-[#dfdfdf] px-4 whitespace-nowrap">
              &copy; {new Date().getFullYear()}, Maulana Raji Shofil Fuadi.
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