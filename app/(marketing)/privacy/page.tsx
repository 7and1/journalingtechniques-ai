import type { Metadata } from 'next';
import { getLocale } from '@/lib/i18n/server';
import { t } from '@/lib/i18n/translate';

export const metadata: Metadata = {
  title: 'Privacy Promise | journalingtechniques.ai',
  description:
    'How journalingtechniques.ai keeps your journal text private: on-device AI, local storage, and anonymous analytics metadata only.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Promise | journalingtechniques.ai',
    description:
      'On-device AI analysis, zero journal-text uploads, and transparent privacy guarantees.',
    url: '/privacy',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Privacy Promise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Promise | journalingtechniques.ai',
    description: 'On-device AI analysis with zero journal-text uploads.',
    images: ['/opengraph-image'],
  },
};

const trustBulletsByLocale = {
  en: [
    'AI models download to your browser via HTTPS and cache in IndexedDB',
    'Journal text never leaves memory — there is no server or API receiving it',
    'Analytics collect anonymous metadata only (word counts, prompt types)',
  ],
  zh: [
    'AI 模型通过 HTTPS 下载到浏览器，并缓存到 IndexedDB',
    '日记文本不离开本机内存——没有任何服务器或 API 接收它',
    '统计仅收集匿名元数据（词数、模板类型等）',
  ],
} as const;

export default async function PrivacyPage() {
  const locale = await getLocale();
  const trustBullets = trustBulletsByLocale[locale];
  const diagram =
    locale === 'zh'
      ? `你的浏览器
   │
   ├─ 从 CDN 加载静态 Next.js 站点
   │
   ├─ 通过 Transformers.js 下载 Hugging Face 模型（仅一次）
   │
   ├─ 本地运行情绪 + 主题分析（WebAssembly/WebGPU）
   │
   └─ 展示洞察 + CBT 反思问题

你的文本 0 次 API 请求。唯一可选遥测：👍/👎 有无帮助。`
      : `Your Browser
   │
   ├─ Loads static Next.js site from CDN
   │
   ├─ Downloads Hugging Face models (once) via Transformers.js
   │
   ├─ Runs emotion + theme analysis locally (WebAssembly/WebGPU)
   │
   └─ Shows insights + CBT question

Zero API calls with your text. Only optional telemetry: helpful/not helpful clicks.`;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-16 text-slate-800 dark:text-slate-200">
      <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">
        {t(locale, 'privacy.title')}
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300">
        {t(locale, 'privacy.subtitle')}
      </p>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {t(locale, 'privacy.howItWorks')}
        </h2>
        <pre className="mt-4 overflow-auto rounded-2xl bg-slate-900 p-4 font-mono text-sm text-slate-100">
          {diagram}
        </pre>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {t(locale, 'privacy.whatWeLog')}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="text-sm font-semibold text-emerald-700">
              {t(locale, 'privacy.weCollect')}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-emerald-900">
              <li>• Prompt type (daily reflection / CBT / gratitude)</li>
              <li>• Word count + character count</li>
              <li>• Whether insights were helpful (👍/👎)</li>
              <li>• Model download duration (for performance tuning)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <p className="text-sm font-semibold text-red-700">
              {t(locale, 'privacy.weNeverCollect')}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-red-900">
              <li>• Raw journal text or generated insights</li>
              <li>• IP addresses, cookies, device IDs</li>
              <li>• Names, emails, or any identity markers</li>
              <li>• Anything that could be reconstructed into your story</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {t(locale, 'privacy.trustChecklist')}
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {trustBullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="text-brand" aria-hidden="true">
                ●
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t(locale, 'privacy.footer')}
      </p>
    </main>
  );
}
