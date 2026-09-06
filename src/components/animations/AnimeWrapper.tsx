'use client';

import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface AnimeRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  blur?: boolean;
}

export const AnimeReveal: React.FC<AnimeRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 600,
  direction = 'up',
  blur = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let translateYVal = 0;
    let translateXVal = 0;

    if (direction === 'up') translateYVal = 24;
    else if (direction === 'down') translateYVal = -24;
    else if (direction === 'left') translateXVal = 24;
    else if (direction === 'right') translateXVal = -24;

    animate(ref.current, {
      opacity: { from: 0.001, to: 1 },
      translateY: translateYVal ? { from: translateYVal, to: 0 } : 0,
      translateX: translateXVal ? { from: translateXVal, to: 0 } : 0,
      filter: blur ? { from: 'blur(8px)', to: 'blur(0px)' } : undefined,
      duration,
      delay,
      ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    } as any);
  }, [delay, duration, direction, blur]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

interface AnimeStaggerListProps {
  children: React.ReactNode;
  selector?: string;
  className?: string;
  staggerTime?: number;
  triggerKey?: any;
}

export const AnimeStaggerList: React.FC<AnimeStaggerListProps> = ({
  children,
  selector = '.stagger-item',
  className = '',
  staggerTime = 80,
  triggerKey,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(selector);
    if (!items.length) return;

    animate(items, {
      opacity: { from: 0.001, to: 1 },
      translateY: { from: 20, to: 0 },
      filter: { from: 'blur(6px)', to: 'blur(0px)' },
      duration: 550,
      delay: stagger(staggerTime, { start: 60 }),
      ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    } as any);
  }, [selector, staggerTime, triggerKey]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
