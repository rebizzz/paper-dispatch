'use client';

import React, { useEffect, useRef } from 'react';
import { animate, spring } from 'animejs';
import { isReducedMotion } from '@/lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  y = 20,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isReducedMotion()) {
      el.style.opacity = '1';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animate(el, {
          opacity: [0, 1],
          translateY: [y, 0],
          duration: 700,
          delay,
          ease: spring({ bounce: 0.22, duration: 700 }),
        });
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={`opacity-0 will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
