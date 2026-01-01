declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> }
    ) => void;
  }
}

type EventName =
  | 'prompt_selected'
  | 'writing_started'
  | 'writing_abandoned'
  | 'insight_requested'
  | 'model_download_started'
  | 'model_download_completed'
  | 'insight_completed'
  | 'feedback_positive'
  | 'feedback_negative'
  | 'error_occurred'
  | 'history_entry_loaded'
  | 'history_entry_saved'
  | 'history_entry_deleted'
  | 'new_entry_started'
  | 'history_cleared';

export type EventProps = {
  prompt_type?: 'daily_reflection' | 'cbt_thought_record' | 'gratitude_growth';
  word_count?: number;
  character_count?: number;
  emotion_detected?: 'positive' | 'negative';
  confidence_score?: number;
  analysis_duration_ms?: number;
  download_duration_ms?: number;
  error_type?: string;
  is_first_time?: boolean;
  [key: string]: unknown;
};

const SENSITIVE_KEYS = [
  'journal',
  'insight_text',
  'theme_summary',
  'user_text',
];

export function trackEvent(event: EventName, props?: EventProps) {
  if (typeof window === 'undefined') return;
  if (!window.plausible) return;

  if (props) {
    const hasSensitiveKey = Object.keys(props).some((key) =>
      SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))
    );

    if (hasSensitiveKey) {
      console.warn('[analytics] blocked sensitive payload', props);
      return;
    }
  }

  window.plausible(event, { props: props || {} });
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined') return;
  if (!window.plausible) return;
  window.plausible('pageview', {
    props: { url: url || window.location.pathname },
  });
}
