# 📄 Paper Dispatch

A calm, typography-first personal publishing template for [Next.js 14](https://nextjs.org), engineered with warm paper palettes, editorial serifs, Iosevka code blocks, and spring-physics kinetics powered by [Anime.js v4](https://animejs.com).

Inspired by physical print layouts and modular architectures like [Fuwari](https://github.com/saicaca/fuwari), Paper Dispatch lets you run a fast, distraction-free digital journal configured entirely from a single typed configuration file.

---

## Features

- 📜 **Warm Paper Aesthetics**: Balanced dark charcoal paper (`#19191d`) and cream light paper (`#f2f0e3`), paired with signature Paper Coral (`#f76f53`), Electric Blue (`#6287f5`), and Emerald (`#63f78b`).
- ✒️ **Editorial Typography**: 
  - **Headings & UI**: [Bricolage Grotesque](https://fontsource.org/fonts/bricolage-grotesque)
  - **Accents & Italics**: [Junicode](https://github.com/psb1558/Junicode-font) (local WOFF2 subset)
  - **Code Blocks**: [Iosevka](https://fontsource.org/fonts/iosevka) + [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) with programming ligatures.
- ⚡ **Anime.js v4 Kinetic Engine**:
  - Spring-driven logo animation with staggered concentric rings
  - Timeline-based hero typography reveals with optical blur
  - Staggered post list transitions with spring physics
  - Floating kinetic reading progress dock with circular SVG progress meter and smooth back-to-top inertia
  - Full interactive **Kinetic Studio** featuring draggable chips (`createDraggable`), SVG path drawing & morphing (`createDrawable`, `morphTo`), character wave text scrambler (`scrambleText`), and 2D grid ripple matrices.
- 💻 **Syntax Highlighted Code Blocks**:
  - macOS traffic light controls
  - Automatic language badge detection
  - Dedicated obsidian editor canvas (`#0f0f13`)
  - One-click copy with feedback checkmark
  - Word wrap toggle button
- 🎥 **Self-Hosted Rich Media Blocks**:
  - `<VideoPlayer />`: Native 60fps MP4/WebM screencasts with custom poster frames
  - `<AudioPlayer />`: Full playback deck with time scrubbers and volume control
  - `<ZoomableImage />`: Full-screen lightbox zoom modal with escape key support
  - `<Bookmark />`: Rich URL cards with domain favicon, title, and link indicators
  - `<Callout />`: Note, tip, warning, and caution callout boxes
- 🧩 **Modular Single-File Configuration**: Customize title, bio, avatar, socials, theme accents, navigation, and comments in `site.config.ts` without touching template code.
- 💬 **Giscus Comments**: GitHub Discussions integration with automatic dark/light theme switching.
- 🛡️ **Dark Reader Lock**: Native `<meta name="darkreader-lock">` and `color-scheme: light dark` to prevent third-party extensions from inverting custom paper colors.
- ❄️ **Hermetic Nix Flake**: Zero-setup development shell providing Bun, Node.js 22, Git, and GitHub CLI.

---

## Quickstart

### Option A: Using Bun or Node.js

```bash
# Clone the template
git clone https://github.com/rebizzz/paper-dispatch.git
cd paper-dispatch

# Install dependencies
bun install   # or: npm install / pnpm install

# Start local dev server
bun dev       # or: npm run dev
```

Visit `http://localhost:3000` in your browser.

### Option B: Using Nix Flake

If you use Nix with flakes enabled:

```bash
nix develop
bun install
bun dev
```

---

## Configuration

Customize your entire site by editing **`site.config.ts`** in the project root:

```typescript
// site.config.ts
export const siteConfig: SiteConfig = {
  title: 'Your Name',
  subtitle: 'notes on software, systems & craft',
  description: 'A personal digital journal.',
  author: 'Your Name',
  bio: 'Systems engineer & developer exploring quiet digital craft.',
  avatar: '/avatar.png',
  url: 'https://yourdomain.com',
  lang: 'en',
  keywords: ['Next.js', 'TypeScript', 'Paper Theme'],
};

export const themeConfig: ThemeConfig = {
  accent: 'coral', // 'coral' | 'blue' | 'green' | 'amber' | 'purple'
  defaultMode: 'dark', // 'light' | 'dark'
  darkReaderLock: true,
  animations: true,
};

export const profileConfig: ProfileConfig = {
  name: 'Your Name',
  handle: 'yourhandle',
  bio: 'Systems engineer exploring quiet interfaces.',
  avatar: '/avatar.png',
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com/yourhandle', icon: 'github' },
    { name: 'Twitter / X', url: 'https://twitter.com/yourhandle', icon: 'twitter' },
    { name: 'RSS Feed', url: '/rss.xml', icon: 'rss' },
  ],
};
```

---

## Writing Posts

Create new Markdown or MDX files in `content/posts/`:

```markdown
---
title: "Your Post Title"
description: "A short summary of your dispatch."
date: "2026-09-06"
category: "Engineering"
tags: ["nextjs", "typescript", "architecture"]
image: "/media/your-cover.webp"
featured: true
draft: false
---

Your content here. Standard Markdown is fully supported.

### Interactive Components

```tsx
<Callout type="tip" title="Pro Tip">
  Callouts render with distinct borders and subtle background fills.
</Callout>

<VideoPlayer
  src="/media/demo.mp4"
  poster="/media/demo-poster.webp"
  caption="Demo screencast in action"
/>

<AudioPlayer
  src="/audio/dispatch.wav"
  title="Field Note #01"
  artist="Voice Memo"
/>

<Bookmark
  url="https://nextjs.org"
  title="Next.js"
  description="The React Framework for the Web."
/>
```
```

---

## Project Structure

```text
├── content/
│   └── posts/               # MDX article files
├── docs/
│   └── screenshots/         # Preview images for documentation
├── public/
│   ├── audio/               # Local audio files
│   ├── fonts/               # Junicode font subsets
│   └── media/               # Local video screencasts and posters
├── src/
│   ├── app/                 # Next.js 14 App Router routes
│   │   ├── globals.css      # Paper theme variables & typography
│   │   └── layout.tsx       # Root layout with Dark Reader lock
│   ├── components/
│   │   ├── animations/      # Anime.js kinetic logo, dock & studio
│   │   ├── mdx/             # CodeBlock, VideoPlayer, AudioPlayer, Lightbox
│   │   └── Navbar.tsx       # Kinetic navigation header
│   ├── lib/                 # MDX parser, post loader, reading time
│   ├── site.config.ts       # Modular site configuration
│   └── types/               # TypeScript definitions
├── tailwind.config.ts       # Tailwind theme extensions
└── flake.nix                # Hermetic Nix development environment
```

---

## Deployment

### Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework preset will automatically detect **Next.js**.
4. Click **Deploy**.

### Static Export / Self-Hosted
Run `bun run build` followed by `bun run start -p 3000`.

---

## License

MIT License. Designed with care by [rebizzz](https://github.com/rebizzz).
