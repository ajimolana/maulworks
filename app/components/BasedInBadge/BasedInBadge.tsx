"use client";

import React, { useRef, useState, useEffect } from "react";

export default function BasedInBadge() {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [pillWidth, setPillWidth] = useState(75); // Fallback
  
  const pillRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure the actual width of the pill on mount
  useEffect(() => {
    if (pillRef.current) {
      setPillWidth(pillRef.current.offsetWidth);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - dragOffset);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    // Calculate how much space we have to drag
    // Container width minus pill width minus left/right padding (8px)
    const maxDrag = containerRef.current 
      ? containerRef.current.offsetWidth - pillWidth - 8 
      : 120;

    let newOffset = e.clientX - startX;
    
    // Constrain the drag
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxDrag) newOffset = maxDrag;
    
    setDragOffset(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Snap back when let go
    setDragOffset(0);
  };

  const springTransition = isDragging 
    ? 'none' 
    : 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center gap-3 p-1 pr-5 rounded-full border border-white/10 bg-[#151515]/60 backdrop-blur-md mb-12 select-none overflow-hidden"
    >
      {/* HIDDEN PLACEHOLDERS for exact layout sizing */}
      <span className="opacity-0 pointer-events-none text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
        Based in
      </span>
      <span className="text-[#a1a1aa] text-sm font-medium relative z-0 mr-2">
        Jakarta, Indonesia
      </span>

      {/* WHITE SCROLL (expands as you drag) */}
      <div 
        className="absolute left-1 top-1 bottom-1 bg-white rounded-full flex items-center overflow-hidden z-10"
        style={{ 
          width: `${pillWidth + dragOffset}px`,
          transition: springTransition
        }}
      >
        <span 
          className="absolute text-black font-black text-sm tracking-widest whitespace-nowrap"
          style={{ 
            // Position it right behind the moving pill
            right: `${pillWidth - 10}px`,
            opacity: dragOffset > 20 ? Math.min((dragOffset - 20) / 40, 1) : 0,
            transform: `translateX(${dragOffset > 0 ? 0 : -20}px)`,
            transition: isDragging ? 'none' : 'all 0.3s ease'
          }}
        >
          OLLO!
        </span>
      </div>

      {/* DRAGGABLE PILL */}
      <span 
        ref={pillRef}
        className="absolute left-1 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider cursor-grab active:cursor-grabbing z-20 touch-none shadow-[2px_0_10px_rgba(0,0,0,0.05)]"
        style={{ 
          transform: `translateX(${dragOffset}px)`,
          transition: springTransition
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        Based in
      </span>
    </div>
  );
}
