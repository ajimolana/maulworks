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
        className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-4 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)] flex items-center gap-4 w-full h-full"
      >

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
          <p className="mt-1 text-xs text-white/60 line-clamp-2 sm:line-clamp-1">{project.shortDesc}</p>
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
      className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-3 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)] w-full h-full flex flex-col"
    >
      {variant !== "research" && project.heroImage && (
        <div className="relative overflow-hidden rounded-2xl h-48 sm:h-56 w-full">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            quality={50}
          />
        </div>
      )}

      <div className={`px-2 flex-1 flex flex-col ${variant === 'research' ? 'pt-1 pb-1' : 'pt-4 pb-2'}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-white/60 truncate mr-2">{project.cardTag}</p>
          <p className="text-xs uppercase tracking-wide text-white/60 flex-shrink-0">{project.year}</p>
        </div>
        <h3 className={`mt-1 font-semibold text-white ${variant === 'research' ? 'line-clamp-2 md:truncate md:block text-base sm:text-lg min-h-[3rem] sm:min-h-[3.5rem] md:min-h-0' : 'truncate text-lg sm:text-xl lg:text-xl'}`}>
          {project.title}
        </h3>
        <p className={`text-xs text-white/60 truncate ${variant === 'research' ? 'mt-1' : 'mt-2'}`}>
          {project.shortDesc}
        </p>
      </div>
    </button>
  );
}
