'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import { withBasePath } from '@/lib/basePath';

interface ZoomableImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  caption,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <figure className="my-8 group relative overflow-hidden rounded-2xl border border-paper-border bg-paper-card shadow-sm transition-all duration-200 hover:border-paper-borderHover">
        <div
          className="relative aspect-video w-full cursor-zoom-in overflow-hidden bg-black/20"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={withBasePath(src)}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
            <span className="flex items-center gap-1.5 rounded-full bg-paper-ink text-paper-bg px-3.5 py-1.5 text-xs font-medium shadow-md">
              <Maximize2 className="h-3.5 w-3.5 text-paper-coral" /> Expand Image
            </span>
          </div>
        </div>

        {(caption || alt) && (
          <figcaption className="border-t border-paper-border bg-paper-subtle px-4 py-2 text-center text-xs text-paper-textSubtle">
            {caption || alt}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 active:scale-95 transition-all z-20"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[95vw] sm:max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={withBasePath(src)} alt={alt} className="max-h-[70vh] sm:max-h-[82vh] max-w-[95vw] sm:max-w-[92vw] object-contain" />
            {(caption || alt) && (
              <div className="bg-[#16161b] p-3 text-center text-xs text-zinc-300 border-t border-white/10 font-mono">
                {caption || alt}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
