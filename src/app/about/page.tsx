import React from 'react';
import type { Metadata } from 'next';
import { siteConfig, profileConfig, licenseConfig } from '@/site.config';
import { withBasePath } from '@/lib/basePath';
import { Cpu, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About & Colophon',
  description: `About ${profileConfig.name} - ${profileConfig.bio}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-3.5 py-8 sm:px-6 sm:py-12">
      <div className="space-y-10 sm:space-y-12">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-paper-border pb-8">
          <img
            src={withBasePath(profileConfig.avatar)}
            alt={profileConfig.name}
            className="h-20 w-20 rounded-2xl border border-paper-border object-cover"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-paper-ink font-sans">
              {profileConfig.name}
            </h1>
            <p className="mt-1 font-mono text-sm text-paper-coral">
              @{profileConfig.handle}
            </p>
            <p className="mt-2 text-sm text-paper-textSubtle leading-relaxed">
              {profileConfig.bio}
            </p>
          </div>
        </div>

        {/* Narrative / Bio */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-paper-ink">
          {profileConfig.narrative && profileConfig.narrative.length > 0 ? (
            profileConfig.narrative.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>{profileConfig.bio}</p>
          )}
        </section>

        {/* Experience & Environment */}
        {profileConfig.experience && profileConfig.experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-paper-ink font-sans flex items-center gap-2">
              <Cpu className="h-4 w-4 text-paper-coral" />
              <span>Tools & Environment</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profileConfig.experience.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-paper-border bg-paper-card p-4">
                  <div className="font-mono text-[11px] text-paper-textSubtle">{item.category}</div>
                  <div className="mt-1 font-semibold text-sm text-paper-ink">{item.title}</div>
                  <div className="text-xs text-paper-textSubtle mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {profileConfig.interests && profileConfig.interests.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-paper-textSubtle font-sans flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-paper-coral" />
              <span>Interests & Focus</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileConfig.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-xl border border-paper-border bg-paper-subtle px-3 py-1 font-mono text-xs text-paper-ink"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Colophon & License */}
        <section className="rounded-2xl border border-paper-border bg-paper-card p-6">
          <h3 className="text-base font-bold text-paper-ink tracking-tight">Colophon</h3>
          <p className="text-xs sm:text-sm text-paper-textSubtle mt-2 leading-relaxed">
            Written in TypeScript using Next.js 14 App Router, Tailwind CSS, Anime.js v4, and MDX.
            Typeset in Bricolage Grotesque, Junicode Italic, and JetBrains Mono.
            Aesthetic inspired by quiet editorial paper kinetics and modular architecture.
          </p>
          {licenseConfig.enable && (
            <p className="text-xs text-paper-textSubtle mt-2">
              Content licensed under{' '}
              <a
                href={licenseConfig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-coral underline underline-offset-4"
              >
                {licenseConfig.name}
              </a>
              .
            </p>
          )}
          <div className="flex flex-wrap gap-2.5 pt-5">
            {profileConfig.socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target={s.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="rounded-xl border border-paper-border bg-paper-subtle px-3.5 py-2 text-xs font-mono text-paper-ink hover:border-paper-borderHover hover:text-paper-coral transition-colors"
              >
                {s.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
