import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { mdxComponents } from './MDXComponents';

interface MDXRendererProps {
  source: string;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose max-w-none prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: 'tokyo-night',
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
