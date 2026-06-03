import Image from "next/image";
import { Project } from "../data/portfolio";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  variant?: "default" | "research" | "organization";
}

export default function ProjectCard({ project, onClick, variant = "default" }: ProjectCardProps) {
  if (variant === "organization") {
    return (
      <button
        type="button"
        onClick={() => onClick(project)}
        aria-label={`Open details for ${project.title}`}
        className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/70 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] flex items-center gap-4"
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.18)' }} />

        {project.logo && (
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 relative">
            <Image src={project.logo} alt={project.title} fill className="object-contain" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-white/60 truncate mr-2">{project.cardTag}</p>
            <p className="text-xs uppercase tracking-wide text-white/60 flex-shrink-0">{project.year}</p>
          </div>
          <h3 className="mt-1 text-base sm:text-lg font-semibold text-white truncate">{project.title}</h3>
          <p className="mt-1 text-xs text-white/60 truncate">{project.shortDesc}</p>
        </div>
      </button>
    );
  }

  // default and research variations
  return (
    <button
      type="button"
      onClick={() => onClick(project)}
      aria-label={`Open details for ${project.title}`}
      className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/70 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.18)' }} />

      {variant !== "research" && project.heroImage && (
        <div className="relative overflow-hidden rounded-2xl h-56 w-full">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            quality={50}
          />
        </div>
      )}

      <div className={`px-2 ${variant === 'research' ? 'pt-1 pb-1' : 'pt-4 pb-2'}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-white/60">{project.cardTag}</p>
          <p className="text-xs uppercase tracking-wide text-white/60">{project.year}</p>
        </div>
        <h3 className={`mt-1 font-semibold text-white truncate ${variant === 'research' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl lg:text-xl'}`}>
          {project.title}
        </h3>
        <p className={`mt-2 text-xs text-white/60 truncate ${variant === 'research' ? 'mt-1' : 'mt-2'}`}>
          {project.shortDesc}
        </p>
      </div>
    </button>
  );
}
