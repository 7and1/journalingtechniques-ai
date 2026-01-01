'use client';

import type { EmotionInsight, ReflectionInsight } from './types';

const QUESTION_BANK: Record<string, { question: string; technique: string }[]> =
  {
    NEGATIVE_work: [
      {
        question:
          'What would need to change at work for you to feel 10% better tomorrow?',
        technique: 'Solution-focused CBT',
      },
      {
        question:
          'If you could delegate one task right now, which one would give you the biggest relief?',
        technique: 'Behavioral activation',
      },
    ],
    NEGATIVE_relationships: [
      {
        question:
          'If a friend described this relationship moment to you, what advice would you offer them?',
        technique: 'Perspective shifting',
      },
      {
        question: 'What boundary would protect your energy here?',
        technique: 'Boundary clarity',
      },
    ],
    NEGATIVE_self: [
      {
        question:
          'What evidence contradicts the harshest thought you wrote down?',
        technique: 'Cognitive restructuring',
      },
      {
        question: 'How would compassionate you talk back to this thought?',
        technique: 'Self-compassion',
      },
    ],
    POSITIVE_achievement: [
      {
        question: 'What did you do to make this positive outcome possible?',
        technique: 'Strength spotting',
      },
    ],
    POSITIVE_gratitude: [
      {
        question:
          'How can you recreate the conditions that led to this feeling?',
        technique: 'Positive psychology',
      },
    ],
    NEUTRAL: [
      {
        question:
          'If you read this entry a year from now, what would you want future-you to remember?',
        technique: 'Future self visualization',
      },
    ],
  };

const KEYWORDS: Record<string, string[]> = {
  work: [
    'deadline',
    'manager',
    'coworker',
    'client',
    'meeting',
    'email',
    'promotion',
  ],
  relationships: [
    'partner',
    'relationship',
    'friend',
    'family',
    'mom',
    'dad',
    'spouse',
  ],
  self: ['confidence', 'identity', 'self-doubt', 'imposter', 'self', 'worth'],
  gratitude: ['grateful', 'thankful', 'appreciate', 'blessing'],
  achievement: ['launched', 'won', 'shipped', 'delivered', 'achieved'],
};

export function generateReflectionQuestion(
  emotion: EmotionInsight,
  rawSummary: string
): ReflectionInsight {
  const themeCategory = detectThemeCategory(rawSummary, emotion.rawLabel);
  const bucket =
    QUESTION_BANK[`${emotion.rawLabel}_${themeCategory}`] ||
    QUESTION_BANK[`${emotion.rawLabel}`] ||
    QUESTION_BANK.NEUTRAL;
  const choice =
    bucket[Math.floor(Math.random() * bucket.length)] ??
    QUESTION_BANK.NEUTRAL[0];
  return {
    emoji: '💡',
    question: choice.question,
    technique: choice.technique,
  };
}

function detectThemeCategory(summary: string, label: string): string {
  const lower = summary.toLowerCase();
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((word) => lower.includes(word))) {
      return category;
    }
  }
  if (label === 'POSITIVE' && lower.includes('grateful')) return 'gratitude';
  return label === 'POSITIVE' ? 'achievement' : 'self';
}
