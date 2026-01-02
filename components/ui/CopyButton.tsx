'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.warn('[CopyButton] Failed to copy', error);
    }
  };

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {copied ? 'Copied!' : 'Copy prompt'}
    </button>
  );
}
