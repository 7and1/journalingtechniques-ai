import { trackEvent } from '@/lib/analytics';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface FeedbackButtonsProps {
  promptType: 'daily_reflection' | 'cbt_thought_record' | 'gratitude_growth';
  emotionLabel: 'positive' | 'negative';
  disabled: boolean;
  onAnswer: (value: 'positive' | 'negative') => void;
  wordCount: number;
  analysisDuration: number;
}

export function FeedbackButtons({
  promptType,
  emotionLabel,
  disabled,
  onAnswer,
  wordCount,
  analysisDuration,
}: FeedbackButtonsProps) {
  const locale = getClientLocale();
  const sendFeedback = (value: 'positive' | 'negative') => {
    if (disabled) return;
    trackEvent(
      value === 'positive' ? 'feedback_positive' : 'feedback_negative',
      {
        prompt_type: promptType,
        emotion_detected: emotionLabel,
        word_count: wordCount,
        analysis_duration_ms: analysisDuration,
      }
    );
    onAnswer(value);
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <p className="font-medium text-slate-500 dark:text-slate-400">
        {t(locale, 'feedback.title')}
      </p>
      <button
        type="button"
        onClick={() => sendFeedback('positive')}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60"
      >
        {t(locale, 'feedback.helpful')}
      </button>
      <button
        type="button"
        onClick={() => sendFeedback('negative')}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        {t(locale, 'feedback.notHelpful')}
      </button>
    </div>
  );
}
