"use client";

import { useState, useEffect } from "react";

export function usePerformanceMode() {
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      const storedPref = localStorage.getItem("performanceMode");
      if (storedPref) {
        setIsLowPerformanceMode(storedPref === "low");
        return;
      }

      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const isLowEndHardware = hardwareConcurrency < 4;
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setIsLowPerformanceMode(prefersReducedMotion || (isLowEndHardware && isMobile));
    };

    checkPerformance();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      const storedPref = localStorage.getItem("performanceMode");
      if (storedPref) return;
      if (e.matches) setIsLowPerformanceMode(true);
      else checkPerformance();
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const togglePerformanceMode = () => {
    setIsLowPerformanceMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("performanceMode", newMode ? "low" : "high");
      return newMode;
    });
  };

  return { isLowPerformanceMode, togglePerformanceMode };
}
