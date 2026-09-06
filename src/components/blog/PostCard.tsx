'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { animate, spring } from 'animejs';
import type { PostMeta } from '@/types/blog';

interface PostCardProps {
  post: PostMeta;
  index?: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      translateY: -3,
      scale: 1.008,
      duration: 250,
      ease: spring({ bounce: 0.35, duration: 400 }),
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      translateY: 0,
      scale: 1,
      duration: 250,
      ease: spring({ bounce: 0.15, duration: 350 }),
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="spotlight-card stagger-item group relative flex flex-col justify-between rounded-2xl border border-paper-border bg-paper-card p-6 sm:p-7 transition-colors duration-200 hover:bg-paper-cardHover hover:border-paper-borderHover will-change-transform"
    >
      <div>
        {/* Header: Category & Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {post.category && (
              <span className="rounded-lg bg-paper-coral/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-paper-coral border border-paper-coral/20">
                {post.category}
              </span>
            )}
            <span className="text-xs font-mono text-paper-textSubtle">
              {post.date}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-paper-textSubtle">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-paper-ink transition-colors group-hover:text-paper-coral">
          <Link href={`/posts/${post.slug}`} className="block">
            {post.title}
          </Link>
        </h3>

        {/* Description */}
        {post.description && (
          <p className="mt-2.5 text-sm sm:text-base text-paper-textSubtle leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}
      </div>

      {/* Footer: Tags & Read Link */}
      <div className="mt-5 flex items-center justify-between border-t border-paper-border pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-paper-subtle px-2 py-0.5 text-[11px] font-mono text-paper-textSubtle"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/posts/${post.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-paper-textSubtle group-hover:text-paper-coral transition-colors"
          tabIndex={-1}
        >
          <span>Read</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
};
