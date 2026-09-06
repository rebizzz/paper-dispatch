'use client';

import React, { useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

export const AnimeDemo: React.FC = () => {
  const boxContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const runStaggerAnimation = () => {
    if (!boxContainerRef.current) return;
    setIsPlaying(true);

    const boxes = boxContainerRef.current.querySelectorAll('.anime-box');

    animate(boxes, {
      scale: [
        { to: 1.25, duration: 220, ease: 'easeOutSine' },
        { to: 1, duration: 400, ease: 'easeOutElastic(1, .6)' },
      ],
      rotate: {
        to: () => Math.floor(Math.random() * 90 - 45),
        duration: 450,
        ease: 'easeInOutQuad',
      },
      borderRadius: ['8px', '50%', '10px'],
      delay: stagger(50, { grid: [4, 4], from: 'center' }),
      onComplete: () => setIsPlaying(false),
    });
  };

  const resetAnimation = () => {
    if (!boxContainerRef.current) return;
    const boxes = boxContainerRef.current.querySelectorAll('.anime-box');
    animate(boxes, {
      scale: 1,
      rotate: 0,
      borderRadius: '10px',
      duration: 300,
      ease: 'easeOutQuad',
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-paper-border bg-paper-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-paper-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-paper-ink font-sans">Interactive Spring Grid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={runStaggerAnimation}
            disabled={isPlaying}
            className="flex items-center gap-1 rounded-lg bg-paper-ink text-paper-bg px-2.5 py-1 text-xs font-medium hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Wave</span>
          </button>
          <button
            onClick={resetAnimation}
            className="flex items-center gap-1 rounded-lg border border-paper-border bg-paper-subtle px-2 py-1 text-xs font-medium text-paper-textSubtle hover:text-paper-ink"
            title="Reset Grid"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Grid of 16 animated items */}
      <div
        ref={boxContainerRef}
        className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2 justify-items-center py-2"
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const colors = [
            'bg-paper-coral text-white',
            'bg-paper-blue text-white',
            'bg-paper-green text-zinc-900',
            'bg-amber-400 text-zinc-900',
          ];
          const color = colors[i % colors.length];

          return (
            <div
              key={i}
              className={`anime-box h-10 w-10 rounded-xl ${color} shadow-sm cursor-pointer flex items-center justify-center font-mono text-[11px] font-bold transition-transform hover:scale-110 active:scale-95`}
              onClick={runStaggerAnimation}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[11px] font-mono text-paper-textSubtle">
        Click any cell to trigger dynamic Anime.js v4 center ripple
      </p>
    </div>
  );
};
