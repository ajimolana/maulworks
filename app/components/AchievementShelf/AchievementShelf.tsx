"use client";

import { useState } from "react";
import { AchievementItem, Project } from "../../data/portfolio";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CategoryIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "Paper":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "Sports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M5.4 5.4c2.8 1.4 5.3 4 5.8 7.3" />
          <path d="M18.6 18.6c-2.8-1.4-5.3-4-5.8-7.3" />
        </svg>
      );
    case "Ambassador":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
      );
    case "Creative":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
  }
}



// ─── Single Row ────────────────────────────────────────────────────────────────

interface RowProps {
  item: AchievementItem;
  index: number;
  onClick?: () => void;
}

function AchievementRow({ item, index, onClick }: RowProps) {
  const isClickable = !!onClick;

  const inner = (
    <div
      className={`
        flex items-center gap-3 py-3
        border-b border-white/[0.06]
        transition-all duration-200
        group
        ${isClickable ? "cursor-pointer" : "cursor-default"}
        ${isClickable ? "hover:bg-white/[0.025] -mx-3 px-3 rounded-xl" : ""}
      `}
    >
      {/* Index number */}
      <span className="flex-none w-5 text-right text-[10px] tabular-nums text-white/20 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon */}
      <div className="flex-none text-white/35 group-hover:text-white/60 transition-colors">
        <CategoryIcon type={item.competitionType} className="w-4 h-4" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs sm:text-sm font-medium leading-tight truncate">
          {item.title}
        </p>
        <p className="text-white/40 text-[10px] sm:text-xs mt-0.5 truncate">
          {item.organizer}
        </p>
      </div>

      {/* Right: date + arrow */}
      <div className="flex-none flex items-center gap-2">
        <span className="text-white/30 text-[10px] tabular-nums whitespace-nowrap hidden xs:block sm:block">
          {item.date}
        </span>
        {isClickable && (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M7 7h10v10" />
          </svg>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left" aria-label={`View details for ${item.title}`}>
        {inner}
      </button>
    );
  }
  return <div>{inner}</div>;
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface AchievementShelfProps {
  items: AchievementItem[];
  findProject: (id: string) => Project | undefined;
  onOpenModal: (project: Project) => void;
}

const PAGE_SIZE = 5;

export default function AchievementShelf({ items, findProject, onOpenModal }: AchievementShelfProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  // On mobile: paginate. On desktop (md+): show all.
  const visibleItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="w-full">
      {/* ── Desktop: original box/card grid ── */}
      <div className="hidden md:grid md:grid-cols-5 gap-3">
        {items.map((item, i) => {
          const linked = item.linkedProjectId ? findProject(item.linkedProjectId) : undefined;
          const isClickable = !!linked;
          const handleClick = linked ? () => onOpenModal(linked) : undefined;

          const cardContent = (
            <div
              className={`
                group relative overflow-hidden rounded-2xl
                border border-white/10
                bg-white/[0.02]
                p-4 sm:p-5
                flex flex-col justify-between
                min-h-[140px] sm:min-h-[160px]
                transition-all duration-300 ease-out active:scale-[0.98]
                hover:border-white/35
                hover:bg-white/[0.04]
                hover:-translate-y-0.5
                hover:shadow-[0_8px_32px_rgba(255,255,255,0.04)]
                ${isClickable ? "cursor-pointer" : "cursor-default"}
              `}
            >
              <CategoryIcon
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
              <div className="relative z-10 mt-4">
                <p className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
                  {item.title}
                </p>
                <p className="text-white/50 text-xs mt-1.5 leading-snug truncate">
                  {item.organizer}
                </p>
                <p className="text-white/30 text-[10px] mt-2 tabular-nums">
                  {item.date}
                </p>
              </div>
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
                key={`ach-desk-${i}`}
                type="button"
                onClick={handleClick}
                aria-label={`View details for ${item.title}`}
                className="text-left"
              >
                {cardContent}
              </button>
            );
          }
          return <div key={`ach-desk-${i}`}>{cardContent}</div>;
        })}
      </div>

      {/* ── Mobile: paginated ── */}
      <div className="md:hidden">
        {visibleItems.map((item, i) => {
          const globalIndex = page * PAGE_SIZE + i;
          const linked = item.linkedProjectId ? findProject(item.linkedProjectId) : undefined;
          return (
            <AchievementRow
              key={`ach-mob-${globalIndex}`}
              item={item}
              index={globalIndex}
              onClick={linked ? () => onOpenModal(linked) : undefined}
            />
          );
        })}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-1">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 text-xs text-white/40 disabled:opacity-20 transition-opacity active:scale-95"
              aria-label="Previous page"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Prev
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${i === page ? "w-4 h-1.5 bg-white/70" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center gap-1.5 text-xs text-white/40 disabled:opacity-20 transition-opacity active:scale-95"
              aria-label="Next page"
            >
              Next
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
