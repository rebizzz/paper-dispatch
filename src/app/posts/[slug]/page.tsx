import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts, extractToc } from '@/lib/posts';
import { MDXRenderer } from '@/components/mdx/MDXRenderer';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { GiscusComments } from '@/components/blog/GiscusComments';
import { KineticFloatingDock } from '@/components/animations/KineticFloatingDock';
import siteConfig from '@/site.config';
import { withBasePath } from '@/lib/basePath';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      publishedTime: post.meta.date,
      authors: [siteConfig.site.author],
      tags: post.meta.tags,
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const toc = extractToc(post.content);

  return (
    <div className="mx-auto max-w-5xl px-3.5 py-6 sm:px-6 sm:py-10">
      {/* Back button */}
      <Link
        href="/posts"
        className="group inline-flex items-center gap-2 text-xs font-mono text-paper-textSubtle hover:text-paper-coral transition-colors mb-6 sm:mb-8 py-1.5 min-h-[36px]"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to dispatches</span>
      </Link>

      <div className="flex gap-12">
        {/* Main Post Content Column */}
        <div className="min-w-0 flex-1">
          {/* Post Header */}
          <header className="border-b border-paper-border pb-6 sm:pb-8 mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.meta.category && (
                <span className="rounded-lg bg-paper-coral/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-paper-coral border border-paper-coral/20">
                  {post.meta.category}
                </span>
              )}
              {post.meta.tags?.map((t) => (
                <Link
                  key={t}
                  href={`/posts?tag=${encodeURIComponent(t)}`}
                  className="rounded-md bg-paper-subtle px-2 py-0.5 text-[11px] font-mono text-paper-textSubtle hover:text-paper-coral transition-colors"
                >
                  #{t}
                </Link>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-paper-ink font-sans leading-[1.15]">
              {post.meta.title}
            </h1>

            {post.meta.description && (
              <p className="mt-4 text-base sm:text-lg text-paper-textSubtle leading-relaxed font-normal">
                {post.meta.description}
              </p>
            )}

            {/* Author and meta info */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-paper-border">
              <div className="flex items-center gap-3">
                <img
                  src={withBasePath(siteConfig.site.avatar)}
                  alt={siteConfig.site.author}
                  className="h-10 w-10 rounded-xl border border-paper-border object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-paper-ink font-sans">
                    {siteConfig.site.author}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-paper-textSubtle">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.meta.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.meta.readingTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* MDX Body with custom components */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRenderer source={post.content} />
          </article>

          {/* Post Navigation: Previous and Next */}
          <nav className="mt-16 grid grid-cols-1 gap-4 border-t border-paper-border pt-8 sm:grid-cols-2">
            {prevPost ? (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="group flex flex-col rounded-2xl border border-paper-border bg-paper-card p-5 transition-all hover:border-paper-borderHover hover:bg-paper-cardHover"
              >
                <span className="flex items-center gap-1 text-[11px] font-mono text-paper-textSubtle group-hover:text-paper-coral">
                  <ArrowLeft className="h-3 w-3" /> Newer dispatch
                </span>
                <span className="mt-1 line-clamp-1 text-sm font-semibold text-paper-ink group-hover:text-paper-coral">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group flex flex-col items-end rounded-2xl border border-paper-border bg-paper-card p-5 text-right transition-all hover:border-paper-borderHover hover:bg-paper-cardHover"
              >
                <span className="flex items-center gap-1 text-[11px] font-mono text-paper-textSubtle group-hover:text-paper-coral">
                  Older dispatch <ArrowRight className="h-3 w-3" />
                </span>
                <span className="mt-1 line-clamp-1 text-sm font-semibold text-paper-ink group-hover:text-paper-coral">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Giscus Comments */}
          <GiscusComments />
        </div>

        {/* Right Column: Table of Contents */}
        {toc.length > 0 && <TableOfContents toc={toc} />}

        {/* Dynamic Anime.js kinetic reading dock */}
        <KineticFloatingDock />
      </div>
    </div>
  );
}
