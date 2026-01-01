import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getGuideContent,
  getGuideMeta,
  getGuideSlugs,
  getRelatedGuides,
} from '@/lib/guides';
import { ReadingProgressButton } from '@/components/marketing/ReadingProgressButton';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideMeta(slug);
  if (!guide) return {};
  const title = guide.seo?.title ?? guide.title;
  return {
    title,
    description: guide.description,
    keywords: guide.seo?.keywords,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title,
      description: guide.description,
      type: 'article',
      url: `https://journalingtechniques.ai/guides/${slug}`,
      images: [
        {
          url: `https://journalingtechniques.ai/guides/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: guide.description,
      images: [
        `https://journalingtechniques.ai/guides/${slug}/opengraph-image`,
      ],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideContent(slug);
  if (!guide) {
    return notFound();
  }

  const relatedGuides = await getRelatedGuides(guide, 3);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    author: guide.author
      ? { '@type': 'Person', name: guide.author }
      : { '@type': 'Organization', name: 'journalingtechniques.ai' },
    publisher: {
      '@type': 'Organization',
      name: 'journalingtechniques.ai',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://journalingtechniques.ai/guides/${slug}`,
    },
    image: [`https://journalingtechniques.ai/guides/${slug}/opengraph-image`],
    keywords: guide.seo?.keywords?.join(', '),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-slate-900 dark:text-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/guides"
        className="text-sm font-semibold text-brand underline-offset-4 hover:text-brand-dark hover:underline"
      >
        ← Back to guides
      </Link>
      <header className="mt-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Guide
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">
          {guide.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {guide.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
          {guide.author ? <span>By {guide.author}</span> : null}
          {guide.publishedAt ? (
            <span>Published {formatDate(guide.publishedAt)}</span>
          ) : null}
          {guide.updatedAt ? (
            <span>Updated {formatDate(guide.updatedAt)}</span>
          ) : null}
          {guide.readingTime ? <span>{guide.readingTime}</span> : null}
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {guide.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-8 dark:border-slate-800">
        <ReadingProgressButton slug={guide.slug} />
      </div>
      <article className="prose prose-lg prose-slate mt-10 max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:mt-12 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl prose-p:mt-4 prose-p:leading-relaxed prose-a:font-semibold prose-a:text-brand prose-a:no-underline hover:prose-a:text-brand-dark hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-brand/40 prose-blockquote:bg-brand/5 prose-blockquote:italic dark:prose-blockquote:bg-brand/10">
        {guide.content}
      </article>
      <div className="mt-12 rounded-3xl border border-brand/20 bg-brand/5 p-6 text-center dark:bg-brand/10">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Ready to put this guide into practice?
        </p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Open the private AI journaling workspace with structured prompts and
          local insights.
        </p>
        <Link
          href="/app"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-soft"
        >
          Launch journaling workspace →
        </Link>
      </div>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Related Guides
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Continue learning with these related guides
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedGuides.map((relatedGuide) => (
              <Link
                key={relatedGuide.slug}
                href={`/guides/${relatedGuide.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/40"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {relatedGuide.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {relatedGuide.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {relatedGuide.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {relatedGuide.readingTime && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {relatedGuide.readingTime}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
