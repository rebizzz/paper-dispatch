'use client';

import React, { useEffect, useState } from 'react';
import type { TocItem } from '@/types/blog';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  toc: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!toc.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (!toc.length) return null;

  return (
    <aside className="sticky top-24 hidden xl:block w-64 shrink-0">
      <div className="rounded-2xl border border-paper-border bg-paper-card/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-paper-border text-xs font-semibold uppercase tracking-wider text-paper-textSubtle font-sans">
          <List className="h-3.5 w-3.5 text-paper-coral" />
          <span>Outline</span>
        </div>
        <nav className="space-y-1 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block py-1 transition-colors leading-normal ${
                  item.level === 3 ? 'pl-3' : 'pl-0'
                } ${
                  isActive
                    ? 'font-semibold text-paper-coral border-l-2 border-paper-coral pl-2 -ml-2'
                    : 'text-paper-textSubtle hover:text-paper-ink'
                }`}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
