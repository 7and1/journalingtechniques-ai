import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent } from '../analytics';

describe('analytics', () => {
  beforeEach(() => {
    // Reset window.plausible mock before each test
    globalThis.window = globalThis.window || ({} as Window & typeof globalThis);
    globalThis.window.plausible = vi.fn();
  });

  describe('trackEvent', () => {
    it('should call plausible with event name and props', () => {
      const mockPlausible = vi.fn();
      globalThis.window.plausible = mockPlausible;

      trackEvent('prompt_selected', { prompt_type: 'daily_reflection' });

      expect(mockPlausible).toHaveBeenCalledWith('prompt_selected', {
        props: { prompt_type: 'daily_reflection' },
      });
    });

    it('should not call plausible if window is undefined', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - Testing window undefined scenario
      globalThis.window = undefined;

      expect(() => trackEvent('prompt_selected')).not.toThrow();

      globalThis.window = originalWindow;
    });

    it('should block sensitive keys', () => {
      const mockPlausible = vi.fn();
      const mockConsoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      globalThis.window.plausible = mockPlausible;

      trackEvent('insight_completed', {
        journal: 'My private journal entry',
        word_count: 100,
      });

      expect(mockPlausible).not.toHaveBeenCalled();
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[analytics] blocked sensitive payload',
        expect.objectContaining({ journal: expect.any(String) })
      );

      mockConsoleWarn.mockRestore();
    });

    it('should allow non-sensitive props', () => {
      const mockPlausible = vi.fn();
      globalThis.window.plausible = mockPlausible;

      trackEvent('insight_completed', {
        word_count: 100,
        emotion_detected: 'positive',
        confidence_score: 0.95,
      });

      expect(mockPlausible).toHaveBeenCalledWith('insight_completed', {
        props: {
          word_count: 100,
          emotion_detected: 'positive',
          confidence_score: 0.95,
        },
      });
    });

    it('should handle empty props', () => {
      const mockPlausible = vi.fn();
      globalThis.window.plausible = mockPlausible;

      trackEvent('prompt_selected');

      expect(mockPlausible).toHaveBeenCalledWith('prompt_selected', {
        props: {},
      });
    });
  });
});
