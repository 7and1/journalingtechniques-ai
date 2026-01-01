import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';
import { PromptCard } from '@/components/marketing/PromptCard';
import { GuideCard } from '@/components/marketing/GuideCard';
import { ImpactStats } from '@/components/marketing/ImpactStats';
import { FeatureShowcase } from '@/components/marketing/FeatureShowcase';
import { PrivacyStack } from '@/components/marketing/PrivacyStack';
import { TrustBar } from '@/components/marketing/TrustBar';
import { TestimonialSpotlight } from '@/components/marketing/TestimonialSpotlight';
import {
  getFeaturedPrompts,
  getPromptCategories,
  getPromptStats,
  getPromptStatsByCategory,
} from '@/lib/prompts';
import { getAllGuidesMeta } from '@/lib/guides';

const howItWorks = [
  {
    title: 'Pick a guided template',
    description:
      'Choose from CBT thought records, gratitude flows, or daily reflection — or explore the prompt library.',
    step: '01',
  },
  {
    title: 'Write 50+ words',
    description:
      'The distraction-free editor autosaves locally so you never lose a thought, even if you close the tab.',
    step: '02',
  },
  {
    title: 'Get on-device insights',
    description:
      'Transformers.js detects emotion tone, surfaces themes, and suggests a CBT follow-up question without sending data to a server.',
    step: '03',
  },
];

export default async function HomePage() {
  const featuredPrompts = getFeaturedPrompts(2);
  const categories = getPromptCategories().slice(0, 3);
  const promptStats = getPromptStats();
  const allGuides = await getAllGuidesMeta();
  const guides = allGuides.slice(0, 2);
  const guideCount = allGuides.length;

  const stats = [
    {
      label: 'Prompt blueprints',
      value: `${promptStats.totalPrompts}+`,
      detail: `Across ${promptStats.categoryCount} categories.`,
    },
    {
      label: 'Practical guides',
      value: `${guideCount}`,
      detail: 'Each with reading time, tags, and related practice links.',
    },
    {
      label: 'On-device model passes',
      value: '3',
      detail: 'Emotion • Theme • CBT follow-up, all inside your browser.',
    },
    {
      label: 'Journal text uploads',
      value: '0',
      detail: 'Your writing stays local — no API receives your journal text.',
    },
  ];

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'journalingtechniques.ai',
    url: 'https://journalingtechniques.ai',
    logo: 'https://journalingtechniques.ai/icons/icon-512.png',
    description:
      'Private AI Journaling - Your Journal Text Never Leaves Your Browser',
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'journalingtechniques.ai',
    url: 'https://journalingtechniques.ai',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://journalingtechniques.ai/prompts?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />

      <TrustBar />

      <TestimonialSpotlight />

      <ImpactStats stats={stats} />

      <FeatureShowcase />

      <section id="prompts" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              Prompt library
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Guidance when you need it, privacy when you demand it
            </h2>
            <p className="text-lg text-slate-600">
              Explore prompts for anxiety relief, gratitude, and self-discovery.
              Send any prompt to the private AI workspace in one click.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/prompts/${category.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                >
                  <p className="text-2xl" aria-hidden="true">
                    {category.icon ?? '📝'}
                  </p>
                  <p className="mt-2 text-slate-500">{category.name}</p>
                  <p className="text-lg text-slate-900">
                    {getPromptStatsByCategory(category.slug).total} prompts
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:text-brand-dark hover:underline"
            >
              View the full prompt database →
            </Link>
          </div>
          <div className="space-y-4">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>

      <section id="guides" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              Guides
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Learn the science of journaling
            </h2>
            <p className="text-lg text-slate-600">
              Deep dives on CBT journaling, gratitude practices, and getting
              started. Every guide links directly to the AI editor so you can
              put it into practice immediately.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:text-brand-dark hover:underline"
            >
              Browse all guides →
            </Link>
          </div>
        </div>
      </section>

      <PrivacyStack />

      <section id="how-it-works" className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">
            Insights in under a minute — without leaving your browser
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            No accounts, no syncing, no journal-text uploads. Just a focused
            editor, local AI, and curated prompts.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article
              key={item.step}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {item.step}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="journal" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200">
            ✨ Ready to try
          </p>
          <h2 className="mt-4 text-3xl font-semibold">
            Start journaling with local AI insights
          </h2>
          <p className="mt-3 text-lg text-slate-200">
            Guided templates, autosaving editor, and theme detection run fully
            in your browser. Inspect the network tab if you don’t believe us.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-soft transition hover:-translate-y-0.5"
            >
              Launch Journal App →
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-4 text-lg font-semibold text-white transition hover:border-white"
            >
              Privacy Details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
