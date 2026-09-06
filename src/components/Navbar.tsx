'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig, navConfig, profileConfig, themeConfig } from '@/site.config';
import { Github, Sun, Moon, Menu, X, Search } from 'lucide-react';
import { KineticLogo } from '@/components/animations/KineticLogo';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(themeConfig.defaultMode || 'dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || themeConfig.defaultMode || 'dark';
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    } catch (e) {}
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const githubUrl = profileConfig.socialLinks.find(
    (s) => s.icon === 'github' || s.name.toLowerCase().includes('github')
  )?.url || profileConfig.socialLinks[0]?.url || '#';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-border bg-paper-bg/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Kinetic Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-paper-subtle border border-paper-border transition-all group-hover:scale-105 active:scale-95 group-hover:border-paper-coral/30">
            <KineticLogo className="h-5 w-5 text-paper-coral" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold tracking-tight text-paper-ink group-hover:text-paper-coral transition-colors">
              {siteConfig.title}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-paper-textSubtle -mt-0.5">
              {siteConfig.subtitle || 'journal & field notes'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-paper-border bg-paper-subtle px-1.5 py-1">
          {navConfig.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-150 ${
                  active
                    ? 'text-paper-bg bg-paper-ink shadow-sm'
                    : 'text-paper-textSubtle hover:text-paper-ink hover:bg-paper-muted'
                }`}
              >
                {item.title}
                {item.badge && (
                  <span className="ml-1.5 rounded bg-paper-coral/15 px-1 py-0.2 text-[9px] text-paper-coral font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions: Theme Toggle & GitHub */}
        <div className="flex items-center gap-2">
          {/* Quick posts search trigger */}
          <Link
            href="/posts"
            aria-label="Search posts"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-paper-border bg-paper-subtle text-paper-textSubtle transition-all duration-150 hover:text-paper-ink hover:border-paper-borderHover hover:scale-[1.02] active:scale-[0.98]"
            title="Search dispatches"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-paper-border bg-paper-subtle text-paper-textSubtle transition-all duration-150 hover:text-paper-ink hover:border-paper-borderHover hover:scale-[1.02] active:scale-[0.98]"
            title={theme === 'dark' ? 'Switch to Paper Light' : 'Switch to Dark mode'}
          >
            {mounted && theme === 'light' ? (
              <Moon className="h-4 w-4 text-paper-ink" />
            ) : (
              <Sun className="h-4 w-4 text-paper-coral" />
            )}
          </button>

          {/* GitHub link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-paper-border bg-paper-subtle text-paper-textSubtle transition-all duration-150 hover:text-paper-ink hover:border-paper-borderHover hover:scale-[1.02] active:scale-[0.98]"
          >
            <Github className="h-4 w-4" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-paper-border bg-paper-subtle text-paper-ink hover:bg-paper-muted"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-paper-border bg-paper-card px-4 py-4 space-y-2 animate-fade-in">
          {navConfig.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-paper-coral/15 text-paper-coral font-semibold'
                  : 'text-paper-ink hover:bg-paper-subtle'
              }`}
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-3 border-t border-paper-border flex items-center justify-between">
            <div className="flex gap-4">
              {profileConfig.socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-paper-textSubtle hover:text-paper-coral transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
