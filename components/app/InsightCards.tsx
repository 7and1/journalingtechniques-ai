import type { InsightBundle } from '@/lib/ai/types';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface InsightCardsProps {
  data: InsightBundle;
}

export function InsightCards({ data }: InsightCardsProps) {
  const locale = getClientLocale();
  const confidencePercent = Math.round(data.emotion.confidence * 100);
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-3">
      <InsightCard
        emoji={data.emotion.emoji}
        title={t(locale, 'insights.emotion.title')}
        body={data.emotion.text}
        footer={t(locale, 'insights.emotion.confidence', {
          percent: confidencePercent,
        })}
      />
      <InsightCard
        emoji={data.theme.emoji}
        title={t(locale, 'insights.theme.title')}
        body={data.theme.text}
      />
      <InsightCard
        emoji={data.reflection.emoji}
        title={t(locale, 'insights.reflection.title')}
        body={`"${data.reflection.question}"`}
        footer={t(locale, 'insights.reflection.technique', {
          technique: data.reflection.technique,
        })}
      />
    </div>
  );
}

interface InsightCardProps {
  emoji: string;
  title: string;
  body: string;
  footer?: string;
}

function InsightCard({ emoji, title, body, footer }: InsightCardProps) {
  return (
    <article
      className="animate-fadeInUp rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/40"
      role="region"
      aria-label={title}
    >
      <div className="text-3xl" role="img" aria-label={`${title} icon`}>
        {emoji}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="mt-2 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
        {body}
      </p>
      {footer ? (
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          {footer}
        </p>
      ) : null}
    </article>
  );
}
