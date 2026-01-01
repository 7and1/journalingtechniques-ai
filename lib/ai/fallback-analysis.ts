'use client';

import type { Locale } from '@/lib/i18n/messages';
import { isMostlyCjk } from '@/lib/language';
import type {
  EmotionInsight,
  InsightBundle,
  ReflectionInsight,
  ThemeInsight,
} from './types';

/**
 * Fallback analysis using simple keyword-based rules
 * Used when AI models fail to load
 */

type TextLanguage = 'en' | 'zh';
type ThemeId = 'relationships' | 'work' | 'health' | 'personal' | 'emotions';

export interface FallbackAnalysisOptions {
  locale?: Locale;
  language?: TextLanguage;
}

const KEYWORDS: Record<
  TextLanguage,
  {
    positive: string[];
    negative: string[];
    themes: Record<ThemeId, string[]>;
  }
> = {
  en: {
    positive: [
      'happy',
      'joy',
      'excited',
      'grateful',
      'thankful',
      'love',
      'wonderful',
      'amazing',
      'great',
      'good',
      'better',
      'best',
      'excellent',
      'fantastic',
      'proud',
      'accomplished',
      'success',
      'achieve',
      'hope',
      'optimistic',
      'blessed',
      'peaceful',
      'calm',
      'relaxed',
      'content',
      'satisfied',
    ],
    negative: [
      'sad',
      'angry',
      'frustrated',
      'anxious',
      'worried',
      'stress',
      'depressed',
      'upset',
      'hurt',
      'pain',
      'afraid',
      'fear',
      'scared',
      'nervous',
      'overwhelmed',
      'tired',
      'exhausted',
      'lonely',
      'alone',
      'lost',
      'confused',
      'disappointed',
      'regret',
      'guilt',
      'shame',
      'hopeless',
      'helpless',
      'weak',
    ],
    themes: {
      relationships: [
        'friend',
        'family',
        'partner',
        'relationship',
        'love',
        'spouse',
        'parent',
        'child',
      ],
      work: [
        'work',
        'job',
        'career',
        'boss',
        'colleague',
        'project',
        'deadline',
        'office',
      ],
      health: [
        'health',
        'exercise',
        'sleep',
        'diet',
        'body',
        'pain',
        'doctor',
        'medication',
      ],
      personal: [
        'self',
        'myself',
        'identity',
        'growth',
        'change',
        'future',
        'goal',
        'dream',
      ],
      emotions: [
        'feel',
        'feeling',
        'emotion',
        'mood',
        'heart',
        'mind',
        'think',
        'thought',
      ],
    },
  },
  zh: {
    positive: [
      '开心',
      '快乐',
      '兴奋',
      '感恩',
      '感谢',
      '感激',
      '喜欢',
      '爱',
      '美好',
      '太好了',
      '不错',
      '顺利',
      '成功',
      '自豪',
      '满足',
      '平静',
      '放松',
      '安心',
      '希望',
      '乐观',
    ],
    negative: [
      '难过',
      '伤心',
      '生气',
      '愤怒',
      '烦躁',
      '焦虑',
      '担心',
      '压力',
      '抑郁',
      '沮丧',
      '不安',
      '痛苦',
      '害怕',
      '恐惧',
      '紧张',
      '崩溃',
      '疲惫',
      '累',
      '孤独',
      '迷茫',
      '困惑',
      '失望',
      '后悔',
      '内疚',
      '羞愧',
      '绝望',
      '无助',
    ],
    themes: {
      relationships: ['朋友', '家人', '伴侣', '关系', '爱人', '父母', '孩子'],
      work: [
        '工作',
        '上班',
        '职业',
        '老板',
        '同事',
        '项目',
        '截止',
        '绩效',
        '加班',
      ],
      health: [
        '健康',
        '运动',
        '睡眠',
        '饮食',
        '身体',
        '疼',
        '医生',
        '药',
        '生病',
      ],
      personal: ['自己', '自我', '成长', '变化', '未来', '目标', '梦想'],
      emotions: ['感觉', '感受', '情绪', '心情', '想', '思考', '念头', '担心'],
    },
  },
};

const THEME_NAMES: Record<Locale, Record<ThemeId, string>> = {
  en: {
    relationships: 'connections with others',
    work: 'professional life and career',
    health: 'health and wellbeing',
    personal: 'personal growth and identity',
    emotions: 'emotions and inner experience',
  },
  zh: {
    relationships: '人际关系与连接',
    work: '工作与职业',
    health: '健康与身心状态',
    personal: '自我成长与身份认同',
    emotions: '情绪与内在体验',
  },
};

