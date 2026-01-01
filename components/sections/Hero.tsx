'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

const trustBulletsByLocale = {
  en: [
    'Client-side AI (Transformers.js)',
    'No accounts, no signup, no cloud journal storage',
    'No journal text uploads — verify in DevTools',
  ],
  zh: [
    '端侧 AI（Transformers.js）',
    '无需账号/注册/云端存储',
    '不上传日记文本，可在 Network 中验证',
  ],
} as const;

export function Hero() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const locale = getClientLocale();
  const trustBullets = trustBulletsByLocale[locale];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24">
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {locale === 'zh' ? '隐私优先' : 'Private-by-design'} • {currentYear}
          </p>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {locale === 'zh' ? '私密 AI 日记' : 'Private AI Journaling'}
            </h1>
            <p className="text-lg text-slate-600 sm:text-xl">
              {locale === 'zh'
                ? '用端侧 AI 获得情绪与思维洞察。分析完全在浏览器完成——你的日记文本不会触达任何服务器。'
                : 'Get insights on your emotions and thoughts powered by on-device AI. The analysis runs entirely in your browser — your journal text never touches a server.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              {locale === 'zh'
                ? '开始写作（免注册）'
                : 'Start Writing (No Signup)'}
            </Link>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:border-slate-400"
            >
              {t(locale, 'nav.prompts')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:border-slate-300"
            >
              {locale === 'zh' ? '阅读指南' : 'Read guides'}
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-sm text-slate-600 shadow-sm backdrop-blur">
            <p className="mb-3 font-semibold text-slate-900">
              {locale === 'zh'
                ? '🔒 你的日记永不离开本机'
                : '🔒 Your journal never leaves your device'}
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {trustBullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative rounded-3xl border border-blue-100 bg-white/60 p-6 shadow-[0_40px_120px_-60px_rgba(37,99,235,0.75)]">
          <div className="space-y-4 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              On-device AI pipeline
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                1. Emotion model
              </p>
              <p className="text-xs text-slate-500">
                DistilBERT classifies the emotional tone locally.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                2. Theme extractor
              </p>
              <p className="text-xs text-slate-500">
                DistilBART summarizes your writing into key themes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                3. CBT reflection question
              </p>
              <p className="text-xs text-slate-500">
                Rule-based reflection library inspired by CBT-style prompts.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                4. Prompt + guide ecosystem
              </p>
              <p className="text-xs text-slate-500">
                Prompts and deep-dive guides feed the workspace instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
