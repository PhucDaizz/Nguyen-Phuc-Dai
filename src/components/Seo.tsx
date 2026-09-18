import { useEffect } from 'react';

const BASE = 'https://nguyen-phuc-dai.vercel.app';

// Cập nhật <title>, meta description/canonical + JSON-LD theo từng route
// (SPA chỉ có 1 index.html nên phải làm động phía client).
export interface SeoProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  ogType?: string;
}

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const Seo = ({ title, description, path, jsonLd, ogType = 'website' }: SeoProps) => {
  useEffect(() => {
    const url = BASE + path;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    const SCRIPT_ID = 'route-jsonld';
    document.getElementById(SCRIPT_ID)?.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, [title, description, path, ogType, jsonLd]);

  return null;
};

export const articleJsonLd = (opts: {
  headline: string;
  description: string;
  path: string;
  difficulty?: string;
}): Record<string, unknown>[] => [
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.headline,
    description: opts.description,
    inLanguage: 'vi',
    author: { '@id': `${BASE}/#person` },
    publisher: { '@id': `${BASE}/#person` },
    mainEntityOfPage: `${BASE}${opts.path}`,
    ...(opts.difficulty ? { proficiencyLevel: opts.difficulty } : {}),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog thuật toán', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: opts.headline, item: `${BASE}${opts.path}` },
    ],
  },
];
