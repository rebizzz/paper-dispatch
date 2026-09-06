import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { PostCard } from '@/components/PostCard';
import { AnimeStaggerList } from '@/components/animations/AnimeWrapper';
import { AnimeDemo } from '@/components/animations/AnimeDemo';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import { siteConfig, profileConfig } from '@/site.config';
import { ArrowRight, Sparkles, Folder, Tag, BookOpen, Layers } from 'lucide-react';

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  const recentPosts = posts.slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <Hero />

      {/* Main Content Area */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left: Recent Dispatches (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-paper-border pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-paper-coral" />
                <h2 className="text-xl font-bold tracking-tight text-paper-ink font-sans">
                  Recent Dispatches
                </h2>
              </div>
              <Link
                href="/posts"
                className="group flex items-center gap-1 text-xs font-mono text-paper-textSubtle hover:text-paper-coral transition-colors"
              >
                <span>All {posts.length} entries</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <AnimeStaggerList className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {recentPosts.map((post, idx) => (
                <PostCard key={post.slug} post={post} index={idx} />
              ))}
            </AnimeStaggerList>

            {/* View all dispatches banner */}
            <div className="rounded-2xl border border-paper-border bg-paper-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-sans font-bold text-base text-paper-ink">
                  Looking for something specific?
                </h3>
                <p className="text-xs sm:text-sm text-paper-textSubtle mt-0.5">
                  Browse by category, tags, or search through all published writing.
                </p>
              </div>
              <Link
                href="/posts"
                className="shrink-0 rounded-xl bg-paper-ink text-paper-bg px-5 py-2.5 text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Open Archive
              </Link>
            </div>
          </div>

          {/* Right Sidebar: Profile & Taxonomy */}
          <div className="space-y-6">
            {/* Author Profile Card */}
            <div className="rounded-2xl border border-paper-border bg-paper-card p-6 shadow-sm">
              <div className="flex items-center gap-3.5">
                <img
                  src={profileConfig.avatar}
                  alt={profileConfig.name}
                  className="h-12 w-12 rounded-xl border border-paper-border object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-paper-ink tracking-tight">
                    {profileConfig.name}
                  </h3>
                  <p className="font-mono text-xs text-paper-coral">
                    @{profileConfig.handle}
                  </p>
                </div>
              </div>
              <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-paper-textSubtle">
                {profileConfig.bio}
              </p>
              <div className="mt-4 border-t border-paper-border pt-3.5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-paper-textSubtle">
                  {posts.length} posts published
                </span>
                <Link
                  href="/about"
                  className="text-xs font-medium text-paper-ink hover:text-paper-coral transition-colors flex items-center gap-1"
                >
                  <span>About</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Anime.js Interactive Kinetic Sandbox Widget */}
            <div className="rounded-2xl border border-paper-border bg-paper-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-paper-coral" />
                <span className="text-xs font-bold uppercase tracking-wider text-paper-ink font-sans">
                  Anime.js v4 Engine
                </span>
              </div>
              <p className="text-xs text-paper-textSubtle mb-3 leading-relaxed">
                Kinetic spring physics running directly in the browser via Anime.js v4.
              </p>
              <AnimeDemo />
            </div>

            {/* Categories */}
            <div className="rounded-2xl border border-paper-border bg-paper-card p-5">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-paper-textSubtle font-sans">
                <Folder className="h-3.5 w-3.5 text-paper-blue" />
                <span>Categories</span>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/posts?category=${encodeURIComponent(cat.category)}`}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-paper-ink hover:bg-paper-subtle transition-colors"
                  >
                    <span>{cat.category}</span>
                    <span className="font-mono text-[11px] text-paper-textSubtle">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="rounded-2xl border border-paper-border bg-paper-card p-5">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-paper-textSubtle font-sans">
                <Tag className="h-3.5 w-3.5 text-paper-green" />
                <span>Topics</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/posts?tag=${encodeURIComponent(t.tag)}`}
                    className="rounded-lg border border-paper-border bg-paper-subtle px-2.5 py-1 font-mono text-[11px] text-paper-textSubtle hover:border-paper-borderHover hover:text-paper-coral transition-all"
                  >
                    #{t.tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
