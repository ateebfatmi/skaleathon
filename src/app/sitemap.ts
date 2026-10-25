import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skaleathon.skalekraft.in';
  const routes = [
    '',
    '/tracks',
    '/prizes',
    '/rules',
    '/faq',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/code-of-conduct',
    '/register',
    '/leaderboard',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '' || route === '/leaderboard' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/register' ? 0.9 : 0.7,
  }));
}
