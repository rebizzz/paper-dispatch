import React from 'react';
import Link from 'next/link';
import { getAllTags, getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tags Index',
  description: 'Explore all topics and tags across dispatches.',
};

export default function TagsPage() {
  const tags = getAllTags();
  const allPosts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-3.5 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 sm:mb-10 space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-paper-ink font-sans">
          Topics & <em className="text-paper-coral font-normal italic font-serif">Tags</em>
        </h1>
        <p className="text-paper-textSubtle text-sm sm:text-base">
          Browse through {tags.length} topics across {allPosts.length} published dispatches.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {tags.map((item) => (
          <Link
            key={item.tag}
            href={`/posts?tag=${encodeURIComponent(item.tag)}`}
            className="group flex items-center justify-between rounded-2xl border border-paper-border bg-paper-card p-4 transition-all hover:border-paper-borderHover hover:bg-paper-cardHover"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-paper-textSubtle group-hover:text-paper-coral transition-colors" />
              <span className="font-mono text-xs sm:text-sm font-medium text-paper-ink group-hover:text-paper-coral transition-colors">
                #{item.tag}
              </span>
            </div>
            <span className="rounded-md bg-paper-subtle px-2 py-0.5 font-mono text-[11px] text-paper-textSubtle">
              {item.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
