import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptCard } from '@/components/marketing/PromptCard';
import { getAllPrompts, getAllTags } from '@/lib/prompts';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const displayTag =
    tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');

  return {
    title: `${displayTag} Journal Prompts | journalingtechniques.ai`,
    description: `Explore journal prompts tagged with ${displayTag}. Find CBT-inspired prompts for self-reflection and personal growth.`,
    alternates: { canonical: `/tags/${tag}` },
    openGraph: {
      title: `${displayTag} Journal Prompts`,
      description: `Explore journal prompts tagged with ${displayTag}. Find CBT-inspired prompts for self-reflection and personal growth.`,
      url: `https://journalingtechniques.ai/tags/${tag}`,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const allPrompts = getAllPrompts();
  const allTags = getAllTags();

  const taggedPrompts = allPrompts.filter((prompt) =>
    prompt.tags?.includes(tag)
  );

  if (taggedPrompts.length === 0) {
    notFound();
  }

  const displayTag =
    tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');
  const otherTags = allTags.filter((t) => t !== tag).slice(0, 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${displayTag} Journal Prompts`,
    description: `Explore journal prompts tagged with ${displayTag}. Find CBT-inspired prompts for self-reflection and personal growth.`,
    url: `https://journalingtechniques.ai/tags/${tag}`,
    numberOfItems: taggedPrompts.length,
    about: {
      '@type': 'Thing',
      name: displayTag,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">#{tag}</h1>
          <p className="text-muted-foreground text-xl">
            {taggedPrompts.length}{' '}
            {taggedPrompts.length === 1 ? 'prompt' : 'prompts'} tagged with{' '}
            {displayTag}
          </p>
        </header>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {taggedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {otherTags.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="mb-4 text-2xl font-bold">Explore Other Tags</h2>
            <div className="flex flex-wrap gap-2">
              {otherTags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${t}`}
                  className="bg-secondary hover:bg-secondary/80 inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
