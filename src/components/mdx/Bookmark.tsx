import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { withBasePath } from '@/lib/basePath';

interface BookmarkProps {
  url: string;
  title: string;
  description?: string;
  siteName?: string;
  image?: string;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  url,
  title,
  description,
  siteName,
  image,
}) => {
  let hostname = '';
  try {
    hostname = new URL(url).hostname.replace('www.', '');
  } catch {
    hostname = url;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-6 flex flex-col overflow-hidden rounded-2xl border border-paper-border bg-paper-card transition-all duration-200 hover:border-paper-borderHover hover:bg-paper-cardHover sm:flex-row"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-paper-textSubtle group-hover:text-paper-coral transition-colors" />
            <span className="font-mono text-xs text-paper-textSubtle">{siteName || hostname}</span>
          </div>
          <h4 className="font-sans font-semibold text-paper-ink tracking-tight group-hover:text-paper-coral transition-colors">
            {title}
          </h4>
          {description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-paper-textSubtle">{description}</p>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1 font-mono text-[11px] text-paper-textSubtle group-hover:text-paper-coral transition-colors min-w-0">
          <span className="truncate">{url}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </div>
      </div>
      {image && (
        <div className="relative h-32 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-paper-subtle border-b sm:border-b-0 sm:border-l border-paper-border order-first sm:order-last">
          <img
            src={withBasePath(image)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
    </a>
  );
};
