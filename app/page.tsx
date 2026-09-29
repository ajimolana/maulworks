"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import PillNav from "./components/PillNav/PillNav";
import dynamic from "next/dynamic";
import { getHomeLogos } from "./actions";

const Aurora = dynamic(() => import("./components/Aurora/Aurora"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-main)] via-[var(--theme-bg-gradient)] to-[var(--theme-main)] opacity-80" />
});
const LogoLoop = dynamic(() => import("./components/LogoLoop/LogoLoop"));
const ProjectCard = dynamic(() => import("./components/ProjectCard"));
const ProjectModal = dynamic(() => import("./components/ProjectModal"));
const Lightbox = dynamic(() => import("./components/Lightbox"));
const AchievementShelf = dynamic(() => import("./components/AchievementShelf/AchievementShelf"));

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
  const [logoFiles, setLogoFiles] = useState<string[]>([]);

  useEffect(() => {
    setPageReady(true);
    getHomeLogos().then(setLogoFiles);
  }, []);

  const homeLogoNodes = useMemo(() => logoFiles.map((filename) => {
    const name = filename.replace(/\.[^/.]+$/, ""); // Remove extension
    return {
      node: (
        <div className="flex flex-col items-center justify-center px-8 transition-all duration-300 hover:scale-105 gap-3">
          <div className="h-10 sm:h-12 flex items-center justify-center">
            <img
              src={`/assets/homeLogos/${filename}`}
              alt={name}
              className="h-full w-auto object-contain select-none [-webkit-user-drag:none]"
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-sm font-medium text-white/80 whitespace-nowrap font-sans tracking-tight">{name}</span>
        </div>
      ),
      title: name
    };
  }), [logoFiles]);

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

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.1] mb-8 font-sans">
              Maulana Raji Shofil Fuadi
            </h1>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 p-1 pr-5 rounded-full border border-white/10 bg-[#151515]/60 backdrop-blur-md mb-12">
              <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Based in
              </span>
              <span className="text-[#a1a1aa] text-sm font-medium">
                Jakarta, Indonesia
              </span>
            </div>


          </div>
        </div>

        {/* Hero Logos */}
        <div className="absolute bottom-8 left-0 right-0 w-full z-10">
          <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
            <p className="text-center text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-6">Experiences & Affiliations</p>
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
      <section id="about" className="w-full mt-20 scroll-mt-24 md:scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">About Me</h2>
          <div className="bg-[#111111] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ROW 1: Bio + Education */}
              {/* Bio: Left, 2/3 width */}
              <div className="space-y-6 lg:col-span-2">
                <p className="text-white leading-relaxed text-base sm:text-lg">
                  I turn numbers into decisions. My background is a unique blend of actuarial science, research nerd, and proven leadership. Driven by curiosity, I'm always chasing the next frontier, currently pushing into AI automation.
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
          <AchievementShelf
            items={achievements}
            findProject={findProject}
            onOpenModal={openProjectModal}
          />
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

            {/* Right: Request CV */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end">
              <a href="mailto:maulanarajisf@gmail.com?subject=Request%20for%20CV&body=Hello%20Maulana%2C%0D%0A%0D%0AI'm%20%5BYour%20Name%5D%20from%20%5BCompany%2FOrganization%5D.%20I%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0D%0A%0D%0AThank%20you." className="px-8 py-3 bg-[var(--theme-accent)] text-[var(--theme-main)] font-bold rounded-full hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                Request CV
              </a>
            </div>
          </div>

          <div className="mt-12 md:mt-16 w-full text-center">
            <p className="text-sm text-[#dfdfdf] px-4">
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
    </div>
  );
}