'use client';

import type { ReactElement } from 'react';

interface MDXContentProps {
  content: ReactElement;
}

export function MDXContent({ content }: MDXContentProps) {
  return <div className="prose prose-lg prose-slate max-w-none">{content}</div>;
}
