import React from 'react';
import Link from 'next/link';
import { CodeBlock } from './CodeBlock';
import { VideoPlayer } from './VideoPlayer';
import { AudioPlayer } from './AudioPlayer';
import { ZoomableImage } from './ZoomableImage';
import { Callout } from './Callout';
import { Bookmark } from './Bookmark';
import { Badge } from './Badge';
import { AnimeDemo } from '../animations/AnimeDemo';
import { KineticStudio } from '../animations/KineticStudio';
import { KineticLogo } from '../animations/KineticLogo';

export const mdxComponents = {
  // Custom rich components
  CodeBlock,
  VideoPlayer,
  AudioPlayer,
  ZoomableImage,
  Callout,
  Bookmark,
  Badge,
  AnimeDemo,
  KineticStudio,
  KineticLogo,

  // HTML overrides
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-10 mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-paper-ink font-sans" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className="group mt-10 mb-4 border-b border-paper-border pb-2 text-2xl font-bold tracking-tight text-paper-ink font-sans flex items-baseline justify-between"
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 text-paper-coral font-mono text-sm transition-opacity ml-2 no-underline"
          aria-label="Link to section"
        >
          #
        </a>
      )}
    </h2>
  ),
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className="mt-8 mb-3 text-xl font-semibold tracking-tight text-paper-ink font-sans"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-5 leading-[1.8] text-paper-ink text-[15.5px]" {...props}>
      {children}
    </p>
  ),
  a: ({ href = '', children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith('/') || href.startsWith('#');
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-paper-coral underline underline-offset-4 hover:text-paper-coralLight transition-colors"
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-paper-coral underline underline-offset-4 hover:text-paper-coralLight transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-5 ml-6 list-disc space-y-2 text-paper-ink" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-5 ml-6 list-decimal space-y-2 text-paper-ink" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-paper-coral bg-paper-subtle pl-4 py-2 italic text-paper-ink rounded-r-xl"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-paper-border" />,
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-paper-border bg-paper-card">
      <table className="w-full text-left text-sm text-paper-ink" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-paper-border bg-paper-subtle px-4 py-3 font-semibold text-paper-ink" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-paper-border px-4 py-3" {...props}>
      {children}
    </td>
  ),
  img: ({ src = '', alt = '' }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <ZoomableImage src={src} alt={alt || ''} caption={alt} />
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
};
