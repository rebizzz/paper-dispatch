import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post, PostMeta, TocItem } from '@/types/blog';
import { withBasePath } from './basePath';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  return fs.readdirSync(POSTS_DIR).filter((file) => /\.mdx?$/.test(file));
}

export function getAllPosts(): PostMeta[] {
  const files = getPostFiles();
  const posts: PostMeta[] = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const filePath = path.join(POSTS_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const readStats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '2026-01-01',
        updated: data.updated ? new Date(data.updated).toISOString().split('T')[0] : undefined,
        category: data.category || 'General',
        tags: data.tags || [],
        image: data.image ? withBasePath(data.image) : '',
        draft: Boolean(data.draft),
        featured: Boolean(data.featured),
        readingTime: readStats.text,
        wordCount: readStats.words,
      };
    })
    .filter((post) => (process.env.NODE_ENV === 'production' ? !post.draft : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const possibleFiles = [
    path.join(POSTS_DIR, `${slug}.mdx`),
    path.join(POSTS_DIR, `${slug}.md`),
  ];

  const filePath = possibleFiles.find((p) => fs.existsSync(p));
  if (!filePath) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const readStats = readingTime(content);

  const meta: PostMeta = {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : '2026-01-01',
    updated: data.updated ? new Date(data.updated).toISOString().split('T')[0] : undefined,
    category: data.category || 'General',
    tags: data.tags || [],
    image: data.image ? withBasePath(data.image) : '',
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    readingTime: readStats.text,
    wordCount: readStats.words,
  };

  return {
    meta,
    content,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts();
  const catCounts: Record<string, number> = {};

  posts.forEach((post) => {
    const cat = post.category || 'General';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  return Object.entries(catCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    // remove markdown links and formatting from title
    const text = rawText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[`*_~]/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({ id, text, level });
  }

  return toc;
}
