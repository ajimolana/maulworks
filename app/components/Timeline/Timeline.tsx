"use client";

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
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

// Helper to reliably parse date strings like "22 Apr 2025 - 1 Aug 2025", "May 2026", "2024"
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  // Take the first part of a date range
  const firstPart = dateStr.split('-')[0].trim();
  
  const parsed = new Date(firstPart);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  // Fallback if parsing fails
  return new Date(0);
};

// Map categories to colors
const categoryColors: Record<TimelineCategory, string> = {
  Education: '#3b82f6', // blue-500
  Experience: '#10b981', // emerald-500
  Project: '#8b5cf6', // violet-500
  Research: '#f59e0b', // amber-500
  Organization: '#ec4899', // pink-500
  Achievement: '#eab308' // yellow-500
};

// Map categories to icons (using simple SVG or text)
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

export default function Timeline({ onOpenModal }: TimelineProps) {
  const events = useMemo(() => {
    const items: TimelineEvent[] = [];

    // 1. Education (Manual Entry)
    items.push({
      id: 'edu-unhas',
      category: 'Education',
      title: 'Bachelor of Actuarial Science',
      dateStr: 'Aug 2021 – Feb 2026',
      sortDate: parseDate('Aug 2021'),
      shortDesc: 'Hasanuddin University. GPA: 3.51/4.00',
    });

    // 2. Experiences
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

    // 3. Projects
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

    // 4. Research
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

    // 5. Organizations
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

    // 6. Achievements
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

    // Sort chronologically (oldest to newest)
    return items.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  }, []);

  // Helper to handle clicks
  const handleClick = (item: TimelineEvent) => {
    // Open project modal if it has projectData
    if (item.projectData) {
      onOpenModal(item.projectData);
    } else if (item.achievementData && item.achievementData.href?.startsWith('#')) {
      // If achievement links to a project modal
      const targetId = item.achievementData.href.slice(1);
      const allProjects = [...experiencesData, ...projectsData, ...researchData, ...organizationsData];
      const targetProject = allProjects.find(p => p.id === targetId);
      if (targetProject) {
        onOpenModal(targetProject);
      }
    } else if (item.achievementData && item.achievementData.href) {
      // External link
      window.open(item.achievementData.href, '_blank');
    }
  };

  return (
    <div className="relative wrap overflow-hidden p-2 sm:p-10 h-full max-w-5xl mx-auto">
      {/* Center Line (Hidden on small screens, shown on md+) */}
      <div className="hidden md:block absolute border-opacity-20 border-white h-full border" style={{ left: '50%' }}></div>

      {events.map((event, index) => {
        const isLeft = index % 2 === 0;
        const color = categoryColors[event.category];
        const hasAction = !!event.projectData || !!event.achievementData?.href;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`mb-8 flex justify-between items-center w-full ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} flex-col`}
          >
            {/* Empty space for alternating layout */}
            <div className="hidden md:block w-5/12"></div>
            
            {/* Center Icon */}
            <div className="z-20 hidden md:flex items-center order-1 bg-[#1a1a1a] shadow-xl w-10 h-10 rounded-full border-2 border-[#111] justify-center text-xl shrink-0" style={{ borderColor: color }}>
              {categoryIcons[event.category]}
            </div>

            {/* Content Card */}
            <div 
              onClick={() => handleClick(event)}
              className={`order-1 w-full md:w-5/12 px-6 py-5 rounded-2xl bg-[#111111] border border-white/10 relative transition-all duration-300 ${hasAction ? 'cursor-pointer hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)]' : ''}`}
            >
              {/* Mobile icon & category label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="md:hidden text-lg">{categoryIcons[event.category]}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/5" style={{ color }}>
                  {event.category}
                </span>
                <span className="text-xs text-white/50 ml-auto font-medium">
                  {event.dateStr}
                </span>
              </div>

              <h3 className="font-bold text-lg text-white mb-1 leading-snug">
                {event.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {event.shortDesc}
              </p>
              
              {hasAction && (
                <div className="mt-4 flex items-center text-xs font-semibold uppercase tracking-wide text-white/40 group-hover:text-white/80 transition-colors">
                  View Details &rarr;
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
