'use client';

import React, { useState, useEffect } from 'react';
import Giscus from '@giscus/react';
import { giscusConfig, featuresConfig } from '@/site.config';
import { MessageSquare } from 'lucide-react';

export const GiscusComments: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'noborder_dark' | 'noborder_light'>('noborder_dark');

  const isEnabled = (giscusConfig.enable || giscusConfig.enabled) && featuresConfig.giscus;

  useEffect(() => {
    setMounted(true);

    const updateTheme = () => {
      const themeAttr = document.documentElement.getAttribute('data-theme');
      const isDark = themeAttr === 'dark' || document.documentElement.classList.contains('dark');
      setActiveTheme(isDark ? 'noborder_dark' : 'noborder_light');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!isEnabled) return null;
  if (!mounted) {
    return (
      <div className="mt-16 border-t border-paper-border pt-10">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-4 w-4 text-paper-coral" />
          <h3 className="text-lg font-bold tracking-tight text-paper-ink font-sans">
            Discussion & Notes
          </h3>
        </div>
        <div className="rounded-2xl border border-paper-border bg-paper-card p-8 min-h-[160px] flex items-center justify-center text-xs font-mono text-paper-textSubtle">
          Loading discussion thread...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-paper-border pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-4 w-4 text-paper-coral" />
        <h3 className="text-lg font-bold tracking-tight text-paper-ink font-sans">
          Discussion & Notes
        </h3>
      </div>
      <div className="rounded-2xl border border-paper-border bg-paper-card p-5 sm:p-7 min-h-[180px] shadow-sm">
        <Giscus
          id="comments"
          repo={giscusConfig.repo}
          repoId={giscusConfig.repoId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
          mapping={giscusConfig.mapping}
          reactionsEnabled={giscusConfig.reactionsEnabled}
          emitMetadata={giscusConfig.emitMetadata}
          inputPosition={giscusConfig.inputPosition}
          theme={activeTheme}
          lang={giscusConfig.lang}
          loading="lazy"
        />
      </div>
    </div>
  );
};
