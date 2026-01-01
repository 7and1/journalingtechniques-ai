export function countCjkChars(text: string): number {
  if (!text) return 0;
  const matches = text.match(
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g
  );
  return matches ? matches.length : 0;
}

export function isMostlyCjk(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const nonSpace = trimmed.replace(/\s+/g, '');
  if (!nonSpace) return false;
  const cjkCount = countCjkChars(nonSpace);
  if (cjkCount < 8) return false;
  return cjkCount / nonSpace.length >= 0.3;
}
