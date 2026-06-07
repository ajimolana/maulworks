"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'motion/react';
import {
  experiencesData,
  projectsData,
  researchData,
  organizationsData,
  achievements,
  Project,
  AchievementItem
} from '../../data/portfolio';

export type TimelineCategory = 'Education' | 'Experience' | 'Project' | 'Research' | 'Organization' | 'Achievement';

export type TimelineEvent = {
  id: string;
  category: TimelineCategory;
  title: string;
  dateStr: string;
  sortDate: Date;
  shortDesc: string;
  projectData?: Project;
  achievementData?: AchievementItem;
};

// Helper to reliably parse date strings
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();

  const firstPart = dateStr.split('-')[0].trim().toLowerCase();
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  let year = 1970;
  let month = 0;
  let day = 1;

  const yearMatch = firstPart.match(/\b(20\d{2})\b/);
  if (yearMatch) year = parseInt(yearMatch[1], 10);

  for (let i = 0; i < months.length; i++) {
    if (firstPart.includes(months[i])) {
      month = i;
      break;
    }
  }

  const dayMatch = firstPart.match(/\b([1-9]|[12]\d|3[01])\b/);
  if (dayMatch && dayMatch[1] !== (yearMatch ? yearMatch[1] : '')) {
    day = parseInt(dayMatch[1], 10);
  }

  return new Date(year, month, day);
};

// Calculate duration string (e.g. "2 yrs 6 mos")
const calculateDuration = (dateStr: string): string => {
  if (!dateStr.includes('-')) return '';
  const parts = dateStr.split('-');
  if (parts.length === 2) {
    const start = parseDate(parts[0]);
    const endStr = parts[1].trim().toLowerCase();
    const end = (endStr === 'present' || endStr === 'now' || endStr === '') ? new Date() : parseDate(parts[1]);

    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 0) return '';
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs > 0 && mos > 0) return `${yrs} yrs ${mos} mos`;
    if (yrs > 0) return `${yrs} yrs`;
    if (mos > 0) return `${mos} mos`;
  }
  return '';
};

const categoryColors: Record<TimelineCategory, string> = {
  Education: '#3b82f6', // blue
  Experience: '#10b981', // emerald
  Project: '#8b5cf6', // violet
  Research: '#f59e0b', // amber
  Organization: '#ec4899', // pink
  Achievement: '#eab308' // yellow
};

const categoryIcons: Record<TimelineCategory, string> = {
  Education: '🎓',
  Experience: '💼',
  Project: '🚀',
  Research: '🔬',
  Organization: '🤝',
  Achievement: '🏆'
};

interface TimelineProps {
  onOpenModal: (project: Project) => void;
}

const SortIcon = ({ order }: { order: 'newest' | 'oldest' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Up arrow — active when oldest first */}
    <path
      d="M8 2L5 6H11L8 2Z"
      fill="currentColor"
      opacity={order === 'oldest' ? 1 : 0.3}
      style={{ transition: 'opacity 0.2s' }}
    />
    {/* Down arrow — active when newest first */}
    <path
      d="M8 14L11 10H5L8 14Z"
      fill="currentColor"
      opacity={order === 'newest' ? 1 : 0.3}
      style={{ transition: 'opacity 0.2s' }}
    />
  </svg>
);

const AppleEmoji = ({ emoji, className = "w-4 h-4 inline-block" }: { emoji: string, className?: string }) => (
  <img src={`https://emojicdn.elk.sh/${emoji}?style=apple`} alt={emoji} className={className} loading="lazy" />
);

type TimelineItemType = { type: 'event', data: TimelineEvent, isLeft: boolean, isHidden?: boolean } | { type: 'year', year: string };

