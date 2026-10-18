import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skaleathon.in';
  const now = new Date();

  const routes = [
    '',
    '/tracks',
    '/prizes',
    '/rules',
    '/faq',
    '/leaderboard',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/code-of-conduct',
    '/sign-in',
    '/register',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
