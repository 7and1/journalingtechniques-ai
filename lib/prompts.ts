import promptsData from '@/content/prompts/prompts-database.json';

type RawCategories = typeof promptsData.categories;
type CategorySlug = keyof RawCategories;

export interface Prompt {
  id: string;
  text: string;
  category: string;
  subcategory?: string;
  difficulty?: string;
  technique?: string;
  description?: string;
  tags?: string[];
  aiSuggestion?: string;
  whyItWorks?: string;
  relatedPrompts?: string[];
}

export interface PromptCategory {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  promptCount?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

const PROMPTS = promptsData.prompts as Prompt[];

export function getAllPrompts(category?: CategorySlug): Prompt[] {
  if (!category) {
    return PROMPTS;
  }
  return PROMPTS.filter((prompt) => prompt.category === category);
}

export function getPromptCategories(): PromptCategory[] {
  return Object.entries(promptsData.categories).map(([slug, value]) => ({
    ...value,
    slug,
  }));
}

export function getCategory(slug: string): PromptCategory | undefined {
  const data = promptsData.categories[slug as CategorySlug];
  if (!data) return undefined;
  return { ...data, slug };
}

export function getPromptsByCategory(slug: string): Prompt[] {
  return PROMPTS.filter((prompt) => prompt.category === slug);
}

export function searchPrompts(query: string): Prompt[] {
  const lower = query.trim().toLowerCase();
  if (!lower) return [];
  return PROMPTS.filter((prompt) => {
    const inText = prompt.text.toLowerCase().includes(lower);
    const inTags = (prompt.tags || []).some((tag) =>
      tag.toLowerCase().includes(lower)
    );
    const inDescription = prompt.description?.toLowerCase().includes(lower);
    return inText || inTags || inDescription;
  });
}

export function getPromptStats() {
  const categories = getPromptCategories();
  return {
    totalPrompts: PROMPTS.length,
    categoryCount: categories.length,
  };
}

export function getPromptsLastUpdated(): Date | null {
  const raw = (promptsData as { lastUpdated?: unknown }).lastUpdated;
  if (typeof raw !== 'string') return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function stableHash(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getFeaturedPrompts(limit = 6): Prompt[] {
  const seed =
    typeof promptsData.lastUpdated === 'string'
      ? promptsData.lastUpdated
      : 'featured';
  const sorted = [...PROMPTS].sort(
    (a, b) => stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`)
  );
  return sorted.slice(0, limit);
}

export function getPromptById(id: string): Prompt | undefined {
  return PROMPTS.find((prompt) => prompt.id === id);
}

export function getRelatedPrompts(prompt: Prompt, limit = 3): Prompt[] {
  if (prompt.relatedPrompts && prompt.relatedPrompts.length > 0) {
    return prompt.relatedPrompts
      .map((id) => getPromptById(id))
      .filter((p): p is Prompt => Boolean(p))
      .slice(0, limit);
  }

  return PROMPTS.filter(
    (p) => p.id !== prompt.id && p.category === prompt.category
  ).slice(0, limit);
}

export type PromptSortOption = 'newest' | 'alphabetical' | 'difficulty';
export type PromptDifficulty = 'easy' | 'moderate' | 'advanced';

export interface PromptFilterOptions {
  category?: string;
  difficulty?: PromptDifficulty;
  technique?: string;
  tags?: string[];
  query?: string;
  sortBy?: PromptSortOption;
}

export function filterAndSortPrompts(
  options: PromptFilterOptions = {}
): Prompt[] {
  let filtered = [...PROMPTS];

  if (options.category) {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  if (options.difficulty) {
    filtered = filtered.filter((p) => p.difficulty === options.difficulty);
  }

  if (options.technique) {
    filtered = filtered.filter((p) => p.technique === options.technique);
  }

  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter((p) =>
      options.tags!.some((tag) => p.tags?.includes(tag))
    );
  }

  if (options.query) {
    const lower = options.query.trim().toLowerCase();
    filtered = filtered.filter((p) => {
      const haystack = [
        p.text,
        p.description,
        p.technique,
        p.subcategory,
        ...(p.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(lower);
    });
  }

  switch (options.sortBy) {
    case 'alphabetical':
      filtered.sort((a, b) => a.text.localeCompare(b.text));
      break;
    case 'difficulty':
      const difficultyOrder: Record<string, number> = {
        easy: 1,
        moderate: 2,
        advanced: 3,
      };
      filtered.sort((a, b) => {
        const aLevel = difficultyOrder[a.difficulty || 'moderate'];
        const bLevel = difficultyOrder[b.difficulty || 'moderate'];
        return aLevel - bLevel;
      });
      break;
    case 'newest':
    default:
      break;
  }

  return filtered;
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  PROMPTS.forEach((prompt) => {
    prompt.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getAllTechniques(): string[] {
  const techniqueSet = new Set<string>();
  PROMPTS.forEach((prompt) => {
    if (prompt.technique) techniqueSet.add(prompt.technique);
  });
  return Array.from(techniqueSet).sort();
}

export function getPromptStatsByCategory(slug: string) {
  const prompts = getPromptsByCategory(slug);
  const difficulties = {
    easy: prompts.filter((p) => p.difficulty === 'easy').length,
    moderate: prompts.filter((p) => p.difficulty === 'moderate').length,
    advanced: prompts.filter((p) => p.difficulty === 'advanced').length,
  };
  const techniques = new Set(prompts.map((p) => p.technique).filter(Boolean));

  return {
    total: prompts.length,
    difficulties,
    techniqueCount: techniques.size,
  };
}
