import Image from "next/image";
import { Project } from "../data/portfolio";
import { LineCount } from "./useUniformLines";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  variant?: "default" | "research" | "organization";
  /** Default and research: shared line counts from useUniformLines, so every card in the section matches */
  lines?: { title: LineCount; desc: LineCount };
}

const clampClass = (n: LineCount) => (n === 2 ? "line-clamp-2" : "truncate");

export default function ProjectCard({ project, onClick, variant = "default", lines = { title: 1, desc: 1 } }: ProjectCardProps) {
  if (variant === "organization") {
    return (
      <button
        type="button"
        onClick={() => onClick(project)}
        aria-label={`Open details for ${project.title}`}
        data-card-id={project.id}
        className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-4 transition-all duration-300 active:scale-[0.98] hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:border-white/40 focus-visible:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)] flex items-center gap-4 w-full h-full"
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
      data-card-id={project.id}
      className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-3 transition-all duration-300 active:scale-[0.98] hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:border-white/40 focus-visible:shadow-[0_8px_32px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.12)] w-full h-full flex flex-col"
    >
      {/* 16:9 like every project screenshot (1920x1080), so the full shot shows at any card width; a fixed height cropped the sides */}
      {variant !== "research" && project.heroImage && (
        <div className="relative overflow-hidden rounded-2xl aspect-video w-full">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            // Hover brightens instead of zooming: a zoom crops the 16:9 shot again and softens its small text
            className="object-cover transition-[filter] duration-300 group-hover:brightness-[1.08] group-focus-visible:brightness-[1.08]"
            // Screenshots are full of small text and thin borders: 50 smeared them; 85 costs only ~2-6 KB more than 75 per image.
            // sizes matches the rendered card width, so the browser no longer pulls a full-viewport image
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 420px"
            quality={85}
          />
        </div>
      )}

      <div className={`px-2 flex-1 flex flex-col ${variant === 'research' ? 'pt-1 pb-1' : 'pt-4 pb-2'}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-white/60 truncate mr-2">{project.cardTag}</p>
          <p className="text-xs uppercase tracking-wide text-white/60 flex-shrink-0">{project.year}</p>
        </div>
        <h3
          data-uniform-lines="title"
          className={`mt-1 font-semibold text-white text-base sm:text-lg ${clampClass(lines.title)}`}
        >
          {project.title}
        </h3>
        <p
          data-uniform-lines="desc"
          className={`text-xs text-white/60 ${clampClass(lines.desc)} ${variant === 'research' ? 'mt-1' : 'mt-2'}`}
        >
          {project.shortDesc}
        </p>
      </div>
    </button>
  );
}
