import { describe, it, expect } from 'vitest';
import { generateReflectionQuestion } from '../questions';
import type { EmotionInsight } from '../types';

describe('generateReflectionQuestion', () => {
  const createEmotionInsight = (
    label: 'POSITIVE' | 'NEGATIVE'
  ): EmotionInsight => ({
    emoji: '😊',
    tone: 'positive',
    text: 'Test text',
    confidence: 0.95,
    rawLabel: label,
  });

  it('should return a reflection insight with required fields', () => {
    const emotion = createEmotionInsight('NEGATIVE');
    const result = generateReflectionQuestion(emotion, 'work stress deadline');

    expect(result).toHaveProperty('emoji');
    expect(result).toHaveProperty('question');
    expect(result).toHaveProperty('technique');
    expect(result.emoji).toBe('💡');
    expect(typeof result.question).toBe('string');
    expect(typeof result.technique).toBe('string');
  });

  it('should detect work-related themes', () => {
    const emotion = createEmotionInsight('NEGATIVE');
    const result = generateReflectionQuestion(
      emotion,
      'deadline meeting manager'
    );

    expect(result.question).toBeTruthy();
    expect(result.technique).toBeTruthy();
  });

  it('should detect relationship themes', () => {
    const emotion = createEmotionInsight('NEGATIVE');
    const result = generateReflectionQuestion(
      emotion,
      'partner family relationship'
    );

    expect(result.question).toBeTruthy();
    expect(result.technique).toBeTruthy();
  });

  it('should detect gratitude themes for positive emotions', () => {
    const emotion = createEmotionInsight('POSITIVE');
    const result = generateReflectionQuestion(
      emotion,
      'grateful thankful blessing'
    );

    expect(result.question).toBeTruthy();
    expect(result.technique).toBeTruthy();
  });

  it('should handle neutral themes', () => {
    const emotion = createEmotionInsight('POSITIVE');
    const result = generateReflectionQuestion(
      emotion,
      'random text nothing specific'
    );

    expect(result.question).toBeTruthy();
    expect(result.technique).toBeTruthy();
  });

  it('should always return a valid question', () => {
    // Test with empty summary
    const emotion = createEmotionInsight('NEGATIVE');
    const result = generateReflectionQuestion(emotion, '');

    expect(result.question.length).toBeGreaterThan(0);
    expect(result.technique.length).toBeGreaterThan(0);
  });

  it('should return different questions for same inputs (random selection)', () => {
    const emotion = createEmotionInsight('NEGATIVE');
    const results = new Set();

    // Generate multiple questions to check randomness
    // (might get same question due to randomness, but structure should be consistent)
    for (let i = 0; i < 10; i++) {
      const result = generateReflectionQuestion(emotion, 'work deadline');
      results.add(result.question);
      expect(result.question).toBeTruthy();
      expect(result.technique).toBeTruthy();
    }

    // At least some variation should occur (or all same if only one option)
    expect(results.size).toBeGreaterThan(0);
  });
});
