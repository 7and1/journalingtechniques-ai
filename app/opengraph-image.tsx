import { ImageResponse } from 'next/og';

export const alt =
  'Private AI Journaling - Your Journal Text Never Leaves Your Browser';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              marginBottom: 40,
              lineHeight: 1.2,
            }}
          >
            Private
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              marginBottom: 60,
              lineHeight: 1.2,
            }}
          >
            AI Journaling
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 400,
              opacity: 0.9,
              marginBottom: 20,
            }}
          >
            Your journal text never leaves your browser
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              opacity: 0.8,
              marginTop: 40,
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
            }}
          >
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
