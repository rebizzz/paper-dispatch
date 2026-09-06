import React, { Suspense } from 'react';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import { PostsArchiveClient } from '@/components/blog/PostsArchiveClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive of Dispatches',
  description: 'All writings, technical notes, and daily happening dispatches.',
};

export default function PostsPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-paper-ink font-sans">
          All <em className="text-paper-coral font-normal italic font-serif">Dispatches</em>
        </h1>
        <p className="text-paper-textSubtle text-sm sm:text-base max-w-2xl">
          Essays, engineering logs, Linux & Nix configurations, and interactive experiments.
        </p>
      </div>

      <Suspense fallback={<div className="text-xs font-mono text-paper-textSubtle">Loading dispatches...</div>}>
        <PostsArchiveClient initialPosts={posts} categories={categories} tags={tags} />
      </Suspense>
    </div>
  );
}
