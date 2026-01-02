import { MetadataRoute } from 'next';
import {
  getPromptCategories,
  getPromptsLastUpdated,
  getAllPrompts,
  getAllTags,
} from '@/lib/prompts';
import { getAllGuidesMeta } from '@/lib/guides';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://journalingtechniques.ai';
  const promptsLastUpdated = getPromptsLastUpdated() ?? new Date();
  const guides = await getAllGuidesMeta();
  const guideDates = guides
    .map((guide) => guide.updatedAt ?? guide.publishedAt)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()));
  const latestGuideUpdated =
    guideDates.length > 0
      ? new Date(Math.max(...guideDates.map((date) => date.getTime())))
      : promptsLastUpdated;
  const homepageLastModified = new Date(
    Math.max(promptsLastUpdated.getTime(), latestGuideUpdated.getTime())
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: homepageLastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/app`,
      lastModified: homepageLastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: promptsLastUpdated,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: latestGuideUpdated,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: homepageLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const categories = getPromptCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/prompts/${category.slug}`,
    lastModified: promptsLastUpdated,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.updatedAt ?? guide.publishedAt ?? latestGuideUpdated,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const allPrompts = getAllPrompts();
  const promptRoutes: MetadataRoute.Sitemap = allPrompts.map((prompt) => ({
    url: `${baseUrl}/prompts/${prompt.category}/${prompt.id}`,
    lastModified: promptsLastUpdated,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const allTags = getAllTags();
  const tagRoutes: MetadataRoute.Sitemap = allTags.map((tag) => ({
    url: `${baseUrl}/tags/${tag}`,
    lastModified: promptsLastUpdated,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...guideRoutes,
    ...promptRoutes,
    ...tagRoutes,
  ];
}
