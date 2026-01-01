import { ImageResponse } from 'next/og';
import { getCategory } from '@/lib/prompts';

export const runtime = 'edge';
export const alt = 'Journal Prompts';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <div style={{ fontSize: 96 }}>{category.icon || '📝'}</div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {category.name}
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.9,
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            {category.description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.8 }}>
            {category.promptCount || 30} prompts
          </div>
          <div style={{ fontSize: 32, fontWeight: 600 }}>
            journalingtechniques.ai
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
