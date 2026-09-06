'use client';

import React, { useEffect, useRef } from 'react';
import { animate, createTimeline, spring, stagger } from 'animejs';
import { siteConfig, profileConfig } from '@/site.config';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const secondaryBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.hero-element');

    const tl = createTimeline();

    tl.add(elements, {
      opacity: [0.001, 1],
      translateY: [24, 0],
      scale: [0.98, 1],
      filter: ['blur(8px)', 'blur(0px)'],
      duration: 600,
      delay: stagger(100, { start: 40 }),
      ease: spring({ bounce: 0.3, duration: 650 }),
    });

    const floatingPill = containerRef.current.querySelector('.status-pill');
    if (floatingPill) {
      animate(floatingPill, {
        translateY: [-2, 2],
        duration: 2400,
        alternate: true,
        loop: true,
        ease: 'easeInOutQuad',
      });
    }
  }, []);

  const handleBtnHover = (btn: HTMLAnchorElement | null) => {
    if (!btn) return;
    animate(btn, {
      scale: 1.04,
      duration: 300,
      ease: spring({ bounce: 0.45 }),
    });
  };

  const handleBtnLeave = (btn: HTMLAnchorElement | null) => {
    if (!btn) return;
    animate(btn, {
      scale: 1,
      duration: 300,
      ease: spring({ bounce: 0.2 }),
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-10 pb-12 sm:pt-16 sm:pb-16"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Status pill */}
        <div className="hero-element status-pill opacity-0 inline-flex max-w-full items-center gap-2 rounded-full border border-paper-border bg-paper-subtle px-3 py-1 text-xs text-paper-textSubtle mb-6">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper-coral opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-paper-coral" />
          </span>
          <span className="font-mono text-[11px] text-paper-textSubtle truncate max-w-[220px] sm:max-w-none">
            {profileConfig.statusBadge || siteConfig.subtitle}
          </span>
        </div>

        {/* Hero title in Bricolage Grotesque + Junicode Italic in Paper Coral */}
        <h1 className="hero-element opacity-0 text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-paper-ink leading-[1.08] max-w-3xl">
          Quiet software,{' '}
          <em className="text-paper-coral font-normal italic font-serif">
            declarative
          </em>{' '}
          systems & craft.
        </h1>

        {/* Subtitle */}
        <p className="hero-element opacity-0 mt-5 max-w-2xl text-base sm:text-lg text-paper-textSubtle leading-relaxed font-normal">
          {siteConfig.description} Written and maintained by{' '}
          <span className="text-paper-ink font-medium underline decoration-paper-coral/40 underline-offset-4">
            {profileConfig.name || siteConfig.author}
          </span>
          .
        </p>

        {/* Action Buttons */}
        <div className="hero-element opacity-0 mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            ref={primaryBtnRef}
            href="/posts"
            onMouseEnter={() => handleBtnHover(primaryBtnRef.current)}
            onMouseLeave={() => handleBtnLeave(primaryBtnRef.current)}
            className="flex items-center justify-center gap-2 rounded-xl bg-paper-ink text-paper-bg px-6 py-3 text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Read Dispatches</span>
            <ArrowRight className="h-4 w-4 text-paper-coral" />
          </Link>

          <Link
            ref={secondaryBtnRef}
            href="/about"
            onMouseEnter={() => handleBtnHover(secondaryBtnRef.current)}
            onMouseLeave={() => handleBtnLeave(secondaryBtnRef.current)}
            className="flex items-center justify-center gap-2 rounded-xl border border-paper-border bg-paper-subtle text-paper-ink px-5 py-3 text-sm font-medium transition-all hover:bg-paper-card hover:border-paper-borderHover active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4 text-paper-textSubtle" />
            <span>Colophon & About</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
