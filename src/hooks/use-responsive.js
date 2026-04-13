import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

export function useResponsive() {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getScreenSize(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    screenSize,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  };
}

function getScreenSize(width) {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}