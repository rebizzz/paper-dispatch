import type { Metadata } from 'next';
import './globals.css';
import { siteConfig, themeConfig, profileConfig } from '@/site.config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: profileConfig.name || siteConfig.author, url: siteConfig.url }],
  creator: profileConfig.name || siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    locale: siteConfig.lang,
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
  other: {
    ...(themeConfig.darkReaderLock ? { 'darkreader-lock': '' } : {}),
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.lang} suppressHydrationWarning>
      <head>
        {themeConfig.darkReaderLock && <meta name="darkreader-lock" content="" />}
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var defaultMode = '${themeConfig.defaultMode || 'dark'}';
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = savedTheme ? savedTheme : (defaultMode === 'dark' ? 'dark' : (defaultMode === 'light' ? 'light' : (prefersDark ? 'dark' : 'light')));
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-paper-bg text-paper-ink flex flex-col antialiased selection:bg-paper-coral/25 selection:text-paper-coral">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
