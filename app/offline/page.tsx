import Link from 'next/link';
import { getLocale } from '@/lib/i18n/server';

export default async function OfflinePage() {
  const locale = await getLocale();
  const title = locale === 'zh' ? '你已离线' : "You're offline";
  const body =
    locale === 'zh'
      ? '当前网络不可用。你仍然可以打开已缓存的页面，或返回日记应用继续写作。'
      : 'Network is unavailable. You can still use cached pages, or go back to the journal app to keep writing.';

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-20 text-slate-900 dark:text-slate-50">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
          PWA
        </p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-dark"
          >
            {locale === 'zh' ? '打开日记应用' : 'Open journal app'}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            {locale === 'zh' ? '返回首页' : 'Back to home'}
          </Link>
        </div>
      </div>
    </main>
  );
}
