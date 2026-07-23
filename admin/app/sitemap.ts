import type { MetadataRoute } from 'next';

const BASE = 'https://payrollia.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return [
    { url: `${BASE}/`,            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/indicacao`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacidade`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/termos`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: 'https://payrollia.com.br/faq', lastModified: new Date(), priority: 0.8 }
    ];
}