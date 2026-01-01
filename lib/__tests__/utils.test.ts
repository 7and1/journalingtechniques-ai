import { describe, it, expect } from 'vitest';
import { countWords, formatPercent } from '../utils';

describe('countWords', () => {
  it('should count words correctly', () => {
    expect(countWords('Hello world')).toBe(2);
    expect(countWords('  Hello   world  ')).toBe(2);
    expect(countWords('Hello, world! How are you?')).toBe(5);
  });

  it('should return 0 for empty string', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('should handle single word', () => {
    expect(countWords('Hello')).toBe(1);
  });

  it('should handle newlines', () => {
    expect(countWords('Hello\nworld\n\ntest')).toBe(3);
  });

  it('should handle special characters', () => {
    // Punctuation-only tokens are not counted as words.
    expect(countWords('Hello! @#$ World123')).toBe(2);
    expect(countWords('Hello! World!')).toBe(2);
  });

  it('should support CJK text without spaces', () => {
    expect(countWords('你好世界')).toBe(4);
    expect(countWords('今天心情不错。')).toBeGreaterThanOrEqual(6);
  });
});

describe('formatPercent', () => {
  it('should format decimal to percentage', () => {
    expect(formatPercent(0.5)).toBe('50%');
    expect(formatPercent(0.75)).toBe('75%');
    expect(formatPercent(1.0)).toBe('100%');
  });

  it('should round correctly', () => {
    expect(formatPercent(0.456)).toBe('46%');
    expect(formatPercent(0.789)).toBe('79%');
  });

  it('should handle edge cases', () => {
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(1)).toBe('100%');
  });
});
