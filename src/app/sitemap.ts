import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
 
const baseUrl = 'https://dicedb.io';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all pages from your Fumadocs source
  const pages = source.getPages();
 
  // Map the pages to the sitemap format
  const sitemapEntries: MetadataRoute.Sitemap = pages.map((page) => {
    return {
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // Add any other static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Add other static URLs here
  ];

  return [...staticPages, ...sitemapEntries];
}

// Optional: Revalidate the sitemap periodically
export const revalidate = 3600; // Revalidate at most every hour
