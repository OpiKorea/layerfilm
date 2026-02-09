import { getIdeas } from '@/lib/data';

// Force update: 2026-02-09


export async function GET() {
  const ideas = await getIdeas();
  const domain = 'https://layerfilm.com';

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LayerFilm - AI Cinema Releases</title>
    <link>${domain}</link>
    <description>Newest AI-generated films and series.</description>
    <language>en-us</language>
    <atom:link href="${domain}/feed.xml" rel="self" type="application/rss+xml" />
    ${ideas.map((idea) => `
    <item>
      <title><![CDATA[${idea.title}]]></title>
      <link>${domain}/idea/${idea.id}</link>
      <guid>${domain}/idea/${idea.id}</guid>
      <description><![CDATA[${idea.description}]]></description>
      <pubDate>${new Date(idea.created_at).toUTCString()}</pubDate>
      <enclosure url="${idea.videoUrl || ''}" type="video/mp4" />

    </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
