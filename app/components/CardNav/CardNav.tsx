'use client'

import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import GlassSurface from '../GlassSurface/GlassSurface';

const hexToRgba = (hex: string, alpha: number) => {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const value = parseInt(cleaned, 16);
  if (Number.isNaN(value) || cleaned.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  openInNewTab?: boolean;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  forceClose?: boolean;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  title,
  ctaLabel,
  ctaHref,
  forceClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const collapsedWidthRef = useRef<number>(180); // Diperkecil dari 280
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLButtonElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const getExpandedWidth = () => Math.min(window.innerWidth * 0.9, 400); // Ini untuk lebar cardnya waktu diexpand

  const measureCollapsedWidth = () => {
    const titleWidth = titleRef.current?.getBoundingClientRect().width || 0;
    const extraPadding = 24; // Padding diperkecil dari 40
    return Math.max(Math.ceil(titleWidth + extraPadding), 180); // Diperkecil dari 280
  };

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 200; // ini untuk ubah height expand

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 10; // Ini untuk atur jarak Sub-Header dan Label
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 200; // ini untuk ubah height expand
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    const containerEl = containerRef.current;
    if (!navEl || !containerEl) return null;

    gsap.set(containerEl, { width: collapsedWidthRef.current });
    gsap.set(navEl, { height: 50, overflow: 'hidden' }); // Diperkecil dari 60
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(
      containerEl,
      {
        width: getExpandedWidth(),
        duration: 0.4,
        ease
      },
      0
    );

    tl.to(
      navEl,
      {
        height: calculateHeight,
        duration: 0.4,
        ease
      },
      0
    );

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    setIsReady(true);
    
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const width = measureCollapsedWidth();
    collapsedWidthRef.current = width;
    setContainerWidth(width);
  }, []);

  useLayoutEffect(() => {
    if (!isExpanded) {
      const width = measureCollapsedWidth();
      collapsedWidthRef.current = width;
      setContainerWidth(width);
    }
  }, [isExpanded, title]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        setContainerWidth(getExpandedWidth());
      } else {
        const width = measureCollapsedWidth();
        collapsedWidthRef.current = width;
        setContainerWidth(width);
      }

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        gsap.set(containerRef.current, { width: getExpandedWidth() });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        gsap.set(containerRef.current, { width: collapsedWidthRef.current });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  useEffect(() => {
    if (forceClose && isExpanded) {
      setIsExpanded(false);
      if (tlRef.current) {
        tlRef.current.kill();
      }
      
      const width = measureCollapsedWidth();
      collapsedWidthRef.current = width;
      setContainerWidth(width);
      
      gsap.set(containerRef.current, { width });
      gsap.set(navRef.current, { height: 50 });
      gsap.set(cardsRef.current, { y: 50, opacity: 0 });
      
      const newTl = createTimeline();
      if (newTl) tlRef.current = newTl;
    }
  }, [forceClose, isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsExpanded(true);
      tl.timeScale(1);
      tl.play(0);
    } else {
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.timeScale(1.6);
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      ref={containerRef}
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 z-[99] bottom-4 lg:bottom-auto lg:top-[2em] will-change-[width] ${className} ${!isReady ? 'invisible' : 'visible'}`}
      style={containerWidth ? { width: `${containerWidth}px` } : undefined}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[50px] p-0 rounded-2xl shadow-md relative overflow-hidden will-change-[height]`} // Diperkecil dari h-60px
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={18}
          opacity={0.85}
          backgroundOpacity={0.08}
          className="absolute inset-0"
        />
        <div className="card-nav-top absolute inset-x-0 top-0 h-[50px] flex items-center justify-center md:justify-between p-2 pl-2 md:pl-[1.1rem] z-[2]">
          <div className="logo-container flex items-center justify-center w-full md:w-auto md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            {title ? (
              <button
                type="button"
                onClick={toggleMenu}
                aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                className="logo px-3 text-[13px] font-semibold tracking-[-0.02em] text-white whitespace-nowrap cursor-pointer text-center"
                ref={titleRef}
              >
                {title}
              </button>
            ) : (
              <img src={logo} alt={logoAlt} className="logo h-[28px]" />
            )}
          </div>

          {ctaLabel && ctaHref ? (
            <a
              className="card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[50px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[50px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
              style={{ color: item.textColor }}
            >
              <div
                className="w-full h-full items-stretch justify-start rounded-[calc(0.75rem-0.2rem)] shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                style={{ backgroundColor: hexToRgba('#1b1e23', 0.9) }}
              >
                <div className="flex flex-col gap-2 h-full w-full p-[12px_16px]">
                  <div className="nav-card-label font-normal tracking-[-0.5px] text-[16px] md:text-[20px]">
                    {item.label}
                  </div>
                  <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                    {item.links?.map((lnk, i) => (
                      <a
                        key={`${lnk.label}-${i}`}
                        className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px]"
                        href={lnk.href}
                        aria-label={lnk.ariaLabel}
                        target={lnk.openInNewTab ? "_blank" : undefined}
                        rel={lnk.openInNewTab ? "noreferrer" : undefined}
                        onClick={() => {
                          if (isExpanded) {
                            toggleMenu();
                          }
                        }}
                      >
                        <GoArrowUpRight className="nav-card-link-icon shrink-0" aria-hidden="true" />
                        {lnk.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;