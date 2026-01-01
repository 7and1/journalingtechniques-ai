export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Count CJK characters as units to support languages without whitespace between words.
  const cjkMatches = trimmed.match(
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g
  );
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // Count letter/number sequences from the remaining text.
  const withoutCjk = trimmed.replace(
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g,
    ' '
  );
  const wordMatches = withoutCjk.match(
    /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu
  );
  const wordCount = wordMatches ? wordMatches.length : 0;

  return cjkCount + wordCount;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
