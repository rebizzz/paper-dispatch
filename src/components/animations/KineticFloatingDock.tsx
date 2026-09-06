'use client';

import React, { useEffect, useState, useRef } from 'react';
import { animate, spring } from 'animejs';
import { ArrowUp, Share2, Check, Sparkles } from 'lucide-react';

export const KineticFloatingDock: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const dockRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const upBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(currentProgress);
        setVisible(window.scrollY > 280);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!dockRef.current) return;
    if (visible) {
      animate(dockRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.92, 1],
        duration: 450,
        ease: spring({ bounce: 0.35, duration: 500 }),
      });
    } else {
      animate(dockRef.current, {
        opacity: [1, 0],
        translateY: [0, 20],
        scale: [1, 0.92],
        duration: 300,
        ease: 'easeOutQuad',
      });
    }
  }, [visible]);

  useEffect(() => {
    if (circleRef.current) {
      const radius = 18;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - scrollProgress * circumference;
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [scrollProgress]);

  const scrollToTop = () => {
    if (upBtnRef.current) {
      animate(upBtnRef.current, {
        scale: [1, 0.75, 1.2, 1],
        duration: 500,
        ease: spring({ bounce: 0.55 }),
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sharePost = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  if (!visible && scrollProgress === 0) return null;

  return (
    <div
      ref={dockRef}
      aria-label="Kinetic Reading Dock"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 rounded-full border border-paper-border bg-paper-card/90 p-1.5 shadow-xl backdrop-blur-md transition-all hover:border-paper-borderHover scale-90 sm:scale-100 origin-bottom-right"
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <svg className="h-10 w-10 -rotate-90 transform" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-paper-border fill-none"
            strokeWidth="3"
          />
          <circle
            ref={circleRef}
            cx="22"
            cy="22"
            r="18"
            className="stroke-paper-coral fill-none transition-[stroke-dashoffset] duration-150"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-mono text-[10px] font-semibold text-paper-ink">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

      <button
        ref={upBtnRef}
        onClick={scrollToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
        className="flex h-9 w-9 items-center justify-center rounded-full text-paper-textSubtle transition-all hover:bg-paper-subtle hover:text-paper-ink active:scale-90"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <button
        onClick={sharePost}
        title="Copy article link"
        aria-label="Copy article link"
        className="flex h-9 w-9 items-center justify-center rounded-full text-paper-textSubtle transition-all hover:bg-paper-subtle hover:text-paper-coral active:scale-90"
      >
        {copied ? (
          <Check className="h-4 w-4 text-paper-green" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
