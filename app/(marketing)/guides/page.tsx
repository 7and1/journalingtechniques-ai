import type { Metadata } from 'next';
import { GuideCard } from '@/components/marketing/GuideCard';
import { getAllGuidesMeta } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Journaling Guides & Playbooks',
  description:
    'Deep-dive guides on CBT-style journaling, gratitude practices, and reflection techniques. Each guide is paired with ready-to-use prompts.',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Journaling Guides | journalingtechniques.ai',
    description: 'Journaling guides with ready-to-use prompts.',
    url: 'https://journalingtechniques.ai/guides',
    images: [
      {
        url: 'https://journalingtechniques.ai/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Journaling Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journaling Guides & Playbooks',
    description:
      'Deep-dive guides on CBT-style journaling and reflection techniques.',
    images: ['https://journalingtechniques.ai/opengraph-image'],
  },
};

export default async function GuidesIndexPage() {
  const guides = await getAllGuidesMeta();

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-16 text-slate-900 dark:text-slate-50">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Guides
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">
          Journaling playbooks
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Learn practical techniques, grab structured templates, and jump
          straight into the private AI journal when inspiration strikes.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </main>
  );
}
