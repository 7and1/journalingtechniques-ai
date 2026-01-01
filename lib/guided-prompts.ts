import type { Locale } from '@/lib/i18n/messages';

export type PromptTemplateId =
  | 'daily_reflection'
  | 'cbt_thought_record'
  | 'gratitude_growth';

export interface PromptTemplate {
  id: PromptTemplateId;
  label: string;
  description: string;
  questions: string[];
}

const PROMPT_TEMPLATE_IDS: PromptTemplateId[] = [
  'daily_reflection',
  'cbt_thought_record',
  'gratitude_growth',
];

const GUIDED_PROMPTS_BY_LOCALE: Record<Locale, PromptTemplate[]> = {
  en: [
    {
      id: 'daily_reflection',
      label: '5-Minute Daily Reflection',
      description:
        'Perfect for end-of-day processing and setting a gentle intention for tomorrow.',
      questions: [
        'What happened today that triggered a strong emotion?',
        'What am I feeling right now, and why?',
        "What's one thing I can do tomorrow to feel better?",
      ],
    },
    {
      id: 'cbt_thought_record',
      label: 'CBT Thought Record',
      description:
        'Guides you through identifying situations, thoughts, emotions, and reframes.',
      questions: [
        'Describe the situation that bothered you.',
        'What automatic thoughts came up? What did you tell yourself?',
        'What emotions did you feel? (Rate intensity 0-10)',
        'Looking back, is there another way to see this situation?',
      ],
    },
    {
      id: 'gratitude_growth',
      label: 'Gratitude + Growth',
      description:
        'Blend positive psychology and growth mindset reflection in one flow.',
      questions: [
        "What's one thing I'm grateful for today?",
        "What's one challenge I faced, and what did I learn from it?",
        'How did I grow as a person today?',
      ],
    },
  ],
  zh: [
    {
      id: 'daily_reflection',
      label: '5 分钟每日复盘',
      description: '适合用来回顾一天、梳理情绪，并为明天定一个温柔的意图。',
      questions: [
        '今天发生了什么，让我产生了强烈的情绪？',
        '此刻我在感受什么？为什么？',
        '明天我可以做一件什么小事，让自己感觉更好？',
      ],
    },
    {
      id: 'cbt_thought_record',
      label: 'CBT 思维记录',
      description: '引导你识别情境、自动想法、情绪强度，以及更平衡的视角。',
      questions: [
        '描述让我不舒服的情境（只写事实）。',
        '当时我的自动想法是什么？我对自己说了什么？',
        '我感受到哪些情绪？强度 0-10 分。',
        '回头看，有没有另一种更平衡的解释？',
      ],
    },
    {
      id: 'gratitude_growth',
      label: '感恩 + 成长',
      description: '把积极心理学与成长型思维融合在一次书写中。',
      questions: [
        '今天我感恩的一件事是什么？为什么？',
        '今天我遇到的一个挑战是什么？我从中学到了什么？',
        '今天我在哪个方面变得更成熟/更强大了一点？',
      ],
    },
  ],
};

export function getGuidedPrompts(locale: Locale): PromptTemplate[] {
  return GUIDED_PROMPTS_BY_LOCALE[locale] ?? GUIDED_PROMPTS_BY_LOCALE.en;
}

export const DEFAULT_PROMPT_ID: PromptTemplateId = 'daily_reflection';

export function buildPrefill(
  id: PromptTemplateId,
  locale: Locale = 'en'
): string {
  const prompt =
    getGuidedPrompts(locale).find((item) => item.id === id) ??
    getGuidedPrompts('en')[0];
  return prompt.questions.join('\n\n');
}

export function isPromptTemplateId(value: unknown): value is PromptTemplateId {
  return (
    typeof value === 'string' &&
    PROMPT_TEMPLATE_IDS.includes(value as PromptTemplateId)
  );
}
