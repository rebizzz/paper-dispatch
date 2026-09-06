export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category?: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
  featured?: boolean;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
  wordCount: number;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
