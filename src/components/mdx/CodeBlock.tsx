'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal, FileCode, WrapText } from 'lucide-react';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  filename?: string;
  raw?: string;
  [key: string]: any;
}

const languageLabels: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  nix: 'Nix',
  sh: 'Bash',
  bash: 'Bash',
  zsh: 'Zsh',
  py: 'Python',
  python: 'Python',
  rs: 'Rust',
  rust: 'Rust',
  json: 'JSON',
  css: 'CSS',
  html: 'HTML',
  md: 'Markdown',
  mdx: 'MDX',
  yml: 'YAML',
  yaml: 'YAML',
  toml: 'TOML',
};

function extractText(node: React.ReactNode): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    return extractText((node.props as any)?.children);
  }
  return '';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className = '',
  filename,
  raw,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(false);

  // Detect language from props or from inner code element
  let detectedLang = '';
  if (className) {
    const match = /language-([a-zA-Z0-9_-]+)/.exec(className);
    if (match) detectedLang = match[1];
  }

  if (!detectedLang && React.isValidElement(children)) {
    const childProps = children.props as any;
    if (childProps?.['data-language']) {
      detectedLang = childProps['data-language'];
    } else if (childProps?.className) {
      const match = /language-([a-zA-Z0-9_-]+)/.exec(childProps.className);
      if (match) detectedLang = match[1];
    }
  }

  const displayLang = languageLabels[detectedLang.toLowerCase()] || detectedLang.toUpperCase() || 'Code';

  const handleCopy = async () => {
    const textToCopy = raw || extractText(children);
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code text', err);
    }
  };

  return (
    <div className="code-block-wrapper group relative my-8 w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-[#26262e] bg-[#0f0f13] shadow-2xl transition-all duration-200 hover:border-[#34343e]">
      {/* Code Editor Header Bar */}
      <div className="flex items-center justify-between border-b border-[#222228] bg-[#16161c] px-3 sm:px-4 py-2.5 sm:py-3 select-none gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
          {/* macOS traffic light dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/50 shadow-sm" />
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/50 shadow-sm" />
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/50 shadow-sm" />
          </div>

          {/* Filename or Language indicator */}
          <div className="flex min-w-0 items-center gap-1.5 text-xs font-mono">
            {filename ? (
              <span className="flex min-w-0 items-center gap-1.5 rounded-md bg-[#22222c] px-2 sm:px-2.5 py-1 text-xs font-medium text-zinc-200 border border-[#2e2e38]">
                <FileCode className="h-3.5 w-3.5 shrink-0 text-paper-coral" />
                <span className="truncate max-w-[110px] sm:max-w-none">{filename}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-md bg-[#22222c] px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide text-zinc-200 border border-[#2e2e38] uppercase">
                <Terminal className="h-3.5 w-3.5 shrink-0 text-paper-coral" />
                <span>{displayLang}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Wrap Toggle & Copy */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setWrap(!wrap)}
            aria-label="Toggle word wrap"
            title="Toggle word wrap"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
              wrap
                ? 'border-paper-coral/40 bg-[#252530] text-paper-coral'
                : 'border-[#2e2e3a] bg-[#1c1c24] text-zinc-400 hover:text-zinc-200 hover:bg-[#252530]'
            }`}
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleCopy}
            aria-label="Copy snippet"
            className="flex items-center gap-1.5 rounded-lg border border-[#2e2e3a] bg-[#1c1c24] px-2.5 sm:px-3 py-1.5 text-xs font-mono text-zinc-300 transition-all hover:border-paper-coral/40 hover:bg-[#252530] hover:text-white active:scale-95 shadow-sm"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-paper-green shrink-0" />
                <span className="text-paper-green font-medium hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200 shrink-0" />
                <span className="text-zinc-400 group-hover:text-zinc-200 hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Iosevka + JetBrains Mono ligatures */}
      <div
        className={`overflow-x-auto py-4 font-mono text-[14.5px] sm:text-[15px] leading-[1.8] text-[#d4d4dc] bg-[#0f0f13] selection:bg-paper-coral/30 selection:text-white ${
          wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
