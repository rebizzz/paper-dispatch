'use client';

import React from 'react';
import Giscus from '@giscus/react';
import siteConfig from '@/site.config';
import { MessageSquare } from 'lucide-react';

export const GiscusComments: React.FC = () => {
  const { giscus } = siteConfig;

  if (!giscus.enabled) return null;

  return (
    <div className="mt-16 border-t border-paper-border pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-4 w-4 text-paper-coral" />
        <h3 className="text-lg font-bold tracking-tight text-paper-ink font-sans">
          Discussion & Notes
        </h3>
      </div>
      <div className="rounded-2xl border border-paper-border bg-paper-card p-5 sm:p-7 min-h-[180px]">
        <Giscus
          id="comments"
          repo={giscus.repo}
          repoId={giscus.repoId}
          category={giscus.category}
          categoryId={giscus.categoryId}
          mapping={giscus.mapping}
          reactionsEnabled={giscus.reactionsEnabled}
          emitMetadata={giscus.emitMetadata}
          inputPosition={giscus.inputPosition}
          theme={giscus.theme}
          lang={giscus.lang}
          loading="lazy"
        />
      </div>
    </div>
  );
};
