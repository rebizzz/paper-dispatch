# Contributing to Paper Dispatch

Thank you for your interest in contributing to Paper Dispatch. We welcome bug reports, feature suggestions, documentation improvements, and pull requests.

---

## Before You Start

If you plan to propose major architectural changes or large feature additions, please open a GitHub Discussion or Issue first. This helps ensure your work aligns with the project vision and saves you time.

---

## Development Setup

Paper Dispatch uses Next.js 14, Tailwind CSS, and Anime.js v4. You can develop using Bun, Node.js, or Nix Flake.

### Option 1: Using Bun (Recommended)

```bash
# Clone the repository
git clone https://github.com/rebizzz/paper-dispatch.git
cd paper-dispatch

# Install dependencies
bun install

# Start development server
bun dev
```

### Option 2: Using Nix Flake

```bash
nix develop
bun install
bun dev
```

Open `http://localhost:3000` in your browser.

---

## Code Quality Standards

Before submitting a pull request, verify that your changes compile cleanly without errors:

```bash
# Verify TypeScript types
bun run typecheck

# Run production build
bun run build

# Run linter
bun run lint
```

---

## Pull Request Guidelines

1. **Focused Scope**: Keep pull requests focused on a single bug fix or feature. Avoid combining unrelated changes.
2. **Conventional Commits**: Format your commit messages using the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat: add new audio visualizer component`
   - `fix: resolve mobile navigation backdrop blur`
   - `docs: update configuration guide`
   - `refactor: clean up typography variables`
3. **No Unneeded Dependencies**: Avoid introducing heavy third-party packages when standard Web APIs, Tailwind, or Anime.js can achieve the same result.
4. **Responsive & Accessible**: Ensure any new UI components work smoothly across mobile and desktop viewports, with WCAG AA compliant contrast.

---

## Reporting Issues

- **Bug Reports**: Please include your browser version, operating system, reproduction steps, and relevant console logs.
- **Feature Requests**: Clearly describe the proposed feature and why it would benefit users of this template.
