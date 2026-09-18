// Generate public/sitemap.xml từ routes + guides. Chạy: node scripts/sitemap.mjs
// (Chạy lại mỗi khi thêm bài giảng mới rồi commit sitemap kèm theo.)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, '..');
const BASE = 'https://nguyen-phuc-dai.vercel.app';
const today = new Date().toISOString().slice(0, 10);

const guidesSrc = fs.readFileSync(path.join(ROOT, 'src/data/guides.ts'), 'utf8');
const slugs = [...guidesSrc.matchAll(/^  '([^']+)': \{$/gm)].map((m) => m[1]);

const urls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9' },
  { loc: '/blog/blind75', changefreq: 'weekly', priority: '0.9' },
  ...slugs.map((s) => ({ loc: `/blog/${s}`, changefreq: 'monthly', priority: '0.8' })),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n') +
  `\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml: ${urls.length} urls (${slugs.length} guides)`);
