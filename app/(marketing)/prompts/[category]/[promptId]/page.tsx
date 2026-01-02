import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPromptById,
  getCategory,
  getRelatedPrompts,
  getAllPrompts,
} from '@/lib/prompts';
import { BookmarkButton } from '@/components/marketing/BookmarkButton';
import { CopyButton } from '@/components/ui/CopyButton';

interface Props {
  params: Promise<{ category: string; promptId: string }>;
}

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  return prompts.map((p) => ({ category: p.category, promptId: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { promptId } = await params;
  const prompt = getPromptById(promptId);
  if (!prompt) return {};

  const title = `${prompt.text.slice(0, 60)}${prompt.text.length > 60 ? '...' : ''} | Journal Prompt`;
  const description =
    prompt.description ||
    `A ${prompt.difficulty || 'guided'} journal prompt using ${prompt.technique || 'reflection'} technique.`;

  return {
    title,
    description,
    keywords: prompt.tags,
    alternates: {
      canonical: `/prompts/${prompt.category}/${prompt.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://journalingtechniques.ai/prompts/${prompt.category}/${prompt.id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { category, promptId } = await params;
  const prompt = getPromptById(promptId);

  if (!prompt || prompt.category !== category) {
    return notFound();
  }

  const categoryData = getCategory(category);
  const relatedPrompts = getRelatedPrompts(prompt, 3);

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: prompt.text,
    description: prompt.description || 'A guided journal prompt',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Read the prompt',
        text: prompt.text,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Reflect on your thoughts',
        text: 'Take a moment to think about the question and your personal experience.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Write your response',
        text: 'Use our AI-powered journaling app or write in your personal journal.',
      },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://journalingtechniques.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal Prompts',
        item: 'https://journalingtechniques.ai/prompts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryData?.name || category,
        item: `https://journalingtechniques.ai/prompts/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: prompt.text.slice(0, 50),
        item: `https://journalingtechniques.ai/prompts/${category}/${promptId}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-16 text-slate-900 dark:text-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link
          href="/prompts"
          className="hover:text-slate-900 dark:hover:text-slate-50"
        >
          All Prompts
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/prompts/${category}`}
          className="hover:text-slate-900 dark:hover:text-slate-50"
        >
          {categoryData?.name || category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-50">
          {prompt.text.slice(0, 40)}
          {prompt.text.length > 40 ? '...' : ''}
        </span>
      </nav>

      {/* Main Content */}
      <article className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
              <span>{categoryData?.icon || '📝'}</span>
              <span>{categoryData?.name || category}</span>
              {prompt.difficulty && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{prompt.difficulty}</span>
                </>
              )}
            </div>
          </div>
          <BookmarkButton
            promptId={prompt.id}
            category={prompt.category}
            size="md"
          />
        </div>

        <h1 className="mt-6 text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-50 md:text-4xl">
          {prompt.text}
        </h1>

        {prompt.description && (
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              About this prompt
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              {prompt.description}
            </p>
          </div>
        )}

        {prompt.technique && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Technique
            </h3>
            <p className="mt-2 inline-flex items-center rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
              {prompt.technique}
            </p>
          </div>
        )}

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Tags
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/prompts?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/app?prefill=${encodeURIComponent(prompt.text)}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark"
          >
            Try with AI →
          </Link>
          <CopyButton
            text={prompt.text}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          />
        </div>

        {prompt.aiSuggestion && (
          <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
            <strong>Tip:</strong> {prompt.aiSuggestion}
          </p>
        )}
      </article>

      {/* Related Prompts */}
      {relatedPrompts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Related prompts
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedPrompts.map((related) => (
              <Link
                key={related.id}
                href={`/prompts/${related.category}/${related.id}`}
                className="group rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                  {related.category}
                </p>
                <p className="mt-3 font-semibold text-slate-900 group-hover:text-brand dark:text-slate-50 dark:group-hover:text-brand">
                  {related.text.slice(0, 80)}
                  {related.text.length > 80 ? '...' : ''}
                </p>
                {related.technique && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {related.technique}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Category */}
      <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
        <Link
          href={`/prompts/${category}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
          ← Back to {categoryData?.name || category} prompts
        </Link>
      </div>
    </main>
  );
}