export default function Timeline({ onOpenModal }: TimelineProps) {
  const [activeFilter, setActiveFilter] = useState<TimelineCategory | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [canPageScroll, setCanPageScroll] = useState(true);
  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const lineProgress = useMotionValue(0);

  // Manual scroll tracking — bulletproof for any content height
  useEffect(() => {
    lineProgress.set(0);

    // Wait a frame for DOM to settle after filter change
    const raf = requestAnimationFrame(() => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = docHeight > viewportHeight + 10;
      setCanPageScroll(scrollable);
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        lineProgress.set(1);
        return;
      }
      lineProgress.set(Math.min(scrollY / maxScroll, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeFilter, lineProgress]);

  const timelineItems = useMemo(() => {
    const items: TimelineEvent[] = [];

    items.push({
      id: 'edu-unhas',
      category: 'Education',
      title: 'Bachelor of Actuarial Science',
      dateStr: 'Aug 2021 – Feb 2026',
      sortDate: parseDate('Aug 2021'),
      shortDesc: 'Hasanuddin University. GPA: 3.51/4.00',
    });

    experiencesData.forEach(exp => {
      items.push({
        id: exp.id,
        category: 'Experience',
        title: exp.title,
        dateStr: exp.period || exp.year,
        sortDate: parseDate(exp.period || exp.year),
        shortDesc: exp.shortDesc,
        projectData: exp,
      });
    });

    projectsData.forEach(proj => {
      items.push({
        id: proj.id,
        category: 'Project',
        title: proj.title,
        dateStr: proj.period || proj.year,
        sortDate: parseDate(proj.period || proj.year),
        shortDesc: proj.shortDesc,
        projectData: proj,
      });
    });

    researchData.forEach(res => {
      items.push({
        id: res.id,
        category: 'Research',
        title: res.title,
        dateStr: res.period || res.year,
        sortDate: parseDate(res.period || res.year),
        shortDesc: res.shortDesc,
        projectData: res,
      });
    });

    organizationsData.forEach(org => {
      items.push({
        id: org.id,
        category: 'Organization',
        title: org.title,
        dateStr: org.period || org.year,
        sortDate: parseDate(org.period || org.year),
        shortDesc: org.shortDesc,
        projectData: org,
      });
    });

    achievements.forEach((ach, index) => {
      items.push({
        id: `ach-${index}`,
        category: 'Achievement',
        title: ach.title,
        dateStr: ach.date,
        sortDate: parseDate(ach.date),
        shortDesc: `${ach.competitionType} • ${ach.organizer}`,
        achievementData: ach,
      });
    });

    // Sort chronologically based on sortOrder
    items.sort((a, b) =>
      sortOrder === 'newest'
        ? b.sortDate.getTime() - a.sortDate.getTime()
        : a.sortDate.getTime() - b.sortDate.getTime()
    );

    // Filter items based on active category
    const filteredItems = activeFilter === 'All'
      ? items
      : items.filter(item => item.category === activeFilter);

    const combinedItems: TimelineItemType[] = [];
    let currentYear = '';
    let visibleEventIndex = 0;

    filteredItems.forEach(event => {
      const eventYear = event.sortDate.getFullYear().toString();
      if (eventYear !== currentYear && eventYear !== '1970' && !isNaN(event.sortDate.getFullYear())) {
        combinedItems.push({ type: 'year', year: eventYear });
        currentYear = eventYear;
      }
      const isHidden = collapsedYears.has(eventYear);
      combinedItems.push({ type: 'event', data: event, isLeft: visibleEventIndex % 2 === 0, isHidden });
      if (!isHidden) {
        visibleEventIndex++;
      }
    });

    return combinedItems;
  }, [activeFilter, collapsedYears, sortOrder]);

  const handleClick = (event: TimelineEvent) => {
    if (event.category === 'Achievement') return;

    if (event.projectData) {
      onOpenModal(event.projectData);
    }
  };

  const categories: ('All' | TimelineCategory)[] = ['All', 'Education', 'Experience', 'Project', 'Research', 'Organization', 'Achievement'];

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Mobile Dropdown Filter + Sort */}
      <div className="md:hidden flex items-center justify-center gap-2 mb-10 px-4 relative z-30">
        <div className="relative flex-1 max-w-[280px]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white font-medium shadow-lg"
          >
            <span className="flex items-center gap-2">
              {activeFilter === 'All' ? 'All Categories' : <><AppleEmoji emoji={categoryIcons[activeFilter as TimelineCategory]} /> {activeFilter}</>}
            </span>
            <span className={`text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-30"
              >
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveFilter(cat);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors ${activeFilter === cat ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {cat === 'All' ? 'All Categories' : <span className="flex items-center gap-2"><AppleEmoji emoji={categoryIcons[cat as TimelineCategory]} /> {cat}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Sort Button */}
        <button
          onClick={() => setSortOrder(o => o === 'newest' ? 'oldest' : 'newest')}
          title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
          className="shrink-0 flex items-center justify-center w-[46px] h-[46px] rounded-xl bg-[#1a1a1a] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 shadow-lg"
        >
          <SortIcon order={sortOrder} />
        </button>
      </div>

      {/* Desktop Category Filters + Sort */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-2 mb-10 px-4 relative">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeFilter === cat
                ? 'bg-white/10 border-white/20 text-white shadow-lg'
                : 'bg-transparent border-white/5 text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
          >
            {cat === 'All' ? 'All' : <span className="flex items-center gap-1.5"><AppleEmoji emoji={categoryIcons[cat as TimelineCategory]} /> {cat}</span>}
          </button>
        ))}

        {/* Desktop Sort Button */}
        <button
          onClick={() => setSortOrder(o => o === 'newest' ? 'oldest' : 'newest')}
          title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
          className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-transparent border border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        >
          <SortIcon order={sortOrder} />
        </button>
      </div>

      <div ref={containerRef} className="relative wrap overflow-hidden px-4 sm:p-10 h-full w-full">
        {/* Timeline Line Background - Starts dynamically at the first year's exact center */}
        <div className="absolute border-white/10 border-l-[2px] left-[36px] sm:left-[60px] md:left-1/2 -translate-x-1/2 top-[56px] sm:top-[80px] bottom-0 z-0"></div>

        {/* Animated Line Fill */}
        <motion.div
          className="absolute border-white/80 border-l-[2px] left-[36px] sm:left-[60px] md:left-1/2 -translate-x-1/2 top-[56px] sm:top-[80px] bottom-0 origin-top z-0"
          style={canPageScroll ? { scaleY: lineProgress } : undefined}
          initial={{ scaleY: 0 }}
          animate={!canPageScroll ? { scaleY: 1 } : undefined}
          transition={!canPageScroll ? { duration: 1.2, ease: "easeOut" } : undefined}
        ></motion.div>

        {/* Wrapping the items in a key to force full fresh load animation when filter changes, avoiding layout bounces */}
        <div key={activeFilter} className="relative z-10 w-full">
          {timelineItems.map((item, index) => {
            if (item.type === 'year') {
              const isCollapsed = collapsedYears.has(item.year);
              const isFirst = index === 0;
              return (
                <motion.div
                  key={`year-${item.year}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className={`relative z-20 flex w-full ${isFirst ? 'my-4' : 'mt-6 mb-4 md:mt-10 lg:mt-14'}`}
                  style={{ minHeight: '32px' }}
                >
                  <button
                    onClick={() => {
                      setCollapsedYears(prev => {
                        const next = new Set(prev);
                        if (next.has(item.year)) next.delete(item.year);
                        else next.add(item.year);
                        return next;
                      });
                    }}
                    className="absolute left-[36px] sm:left-[60px] md:left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/20 px-5 py-1.5 rounded-full text-white/80 font-bold text-sm tracking-widest shadow-lg flex items-center justify-center z-20 whitespace-nowrap cursor-pointer"
                  >
                    {item.year}
                  </button>
                </motion.div>
              );
            }

            if (item.isHidden) return null;

            const event = item.data;
            const isLeft = item.isLeft;
            const color = categoryColors[event.category];
            const hasAction = event.category !== 'Achievement' && !!event.projectData;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                className={`relative z-20 group mb-4 md:-mb-4 lg:-mb-8 flex justify-start md:justify-between items-start md:items-center w-full transition-all duration-300 ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
              >
                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-5/12"></div>

                {/* Spacer to keep icon centered */}
                <div className="hidden md:block flex-grow mx-1 md:mx-2 lg:mx-3 order-1"></div>

                {/* Center/Left Icon Area */}
                <div className="relative z-20 flex items-center order-1 justify-center w-10 h-10 shrink-0 mt-2 md:mt-0">
                  {/* Mobile small dot */}
                  <div className="md:hidden relative z-20 w-3 h-3 rounded-full border border-[#111]" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                  {/* Desktop icon */}
                  <div className="hidden md:flex relative z-20 items-center justify-center bg-[#1a1a1a] w-10 h-10 rounded-full border-2 border-[#111] text-lg transition-transform duration-300 group-hover:scale-110" style={{ borderColor: color, boxShadow: `0 0 15px ${color}30` }}>
                    <AppleEmoji emoji={categoryIcons[event.category]} className="w-5 h-5" />
                  </div>
                </div>

                {/* Connector Line */}
                <div
                  className="hidden md:block h-[2px] opacity-20 flex-grow mx-1 md:mx-2 lg:mx-3 order-1 transition-all duration-300 group-hover:opacity-60"
                  style={{ backgroundColor: color }}
                ></div>

                {/* Content Card */}
                <div
                  onClick={() => handleClick(event)}
                  className={`order-1 w-[calc(100%-3.5rem)] md:w-5/12 ml-4 md:ml-0 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl bg-[#131313] border border-white/5 relative transition-all duration-300 overflow-hidden 
                    ${hasAction ? 'cursor-pointer hover:border-white/20 hover:bg-[#181818] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]' : ''}`}
                >
                  {/* Top Row: Category Pill & Date */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-1 rounded-md whitespace-nowrap shrink-0" style={{ backgroundColor: `${color}15`, color: color }}>
                      {event.category}
                    </span>

                    {event.dateStr.includes('-') && (
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-white/50 bg-white/5 px-1.5 sm:px-2 py-1 rounded-md whitespace-nowrap shrink-0">
                        {calculateDuration(event.dateStr)}
                      </span>
                    )}

                    <span className="text-[9px] sm:text-[10px] md:text-xs text-white/40 ml-auto font-medium text-right truncate">
                      {event.dateStr}
                    </span>
                  </div>

                  <h3 className="font-bold text-base md:text-lg text-white mb-2 leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs md:text-sm leading-relaxed text-white/60 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {event.shortDesc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

