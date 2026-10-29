"use client";

import { useState } from "react";
import { AchievementItem, Project } from "../../data/portfolio";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CategoryIcon({ type, className, strokeWidth = 1.8 }: { type: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {iconPaths(type)}
    </svg>
  );
}

function iconPaths(type: string) {
  switch (type) {
    case "Paper":
      return (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </>
      );
    case "Sports":
      return (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M5.4 5.4c2.8 1.4 5.3 4 5.8 7.3" />
          <path d="M18.6 18.6c-2.8-1.4-5.3-4-5.8-7.3" />
        </>
      );
    case "Ambassador":
      return (
        <>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </>
      );
    case "Creative":
      return (
        <>
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </>
      );
    case "Recognition":
    default:
      return (
        <>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </>
      );
  }
}

// ─── Desktop Card ──────────────────────────────────────────────────────────────

function AchievementCard({ item, isClickable }: { item: AchievementItem; isClickable: boolean }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border border-white/10 bg-white/[0.02]
        p-4 sm:p-5
        flex flex-col justify-between h-full
        transition-all duration-300 ease-out active:scale-[0.98]
        hover:border-white/35 hover:bg-white/[0.04]
        group-focus-visible/ach:border-white/35 group-focus-visible/ach:bg-white/[0.04]
        hover:shadow-[0_8px_32px_rgba(255,255,255,0.04)]
        ${isClickable ? "cursor-pointer" : "cursor-default"}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest border border-white/15 rounded-full px-2 py-0.5 text-white/60 bg-white/[0.03] font-medium">
          <CategoryIcon type={item.competitionType} className="w-3 h-3 flex-none" />
          {item.competitionType}
        </span>
        {isClickable && (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 flex-none text-white/40 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M7 7h10v10" />
          </svg>
        )}
      </div>
      <div className="mt-4">
        <p className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-3">
          {item.title}
        </p>
        <p className="text-white/50 text-xs mt-1.5 leading-snug line-clamp-2">
          {item.organizer}
        </p>
        <p className="text-white/50 text-[11px] mt-2 tabular-nums">
          {item.date}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

// ─── Single Row ────────────────────────────────────────────────────────────────

interface RowProps {
  item: AchievementItem;
  onClick?: () => void;
}

function AchievementRow({ item, onClick }: RowProps) {
  const isClickable = !!onClick;

  const inner = (
    <div
      className={`
        flex items-center gap-3 py-3
        border-b border-white/[0.06]
        transition-all duration-200
        group
        ${isClickable ? "cursor-pointer" : "cursor-default"}
        ${isClickable ? "hover:bg-white/[0.025] group-focus-visible/row:bg-white/[0.05] -mx-3 px-3 rounded-xl" : ""}
      `}
    >
      {/* Icon */}
      <div className="flex-none text-white/50 group-hover:text-white/70 transition-colors" title={item.competitionType}>
        <CategoryIcon type={item.competitionType} className="w-4 h-4" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs sm:text-sm font-medium leading-tight truncate">
          {item.title}
        </p>
        {/* Organizer truncates first so the date always stays visible */}
        <p className="flex text-white/55 text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">
          <span className="truncate">{item.organizer}</span>
          <span className="flex-none tabular-nums">&nbsp;·&nbsp;{item.date}</span>
        </p>
      </div>

      {/* Right: arrow, only on rows that open a modal */}
      {isClickable && (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="flex-none w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      )}
    </div>
  );

  if (isClickable) {
    return (
      <button type="button" onClick={onClick} className="group/row w-full text-left rounded-xl focus-visible:outline-none" aria-label={`View details for ${item.title}`}>
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
      {/* ── Tablet/Desktop: card grid ── */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((item, i) => {
          const linked = item.linkedProjectId ? findProject(item.linkedProjectId) : undefined;
          const card = <AchievementCard item={item} isClickable={!!linked} />;
          if (!linked) return <div key={`ach-desk-${i}`}>{card}</div>;
          return (
            <button
              key={`ach-desk-${i}`}
              type="button"
              onClick={() => onOpenModal(linked)}
              aria-label={`View details for ${item.title}`}
              className="group/ach text-left rounded-2xl focus-visible:outline-none"
            >
              {card}
            </button>
          );
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
              className="flex items-center gap-1.5 min-h-11 px-2 -mx-2 text-sm text-white/60 disabled:opacity-20 transition-opacity active:scale-95"
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
                  aria-current={i === page ? "true" : undefined}
                  className="p-2.5 -m-1 group/dot"
                >
                  <span className={`block rounded-full transition-all duration-200 ${i === page ? "w-4 h-1.5 bg-white/70" : "w-1.5 h-1.5 bg-white/20 group-hover/dot:bg-white/40"}`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center gap-1.5 min-h-11 px-2 -mx-2 text-sm text-white/60 disabled:opacity-20 transition-opacity active:scale-95"
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
