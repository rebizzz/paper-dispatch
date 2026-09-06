'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PostMeta } from '@/types/blog';
import { PostCard } from '@/components/PostCard';
import { AnimeStaggerList } from '@/components/animations/AnimeWrapper';
import { Search, X } from 'lucide-react';

interface PostsArchiveClientProps {
  initialPosts: PostMeta[];
  categories: { category: string; count: number }[];
  tags: { tag: string; count: number }[];
}

export const PostsArchiveClient: React.FC<PostsArchiveClientProps> = ({
  initialPosts,
  categories,
  tags,
}) => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialTag = searchParams.get('tag') || '';

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState(initialTag);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchDesc = post.description.toLowerCase().includes(q);
        const matchTag = post.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }

      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }

      if (selectedTag && !post.tags?.includes(selectedTag)) {
        return false;
      }

      return true;
    });
  }, [initialPosts, query, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  const hasActiveFilters = Boolean(query || selectedCategory || selectedTag);

  return (
    <div className="space-y-8">
      {/* Search and filter toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-paper-textSubtle" />
          <input
            type="text"
            placeholder="Search by title, topics, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-paper-border bg-paper-card pl-10 pr-10 py-3 text-sm text-paper-ink placeholder:text-paper-textSubtle outline-none transition-all focus:border-paper-borderHover focus:bg-paper-cardHover"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-textSubtle hover:text-paper-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 self-start rounded-xl border border-paper-border bg-paper-subtle px-4 py-3 text-xs font-medium text-paper-ink hover:bg-paper-card transition-colors"
          >
            <X className="h-3.5 w-3.5 text-paper-coral" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-paper-border pb-4">
        <button
          onClick={() => setSelectedCategory('')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
            !selectedCategory
              ? 'bg-paper-ink text-paper-bg shadow-sm'
              : 'border border-paper-border bg-paper-subtle text-paper-textSubtle hover:text-paper-ink hover:bg-paper-card'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(selectedCategory === cat.category ? '' : cat.category)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === cat.category
                ? 'bg-paper-ink text-paper-bg shadow-sm'
                : 'border border-paper-border bg-paper-subtle text-paper-textSubtle hover:text-paper-ink hover:bg-paper-card'
            }`}
          >
            {cat.category} <span className="text-[10px] opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Results stats */}
      <div className="flex items-center justify-between text-xs font-mono text-paper-textSubtle">
        <span>Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'dispatch' : 'dispatches'}</span>
        {selectedTag && (
          <span className="flex items-center gap-1 text-paper-coral">
            Filtered by #{selectedTag}
            <button onClick={() => setSelectedTag('')} className="hover:text-paper-ink">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>

      {/* Post Grid */}
      {filteredPosts.length > 0 ? (
        <AnimeStaggerList
          key={`${selectedCategory}-${selectedTag}-${query}`}
          triggerKey={`${selectedCategory}-${selectedTag}-${query}`}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {filteredPosts.map((post, idx) => (
            <PostCard key={post.slug} post={post} index={idx} />
          ))}
        </AnimeStaggerList>
      ) : (
        <div className="rounded-2xl border border-dashed border-paper-border p-12 text-center bg-paper-card/40">
          <p className="text-sm text-paper-textSubtle">No dispatches match your search criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1 text-xs text-paper-coral underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
