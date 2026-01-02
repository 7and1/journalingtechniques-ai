import path from 'node:path';
import { promises as fs } from 'node:fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const GUIDES_PATH = path.join(process.cwd(), 'content/guides');

export interface GuideFrontmatter {
  title: string;
  description: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
  tags?: string[];
  featured?: boolean;
  seo?: {
    title?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface GuideMeta extends GuideFrontmatter {
  slug: string;
}

export interface GuideContent extends GuideMeta {
  contentHtml: string;
}

export async function getGuideSlugs() {
  const files = await fs.readdir(GUIDES_PATH);
  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.(mdx?|md)$/, ''));
}

export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  const mdxPath = path.join(GUIDES_PATH, `${slug}.mdx`);
  const mdPath = path.join(GUIDES_PATH, `${slug}.md`);

  let filePath = mdxPath;
  try {
    await fs.access(mdxPath);
  } catch {
    try {
      await fs.access(mdPath);
      filePath = mdPath;
    } catch {
      console.error(`[guides] File not found for ${slug}`);
      return null;
    }
  }

  try {
    const source = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(source);
    return { slug, ...(data as GuideFrontmatter) };
  } catch (error) {
    console.error(`[guides] Failed to load meta for ${slug}`, error);
    return null;
  }
}

export async function getAllGuidesMeta(): Promise<GuideMeta[]> {
  const slugs = await getGuideSlugs();
  const guides = await Promise.all(slugs.map((slug) => getGuideMeta(slug)));
  return guides
    .filter((guide): guide is GuideMeta => Boolean(guide))
    .sort((a, b) => {
      const aDate = a.updatedAt || a.publishedAt || '1970-01-01';
      const bDate = b.updatedAt || b.publishedAt || '1970-01-01';
      return bDate.localeCompare(aDate);
    });
}

export async function getGuideContent(
  slug: string
): Promise<GuideContent | null> {
  const mdxPath = path.join(GUIDES_PATH, `${slug}.mdx`);
  const mdPath = path.join(GUIDES_PATH, `${slug}.md`);

  let filePath = mdxPath;
  try {
    await fs.access(mdxPath);
  } catch {
    try {
      await fs.access(mdPath);
      filePath = mdPath;
    } catch {
      console.error(`[guides] File not found for ${slug}`);
      return null;
    }
  }

  try {
    const source = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(source);

    const processedContent = await remark().use(remarkHtml).process(content);
    const contentHtml = processedContent.toString();

    const readingTime =
      (data as GuideFrontmatter).readingTime || calculateReadingTime(content);

    return {
      slug,
      ...(data as GuideFrontmatter),
      readingTime,
      contentHtml,
    };
  } catch (error) {
    console.error(`[guides] Failed to compile guide ${slug}`, error);
    return null;
  }
}

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const cleanText = text
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_`]/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getRelatedGuides(
  guide: GuideMeta,
  limit = 2
): Promise<GuideMeta[]> {
  const allGuides = await getAllGuidesMeta();

  const related = allGuides
    .filter((g) => g.slug !== guide.slug)
    .map((g) => {
      let score = 0;
      const guideTags = guide.tags || [];
      const gTags = g.tags || [];

      const sharedTags = guideTags.filter((tag) => gTags.includes(tag));
      score += sharedTags.length * 3;

      if (guide.featured && g.featured) score += 2;

      return { guide: g, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.guide);

  if (related.length < limit) {
    const remaining = allGuides
      .filter((g) => g.slug !== guide.slug && !related.includes(g))
      .slice(0, limit - related.length);
    return [...related, ...remaining];
  }

  return related;
}

export async function searchGuides(query: string): Promise<GuideMeta[]> {
  const allGuides = await getAllGuidesMeta();
  const lower = query.trim().toLowerCase();

  if (!lower) return allGuides;

  return allGuides.filter((guide) => {
    const haystack = [
      guide.title,
      guide.description,
      guide.author,
      ...(guide.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(lower);
  });
}

export async function getGuidesByTag(tag: string): Promise<GuideMeta[]> {
  const allGuides = await getAllGuidesMeta();
  return allGuides.filter((guide) => guide.tags?.includes(tag));
}

export async function getAllGuideTags(): Promise<string[]> {
  const allGuides = await getAllGuidesMeta();
  const tagSet = new Set<string>();
  allGuides.forEach((guide) => {
    guide.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
