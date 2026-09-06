import type {
  SiteConfig,
  ThemeConfig,
  NavConfig,
  ProfileConfig,
  FeaturesConfig,
  LicenseConfig,
  GiscusConfig,
} from './types/config';

export const siteConfig: SiteConfig = {
  title: 'rebizzz.dev',
  subtitle: 'daily dispatches, nix configs & engineering',
  description: 'A sleek, moody digital garden for daily happenings, systems tinkering, code snippets, and audio/video dispatches.',
  author: 'rebizzz',
  bio: 'Linux tinkerer, Nix enthusiast & developer exploring modern web & system aesthetics.',
  avatar: '/avatar.png',
  url: 'https://rebizzz.dev',
  lang: 'en',
  keywords: ['Next.js', 'NixOS', 'Wayland', 'TypeScript', 'Paper Theme', 'Engineering'],
};

export const themeConfig: ThemeConfig = {
  accent: 'coral',
  defaultMode: 'dark',
  darkReaderLock: true,
  animations: true,
  accentHex: '#f76f53',
};

export const navConfig: NavConfig = [
  { title: 'Home', path: '/' },
  { title: 'Posts', path: '/posts' },
  { title: 'Tags', path: '/tags' },
  { title: 'About', path: '/about' },
];

export const profileConfig: ProfileConfig = {
  name: 'rebizzz',
  handle: 'rebizzz',
  bio: 'Linux tinkerer, Nix enthusiast & developer exploring modern web & system aesthetics.',
  avatar: '/avatar.png',
  statusBadge: 'daily dispatches, nix configs & engineering',
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com/rebizzz', icon: 'github' },
    { name: 'Twitter / X', url: 'https://twitter.com', icon: 'twitter' },
    { name: 'Discord', url: 'https://discord.gg', icon: 'discord' },
    { name: 'RSS Feed', url: '/rss.xml', icon: 'rss' },
  ],
  experience: [
    {
      category: 'Operating System',
      title: 'NixOS Unstable',
      description: 'Declarative flakes & home-manager',
    },
    {
      category: 'Compositor',
      title: 'Niri / Hyprland',
      description: 'Scrollable column Wayland tiling',
    },
    {
      category: 'Paper Workspace',
      title: 'Paper Minimal Chrome',
      description: 'Vertical tabs, compact workspaces',
    },
    {
      category: 'Terminal & Editor',
      title: 'Ghostty + Neovim',
      description: 'Fast GPU rendering & Lua configs',
    },
  ],
  interests: ['NixOS', 'Wayland', 'Linux Kernel', 'TypeScript', 'Design Systems', 'Micro-motion'],
  narrative: [
    'Welcome to my digital notebook. I am a Linux tinkerer, systems enthusiast, and frontend builder. I care deeply about calm digital environments, reproducible software with Nix & NixOS, and software craft that feels human, intentional, and quiet.',
    'This site takes its aesthetic principles from modern editorial paper craft: embracing warm textures, intentional Bricolage Grotesque and Junicode typography, and gentle spring micro-motion powered by Anime.js.',
  ],
};

export const featuresConfig: FeaturesConfig = {
  toc: {
    enable: true,
    depth: 3,
  },
  readingTime: true,
  codeCopy: true,
  giscus: true,
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};

export const giscusConfig: GiscusConfig = {
  enable: true,
  repo: 'rebizzz/rebizzz',
  repoId: 'R_kgDOS8h6SQ',
  category: 'General',
  categoryId: 'DIC_kwDOS8h6Sc4DE-_S',
  mapping: 'pathname',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'noborder_dark',
  lang: 'en',
};

const config = {
  ...siteConfig,
  site: siteConfig,
  siteConfig,
  theme: themeConfig,
  themeConfig,
  nav: navConfig,
  navConfig,
  profile: profileConfig,
  profileConfig,
  features: featuresConfig,
  featuresConfig,
  license: licenseConfig,
  licenseConfig,
  giscus: giscusConfig,
  giscusConfig,
  social: profileConfig.socialLinks,
};

export default config;
