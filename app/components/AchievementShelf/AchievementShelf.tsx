"use client";

import { AchievementItem, Project } from "../../data/portfolio";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CategoryBackgroundSvg({ type, className }: { type: string, className?: string }) {
  switch (type) {
    case "Paper":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "Sports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M5.4 5.4c2.8 1.4 5.3 4 5.8 7.3" />
          <path d="M18.6 18.6c-2.8-1.4-5.3-4-5.8-7.3" />
        </svg>
      );
    case "Ambassador":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
      );
    case "Creative":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    case "Recognition":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
  }
}



// ─── Single Achievement Cell ───────────────────────────────────────────────────

interface CellProps {
  item: AchievementItem;
  onClick?: () => void;
  visible: boolean;
}

function AchievementCell({ item, onClick, visible }: CellProps) {
  const isClickable = !!onClick;

  const content = (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border border-white/10
        bg-white/[0.02]
        p-4 sm:p-5
        flex flex-col justify-between
        min-h-[140px] sm:min-h-[160px]
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        hover:border-white/35
        hover:bg-white/[0.04]
        hover:-translate-y-0.5
        hover:shadow-[0_8px_32px_rgba(255,255,255,0.04)]
        ${isClickable ? "cursor-pointer" : "cursor-default"}
      `}
    >
      {/* Background SVG icon — purely decorative */}
      <CategoryBackgroundSvg 
        type={item.competitionType} 
        className="
          pointer-events-none
          absolute -bottom-4 -right-4
          w-32 h-32 sm:w-40 sm:h-40
          text-white/[0.03]
          transition-colors duration-300
          group-hover:text-white/[0.05]
          -rotate-12
        "
      />

      {/* Top: category pill */}
      <div>
        <span className="
          inline-block text-[9px] uppercase tracking-widest
          border border-white/15 rounded-full
          px-2 py-0.5
          text-white/40
          bg-white/[0.03]
          font-medium
        ">
          {item.competitionType}
        </span>
      </div>

      {/* Bottom: info block */}
      <div className="relative z-10 mt-4">
        <p className="text-white font-semibold text-sm sm:text-base leading-tight">
          {item.title}
        </p>
        <p className="text-white/50 text-xs mt-1.5 leading-snug line-clamp-2">
          {item.organizer}
        </p>
        <p className="text-white/30 text-[10px] mt-2 tabular-nums">
          {item.date}
        </p>
      </div>

      {/* Hover glow edge — top border flash */}
      <div className="
        pointer-events-none
        absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-white/30 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      " />
    </div>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`View details for ${item.title}`}
        className="text-left w-full h-full"
      >
        {content}
      </button>
    );
  }
  return content;
}

// Removed FilterPills

// ─── Main Component ───────────────────────────────────────────────────────────

interface AchievementShelfProps {
  items: AchievementItem[];
  findProject: (id: string) => Project | undefined;
  onOpenModal: (project: Project) => void;
}

export default function AchievementShelf({ items, findProject, onOpenModal }: AchievementShelfProps) {
  return (
    <div className="w-full">
      {/* Achievement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {items.map((item, i) => {
          const linkedProject = item.linkedProjectId
            ? findProject(item.linkedProjectId)
            : undefined;
          const handleClick = linkedProject
            ? () => onOpenModal(linkedProject)
            : undefined;

          return (
            <AchievementCell
              key={`achievement-${i}`}
              item={item}
              onClick={handleClick}
              visible={true}
            />
          );
        })}
      </div>
    </div>
  );
}