const DEFAULT_THEME: Record<Locale, string> = {
  en: 'your current thoughts and experiences',
  zh: '你当下的想法与经历',
};

const REFLECTIONS: Record<
  Locale,
  Record<
    'positive' | 'negative' | 'neutral',
    Array<{ question: string; technique: string }>
  >
> = {
  en: {
    positive: [
      {
        question:
          'What made today feel special, and how can you create more moments like this?',
        technique: 'Positive psychology',
      },
      {
        question:
          'Who contributed to these positive feelings, and how can you express gratitude to them?',
        technique: 'Gratitude practice',
      },
      {
        question:
          'What strengths did you use today that led to this positive outcome?',
        technique: 'Strength spotting',
      },
    ],
    negative: [
      {
        question:
          'What evidence do I have that supports this feeling? What evidence contradicts it?',
        technique: 'CBT: evidence testing',
      },
      {
        question: 'If a friend felt this way, what would I tell them?',
        technique: 'Compassionate perspective',
      },
      {
        question:
          'What is one small step I can take today to feel slightly better?',
        technique: 'Behavioral activation',
      },
    ],
    neutral: [
      {
        question: 'What pattern do I notice in my thoughts today?',
        technique: 'Mindfulness',
      },
      {
        question: 'What am I avoiding thinking about, and why?',
        technique: 'Curiosity & inquiry',
      },
      {
        question: 'What would I like to be different tomorrow?',
        technique: 'Solution focus',
      },
    ],
  },
  zh: {
    positive: [
      {
        question:
          '今天让你感觉不错的关键是什么？下次你能如何复现其中的一小部分？',
        technique: '积极心理学',
      },
      {
        question: '是谁/什么帮助了你产生这些积极感受？你可以如何表达感谢？',
        technique: '感恩练习',
      },
      {
        question: '你今天用到了哪些优势或能力，让事情朝好的方向发展？',
        technique: '优势觉察',
      },
    ],
    negative: [
      {
        question: '支持这个感受的证据是什么？有没有任何证据与之相反？',
        technique: 'CBT：证据检验',
      },
      {
        question: '如果你的朋友也有同样的感受，你会怎么对他说？',
        technique: '自我同情',
      },
      {
        question: '今天你能做的一件最小行动是什么，让自己哪怕好一点点？',
        technique: '行为激活',
      },
    ],
    neutral: [
      {
        question: '今天你的想法里出现了什么重复模式？',
        technique: '正念觉察',
      },
      {
        question: '你在回避哪个念头？回避它对你有什么好处或代价？',
        technique: '好奇探索',
      },
      {
        question: '明天你希望有什么不一样？你能为此做哪一个小调整？',
        technique: '解决导向',
      },
    ],
  },
};

function countKeywordMatches(
  text: string,
  keywords: string[],
  lowerCase: boolean
): number {
  const haystack = lowerCase ? text.toLowerCase() : text;
  let matches = 0;
  keywords.forEach((keyword) => {
    const needle = lowerCase ? keyword.toLowerCase() : keyword;
    if (needle && haystack.includes(needle)) matches += 1;
  });
  return matches;
}

/**
 * Analyze emotion based on keyword matching
 */
