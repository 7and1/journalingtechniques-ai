import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getLocale } from '@/lib/i18n/server';
import { PwaRegister } from '@/components/ui/PwaRegister';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'journalingtechniques.ai — Private AI Journaling',
  description:
    'Write freely, then get instant AI-powered emotional insights that never leave your browser. Your journal text stays local, powered by Transformers.js.',
  metadataBase: new URL('https://journalingtechniques.ai'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'journalingtechniques.ai — Private AI Journaling',
    description:
      'AI insights without the privacy trade-off. Your journal text never leaves your device.',
    url: 'https://journalingtechniques.ai',
    siteName: 'journalingtechniques.ai',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Private AI Journaling — Your Journal Text Never Leaves Your Browser',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'journalingtechniques.ai — Private AI Journaling',
    description:
      'Client-side AI insights for journalers who refuse to compromise on privacy.',
    images: ['/og-image.svg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body
        className={[
          inter.className,
          'bg-surface text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50',
        ].join(' ')}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var stored = window.localStorage.getItem('jt_theme');
    var theme = stored ? stored : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
            `.trim(),
          }}
        />
        {children}
        <PwaRegister />
        <Script
          defer
          data-domain={
            process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ??
            'journalingtechniques.ai'
          }
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <Script
          id="local-ai-privacy-log"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              'console.info(\"journalingtechniques.ai: AI processing stays local. Inspect the Network tab to verify no journal data is uploaded.\");',
          }}
        />
      </body>
    </html>
  );
}
