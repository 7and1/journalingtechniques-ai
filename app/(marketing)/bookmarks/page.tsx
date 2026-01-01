import type { Metadata } from 'next';
import { BookmarksView } from '@/components/marketing/BookmarksView';

export const metadata: Metadata = {
  title: 'My Bookmarks - Journaling Techniques',
  description: 'View and manage your bookmarked journaling prompts',
  alternates: {
    canonical: '/bookmarks',
  },
  openGraph: {
    title: 'Bookmarks | journalingtechniques.ai',
    description: 'Your saved journal prompts for quick access.',
    url: '/bookmarks',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Bookmarks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bookmarks | journalingtechniques.ai',
    description: 'Your saved journal prompts for quick access.',
    images: ['/opengraph-image'],
  },
};

export default function BookmarksPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-slate-900 dark:text-slate-50">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          My Bookmarks
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Your saved journaling prompts for quick access
        </p>
      </header>
      <BookmarksView />
    </main>
  );
}
