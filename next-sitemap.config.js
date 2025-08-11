/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Use a real domain in production. Falls back to NEXT_PUBLIC_APP_URL or a safe default.
  siteUrl:
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://your-app-name.netlify.app',

  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/server-sitemap.xml', '/api/*', '/_next/*'],

  // If you eventually have a lot of pages, chunk sitemaps to stay under 50k URLs/file
  // sitemapSize: 45000,

  // Transform each path (url) before writing
  transform: async (config, url) => {
    // Skip API/internal paths (belt and braces — we also excluded above)
    if (url.startsWith('/api/') || url.startsWith('/_next/')) {
      return null;
    }

    return {
      loc: url, // next-sitemap will prefix with siteUrl
      changefreq: 'weekly',
      priority: url === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },

  // Add specific static paths
  additionalPaths: async (config) => {
    const now = new Date().toISOString();
    const staticPages = [
      '/',
      '/signin',
      '/signup',
      '/dashboard',
      '/tutors',
      '/students',
      '/courses',
      '/pricing',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
    ];

    return staticPages.map((page) => ({
      loc: page,
      changefreq: 'monthly',
      priority: page === '/' ? 1.0 : 0.7,
      lastmod: now,
    }));
  },

  // robots.txt
  robotsTxtOptions: {
    additionalSitemaps: [
      `${
        process.env.SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'https://your-app-name.netlify.app'
      }/server-sitemap.xml`,
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/private/'],
      },
    ],
  },
};