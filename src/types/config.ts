export type AccentColor = 'coral' | 'blue' | 'green' | 'amber' | 'purple';

export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  author: string;
  bio: string;
  avatar: string;
  url: string;
  lang: string;
  keywords: string[];
}

export interface ThemeConfig {
  accent: AccentColor;
  defaultMode: 'light' | 'dark';
  darkReaderLock: boolean;
  animations: boolean;
  accentHex?: string;
}

export interface NavItem {
  title: string;
  path: string;
  external?: boolean;
  badge?: string;
}

export type NavConfig = NavItem[];

export interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'twitter' | 'bluesky' | 'discord' | 'mail' | 'rss' | string;
}

export interface ProfileExperience {
  category: string;
  title: string;
  description: string;
}

export interface ProfileConfig {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  statusBadge?: string;
  socialLinks: SocialLink[];
  experience?: ProfileExperience[];
  interests?: string[];
  skills?: string[];
  narrative?: string[];
}

export interface TocConfig {
  enable: boolean;
  depth?: number;
}

export interface FeaturesConfig {
  toc: TocConfig;
  readingTime: boolean;
  codeCopy: boolean;
  giscus: boolean;
}

export interface LicenseConfig {
  enable: boolean;
  name: string;
  url: string;
}

export interface GiscusConfig {
  enable: boolean;
  enabled?: boolean;
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title';
  reactionsEnabled: '0' | '1';
  emitMetadata: '0' | '1';
  inputPosition: 'top' | 'bottom';
  theme: string;
  lang: string;
}

export interface AppConfig {
  site: SiteConfig;
  theme: ThemeConfig;
  nav: NavConfig;
  profile: ProfileConfig;
  features: FeaturesConfig;
  license: LicenseConfig;
  giscus?: GiscusConfig;
}
