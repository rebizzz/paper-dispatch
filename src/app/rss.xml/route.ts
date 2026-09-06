import { getAllPosts } from '@/lib/posts';
import siteConfig from '@/site.config';

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = siteConfig.site.url;

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`;
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${(post.tags || []).map((t) => `<category>${t}</category>`).join('')}
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.site.title}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteConfig.site.description}]]></description>
    <language>${siteConfig.site.lang}</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
