"use client";
import { useState, useEffect } from "react";

export function useResponsive() {
  const [state, setState] = useState({ isMobile: false, isTablet: false, isDesktop: true, width: 1280 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setState({ isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024, width: w });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return state;
}
