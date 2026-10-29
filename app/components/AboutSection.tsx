"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { aboutModalData, scholarships, techStack, Project } from "../data/portfolio";

const groupLabelClass = "text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-white/60";

// Rows instead of cards: groups of 1 or 2 items leave no empty boxes
// onClick is optional: rows without a detail modal render as plain, non-interactive text
function InfoRow({ title, meta, subtitle, onClick }: { title: string; meta: string; subtitle: string; onClick?: () => void }) {
  const content = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium text-white text-sm sm:text-base truncate">{title}</p>
        <p className="text-white/50 text-[11px] sm:text-xs tabular-nums whitespace-nowrap shrink-0">{meta}</p>
      </div>
      <p className="text-white/60 text-xs sm:text-sm truncate mt-0.5">{subtitle}</p>
    </>
  );

  if (!onClick) return <div className="py-2">{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open details for ${title}`}
      className="w-[calc(100%+1.5rem)] text-left -mx-3 px-3 py-2 rounded-xl transition-colors duration-200 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:bg-white/[0.05] active:scale-[0.99]"
    >
      {content}
    </button>
  );
}

function RowGroup({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`pt-4 first:pt-0 border-t border-white/10 first:border-t-0 ${className}`}>
      <h3 className={`${groupLabelClass} mb-1`}>{label}</h3>
      {children}
    </div>
  );
}

// Below sm the label stacks over the tools so each tool list stays on one line
function TechStackRows() {
  return (
    <>
      {techStack.map(({ group, items }) => (
        <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4 py-1.5 sm:py-2">
          <p className="sm:w-32 flex-none text-white/60 text-xs sm:text-sm">{group}</p>
          <p className="flex-1 min-w-0 font-medium text-white text-sm sm:text-base">{items.join(" · ")}</p>
        </div>
      ))}
    </>
  );
}

export default function AboutSection({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const [bioOpen, setBioOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  return (
    <AnimatedSection id="about" className="w-full mt-12 md:mt-20 scroll-mt-24 md:scroll-mt-28">
      <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">About Me</h2>
        <div className="bg-[#111111] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
          {/* Profile header (portrait + name + field), bio full width below */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Head-and-shoulders crop of the LinkedIn photo (opaque cream backdrop); the light fill only shows while it loads */}
            <div className="relative flex-none w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-neutral-200">
              <Image src="/assets/about/portrait.png" alt="Maulana Raji Shofil Fuadi" fill sizes="64px" quality={90} className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-base sm:text-xl leading-tight truncate">Maulana Raji Shofil Fuadi</p>
              {/* Current role only, the first part of the LinkedIn headline: Apple Developer Academy is in Education right below and the field is in the hero */}
              <p className="text-white/60 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">Reinsurance Data Analyst Intern @Askrindo</p>
            </div>
          </div>
          {/* Opening quote is the one tagline; the bio below is plain facts. Same text and order as the LinkedIn About */}
          {/* Phone shows only the quote with an inline "more", social-caption style; tapping the open bio collapses it. sm+ always shows the full bio */}
          <p className="mt-3 sm:mt-5 text-white/80 italic leading-relaxed text-sm sm:text-lg">
            &ldquo;I turn numbers into decisions.&rdquo;{" "}
            {!bioOpen && (
              <button
                type="button"
                onClick={() => setBioOpen(true)}
                aria-expanded={false}
                aria-controls="about-bio"
                className="sm:hidden not-italic font-medium text-white/50 hover:text-white transition-colors"
              >
                more
              </button>
            )}
          </p>
          <p id="about-bio" onClick={() => setBioOpen(false)} className={`${bioOpen ? "block" : "hidden sm:block"} mt-2 sm:mt-3 text-white leading-relaxed text-sm sm:text-lg text-pretty`}>
            Actuarial Science graduate from Hasanuddin University focused on data analytics, building projects from forecasting to automation, with a proven record in leadership, organizations, and competitions.
          </p>

          {/* Two columns of near-equal rows (5 left, 4 right) so they end close to level */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10">
            <div className="space-y-4">
              <RowGroup label="Education">
                <InfoRow title="Apple Developer Academy" meta="2027" subtitle="Incoming Learner, Cohort 2027 @ UC, Jakarta" />
                <InfoRow title="Hasanuddin University" meta="2021 – 2026" subtitle="Bachelor of Actuarial Science" onClick={() => onOpenProject(aboutModalData.education)} />
              </RowGroup>
              {/* Class on RowGroup itself, not a wrapper: a wrapper makes it first:-child and drops its divider and top padding */}
              <RowGroup label="Tech Stack" className="hidden lg:block">
                <TechStackRows />
              </RowGroup>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0">
              <RowGroup label="Certifications">
                <InfoRow title="Data Analyst" meta="Oct 2025" subtitle="National Professional Certification Agency" onClick={() => onOpenProject(aboutModalData.cert_data_analyst)} />
                <InfoRow title="Data Science & AI" meta="Feb – Jun 2024" subtitle="Startup Campus" onClick={() => onOpenProject(aboutModalData.cert_data_science)} />
              </RowGroup>
              <RowGroup label="Scholarships">
                {scholarships.map((s) => (
                  <InfoRow key={s.name} title={s.name} meta={s.year} subtitle={s.desc} onClick={() => onOpenProject(aboutModalData[s.modalKey])} />
                ))}
              </RowGroup>
            </div>

            {/* Single column: Tech Stack moves to the bottom, collapsed, so it doesn't add scroll length */}
            {/* -my-2.5 keeps the 44px tap target without adding visible space under the label */}
            <div className="lg:hidden border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setStackOpen((o) => !o)}
                aria-expanded={stackOpen}
                aria-controls="about-stack"
                className="w-full flex items-center justify-between min-h-11 -my-2.5 text-left"
              >
                <span className={groupLabelClass}>Tech Stack</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-4 h-4 text-white/50 transition-transform duration-200 ${stackOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {stackOpen && (
                <div id="about-stack" className="mt-1">
                  <TechStackRows />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
