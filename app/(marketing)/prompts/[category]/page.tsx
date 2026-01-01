import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptCard } from '@/components/marketing/PromptCard';
import {
  getCategory,
  getPromptCategories,
  getPromptsByCategory,
} from '@/lib/prompts';

interface PromptCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  const categories = getPromptCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: PromptCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) {
    return {};
  }
  const title = category.seo?.title ?? `${category.name} Journal Prompts`;
  const description =
    category.seo?.description ??
    `Browse curated ${category.name.toLowerCase()} journal prompts with CBT-inspired guidance.`;
  return {
    title,
    description,
    keywords: category.seo?.keywords,
    alternates: {
      canonical: `/prompts/${categorySlug}`,
    },
    openGraph: {
      title:
        category.seo?.title ??
        `${category.name} Prompts | journalingtechniques.ai`,
      description:
        category.seo?.description ??
        `Curated journal prompts focused on ${category.name.toLowerCase()} and emotional processing.`,
      url: `https://journalingtechniques.ai/prompts/${categorySlug}`,
      images: [
        {
          url: `https://journalingtechniques.ai/prompts/${categorySlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        `https://journalingtechniques.ai/prompts/${categorySlug}/opengraph-image`,
      ],
    },
  };
}

export default async function PromptCategoryPage({
  params,
}: PromptCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return notFound();
  const prompts = getPromptsByCategory(categorySlug);
  const related = getPromptCategories()
    .filter((item) => item.slug !== categorySlug)
    .slice(0, 3);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Journal Prompts`,
    description: category.description,
    numberOfItems: prompts.length,
    itemListElement: prompts.map((prompt, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: prompt.text,
        description: prompt.description,
        url: `https://journalingtechniques.ai/prompts/${categorySlug}/${prompt.id}`,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-5xl space-y-12 px-4 py-16 text-slate-900 dark:text-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
        <p className="text-4xl" aria-hidden="true">
          {category.icon ?? '📝'}
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-50">
          {category.name} journal prompts
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          {category.description}
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          {category.promptCount ?? prompts.length} prompts in this collection
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            ← Back to all prompts
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-soft"
          >
            Launch AI journal
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Prompts in this collection
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {related.length ? (
        <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Explore another focus area
          </h3>
          <div className="flex flex-wrap gap-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/prompts/${item.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
              >
                {item.icon ?? '📘'} {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
