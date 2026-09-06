import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        paper: {
          bg: 'var(--paper-bg)',
          ink: 'var(--paper-ink)',
          subtle: 'var(--paper-subtle)',
          muted: 'var(--paper-muted)',
          border: 'var(--paper-border)',
          borderHover: 'var(--paper-border-hover)',
          card: 'var(--paper-card)',
          cardHover: 'var(--paper-card-hover)',
          textSubtle: 'var(--paper-text-subtle)',
          coral: '#f76f53',
          coralLight: '#ff8b73',
          blue: '#6287f5',
          green: '#63f78b',
          amber: '#f59e0b',
          amberLight: '#fbbf24',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Junicode-Italic"', 'Junicode', 'Georgia', 'serif'],
        mono: ['"Iosevka"', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--paper-ink)',
            a: {
              color: '#f76f53',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              '&:hover': {
                color: '#ff8b73',
              },
            },
            h1: {
              color: 'var(--paper-ink)',
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: 'var(--paper-ink)',
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontWeight: '600',
              letterSpacing: '-0.02em',
              borderBottom: '1px solid var(--paper-border)',
              paddingBottom: '0.4rem',
            },
            h3: {
              color: 'var(--paper-ink)',
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontWeight: '600',
            },
            code: {
              color: '#f76f53',
              backgroundColor: 'var(--paper-subtle)',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.375rem',
              fontWeight: '400',
              fontFamily: '"JetBrains Mono", monospace',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              borderLeftColor: '#f76f53',
              borderLeftWidth: '3px',
              backgroundColor: 'var(--paper-muted)',
              padding: '0.75rem 1.25rem',
              borderRadius: '0 0.75rem 0.75rem 0',
              color: 'var(--paper-ink)',
              fontStyle: 'italic',
            },
            strong: {
              color: 'var(--paper-ink)',
              fontWeight: '600',
            },
            hr: {
              borderColor: 'var(--paper-border)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
