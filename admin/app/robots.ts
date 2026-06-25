import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
    rules: {
        userAgent: '*',
        allow: '/',
          disallow: ['/login', '/home', '/overview', '/clientes', '/config'], // painel admin fora do índice
    },
    sitemap: 'https://payrollia.com.br/sitemap.xml',
    host: 'https://payrollia.com.br',
    };
}