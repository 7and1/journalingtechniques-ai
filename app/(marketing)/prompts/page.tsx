import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptExplorer } from '@/components/marketing/PromptExplorer';
import { PromptCard } from '@/components/marketing/PromptCard';
import {
  getPromptCategories,
  getPromptStats,
  getFeaturedPrompts,
  getPromptStatsByCategory,
} from '@/lib/prompts';

export const metadata: Metadata = {
  title: 'Journal Prompt Library | journalingtechniques.ai',
  description:
    'Browse journal prompts covering anxiety relief, gratitude, and self-discovery. Filter by category, search keywords, and send any prompt to the private AI journal.',
  alternates: {
    canonical: '/prompts',
  },
  openGraph: {
    title: 'Journal Prompt Library | journalingtechniques.ai',
    description:
      'Search CBT-inspired journal prompts. Save favorites and launch the private AI journaling workspace in one click.',
    url: 'https://journalingtechniques.ai/prompts',
    images: [
      {
        url: 'https://journalingtechniques.ai/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Journal Prompt Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journal Prompt Library | journalingtechniques.ai',
    description:
      'Browse journal prompts across anxiety relief, gratitude, and self-discovery.',
    images: ['https://journalingtechniques.ai/opengraph-image'],
  },
};

export default function PromptsPage() {
  const categories = getPromptCategories();
  const stats = getPromptStats();
  const featured = getFeaturedPrompts(4);

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-16 text-slate-900 dark:text-slate-50">
      <header className="space-y-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Prompt Library
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">
          {stats.totalPrompts}+ journal prompts
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          CBT-inspired prompts for reflection. Filter by category, search by
          keyword, and send any prompt to the private AI journal in one click.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <StatCard label="Total prompts" value={`${stats.totalPrompts}+`} />
          <StatCard label="Categories" value={`${stats.categoryCount}`} />
        </dl>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Browse by focus area
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Click any category to see deep dives.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/prompts/${category.slug}`}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand/50 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <p className="text-3xl" aria-hidden="true">
                {category.icon ?? '📝'}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {category.description}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                {getPromptStatsByCategory(category.slug).total} prompts
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="featured-prompts">
        <div className="flex items-center justify-between">
          <h2
            id="featured-prompts"
            className="text-2xl font-semibold text-slate-900 dark:text-slate-50"
          >
            Featured prompts this week
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A few highlights to get you started
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="explore-prompts">
        <div>
          <h2
            id="explore-prompts"
            className="text-2xl font-semibold text-slate-900 dark:text-slate-50"
          >
            Search the full prompt database
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Filter by theme, technique, or tags. Click &ldquo;Try with AI&rdquo;
            to preload the private journaling workspace with that prompt.
          </p>
        </div>
        <PromptExplorer categories={categories} />
      </section>
    </main>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 text-left shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
      <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
        {value}
      </dd>
    </div>
  );
}
