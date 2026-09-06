import React from 'react';
import Link from 'next/link';
import { siteConfig, profileConfig, licenseConfig } from '@/site.config';
import { Rss } from 'lucide-react';
import { KineticLogo } from '@/components/animations/KineticLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-paper-border bg-paper-card/30 py-12 text-sm text-paper-textSubtle transition-colors">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand & info */}
          <div className="flex items-center gap-3">
            <KineticLogo className="h-5 w-5 text-paper-coral" />
            <div>
              <p className="font-sans text-xs font-semibold text-paper-ink">
                {siteConfig.title}
              </p>
              <p className="text-[11px] text-paper-textSubtle font-mono">
                Built with Next.js 14, MDX, Anime.js & Paper Editorial design system.
              </p>
              {licenseConfig.enable && (
                <p className="text-[11px] text-paper-textSubtle font-mono mt-1">
                  Licensed under{' '}
                  <a
                    href={licenseConfig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-paper-coral transition-colors"
                  >
                    {licenseConfig.name}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Social Links & RSS */}
          <div className="flex items-center gap-5">
            {profileConfig.socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target={item.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-xs font-mono text-paper-textSubtle hover:text-paper-coral transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/rss.xml"
              className="flex items-center gap-1 text-xs font-mono text-paper-textSubtle hover:text-paper-coral transition-colors"
              title="RSS Feed"
            >
              <Rss className="h-3 w-3" />
              <span>RSS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