function analyzeEmotionFallback(
  text: string,
  locale: Locale,
  language: TextLanguage
): EmotionInsight {
  const lowerCase = language === 'en';
  const positiveCount = countKeywordMatches(
    text,
    KEYWORDS[language].positive,
    lowerCase
  );
  const negativeCount = countKeywordMatches(
    text,
    KEYWORDS[language].negative,
    lowerCase
  );
  const total = positiveCount + negativeCount;
  const confidence =
    total > 0 ? Math.max(positiveCount, negativeCount) / total : 0.5;
  const isPositive = total > 0 ? positiveCount > negativeCount : false;

  if (total === 0) {
    return {
      emoji: '😐',
      tone: locale === 'zh' ? '中性或混合' : 'mixed or neutral',
      text:
        locale === 'zh'
          ? '这段文字的情绪倾向不明显，可能更接近中性或混合。'
          : "The emotional tone isn't obvious here — it may be mixed or neutral.",
      confidence,
      rawLabel: 'NEGATIVE',
    };
  }

  if (isPositive) {
    if (confidence > 0.7) {
      return {
        emoji: '😊',
        tone: locale === 'zh' ? '积极或有希望' : 'hopeful or encouraged',
        text:
          locale === 'zh'
            ? `你的文字整体更偏积极（基于 ${positiveCount} 个正向信号）。`
            : `Your writing suggests hopeful, encouraged energy (based on ${positiveCount} positive indicators).`,
        confidence,
        rawLabel: 'POSITIVE',
      };
    }
    return {
      emoji: '😌',
      tone: locale === 'zh' ? '平静或略偏积极' : 'calm or neutral-positive',
      text:
        locale === 'zh'
          ? `整体语气偏平静、略带积极（基于 ${positiveCount} 个正向信号）。`
          : `The tone feels calm with subtle optimism (based on ${positiveCount} positive indicators).`,
      confidence,
      rawLabel: 'POSITIVE',
    };
  }

  if (confidence > 0.7) {
    return {
      emoji: '😔',
      tone: locale === 'zh' ? '焦虑或低落' : 'frustrated or disappointed',
      text:
        locale === 'zh'
          ? `你的文字透露出一些压力或低落（基于 ${negativeCount} 个负向信号）。`
          : `There's a thread of frustration or disappointment (based on ${negativeCount} negative indicators).`,
      confidence,
      rawLabel: 'NEGATIVE',
    };
  }

  return {
    emoji: '😐',
    tone: locale === 'zh' ? '略偏消极' : 'slightly negative',
    text:
      locale === 'zh'
        ? `整体语气略偏消极，可能带有一些紧绷感（基于 ${negativeCount} 个负向信号）。`
        : `The tone leans mildly negative, suggesting some tension (based on ${negativeCount} negative indicators).`,
    confidence,
    rawLabel: 'NEGATIVE',
  };
}

/**
 * Extract theme based on keyword matching
 */
function extractThemeFallback(
  text: string,
  locale: Locale,
  language: TextLanguage
): { insight: ThemeInsight; themeId: ThemeId | null } {
  const lowerCase = language === 'en';
  const sourceText = lowerCase ? text.toLowerCase() : text;

  const scores: Record<ThemeId, number> = {
    relationships: 0,
    work: 0,
    health: 0,
    personal: 0,
    emotions: 0,
  };

  (Object.keys(scores) as ThemeId[]).forEach((theme) => {
    KEYWORDS[language].themes[theme].forEach((keyword) => {
      const needle = lowerCase ? keyword.toLowerCase() : keyword;
      if (needle && sourceText.includes(needle)) scores[theme] += 1;
    });
  });

  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]) as Array<
    [ThemeId, number]
  >;
  const [topTheme, topScore] = ordered[0];
  const themeId = topScore > 0 ? topTheme : null;

  const themeName = themeId
    ? THEME_NAMES[locale][themeId]
    : DEFAULT_THEME[locale];

  return {
    themeId,
    insight: {
      emoji: '🔍',
      title: locale === 'zh' ? '你正在处理的主题' : "What you're processing",
      text:
        locale === 'zh'
          ? `你似乎正在处理：${themeName}。`
          : `You seem to be working through ${themeName}.`,
      rawSummary: themeName,
    },
  };
}

/**
 * Generate reflection question
 */
function generateReflectionFallback(
  emotion: EmotionInsight,
  themeId: ThemeId | null,
  locale: Locale
): ReflectionInsight {
  const category =
    emotion.rawLabel === 'POSITIVE'
      ? 'positive'
      : emotion.confidence > 0.6
        ? 'negative'
        : 'neutral';

  const options = REFLECTIONS[locale][category];
  const selected = options[Math.floor(Math.random() * options.length)];
  const themeName = themeId ? THEME_NAMES[locale][themeId] : '';
  const contextHint =
    themeId && themeName
      ? locale === 'zh'
        ? ` 回答时可以想想「${themeName}」。`
        : ` Keep ${themeName} in mind while you answer.`
      : '';

  return {
    emoji: '💭',
    question: `${selected.question}${contextHint}`.trim(),
    technique: selected.technique,
  };
}

/**
 * Full fallback analysis
 */
export function analyzeFallback(
  text: string,
  options?: FallbackAnalysisOptions
): InsightBundle {
  console.log('[Fallback Analysis] Using rule-based analysis');

  const locale: Locale = options?.locale ?? 'en';
  const language: TextLanguage =
    options?.language ?? (isMostlyCjk(text) ? 'zh' : 'en');

  const emotion = analyzeEmotionFallback(text, locale, language);
  const { insight: theme, themeId } = extractThemeFallback(
    text,
    locale,
    language
  );
  const reflection = generateReflectionFallback(emotion, themeId, locale);

  return {
    emotion,
    theme,
    reflection,
  };
}

/**
 * Check if text is suitable for analysis
 */
export function isTextValid(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length >= 20; // At least 20 characters
}
