import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PROMPT_ID,
  buildPrefill,
  getGuidedPrompts,
} from '../guided-prompts';

describe('guided-prompts', () => {
  describe('getGuidedPrompts', () => {
    it('should have 3 prompt templates', () => {
      expect(getGuidedPrompts('en')).toHaveLength(3);
      expect(getGuidedPrompts('zh')).toHaveLength(3);
    });

    it('should have required IDs', () => {
      const ids = getGuidedPrompts('en').map((p) => p.id);
      expect(ids).toContain('daily_reflection');
      expect(ids).toContain('cbt_thought_record');
      expect(ids).toContain('gratitude_growth');
    });

    it('should have all required fields', () => {
      getGuidedPrompts('en').forEach((prompt) => {
        expect(prompt).toHaveProperty('id');
        expect(prompt).toHaveProperty('label');
        expect(prompt).toHaveProperty('description');
        expect(prompt).toHaveProperty('questions');
        expect(Array.isArray(prompt.questions)).toBe(true);
        expect(prompt.questions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('DEFAULT_PROMPT_ID', () => {
    it('should be daily_reflection', () => {
      expect(DEFAULT_PROMPT_ID).toBe('daily_reflection');
    });
  });

  describe('buildPrefill', () => {
    it('should build prefill text from questions', () => {
      const prefill = buildPrefill('daily_reflection');
      const dailyPrompt = getGuidedPrompts('en').find(
        (p) => p.id === 'daily_reflection'
      )!;

      expect(prefill).toBe(dailyPrompt.questions.join('\n\n'));
    });

    it('should handle all prompt types', () => {
      const cbtPrefill = buildPrefill('cbt_thought_record');
      const gratitudePrefill = buildPrefill('gratitude_growth');

      expect(cbtPrefill).toContain('situation');
      expect(gratitudePrefill).toContain('grateful');
    });

    it('should fallback to default for invalid ID', () => {
      // @ts-expect-error - testing invalid ID
      const prefill = buildPrefill('invalid_id');
      const defaultPrompt = getGuidedPrompts('en')[0];

      expect(prefill).toBe(defaultPrompt.questions.join('\n\n'));
    });
  });
});
