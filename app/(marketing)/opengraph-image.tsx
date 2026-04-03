import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'Center of Digital Culture — Miami platform for artists, public learning, and digital culture infrastructure';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 72,
          background: 'linear-gradient(145deg, #fafafa 0%, #e5e5e5 45%, #d4d4d4 100%)',
          color: '#171717',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#525252',
          }}
        >
          Center of Digital Culture
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 18,
            fontWeight: 500,
            color: '#737373',
          }}
        >
          Powered by Infra24
        </p>
        <p
          style={{
            margin: '24px 0 0',
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.12,
            maxWidth: 920,
            letterSpacing: '-0.02em',
          }}
        >
          Miami · Public digital culture infrastructure
        </p>
        <p
          style={{
            margin: '28px 0 0',
            fontSize: 24,
            lineHeight: 1.45,
            maxWidth: 820,
            color: '#404040',
          }}
        >
          Workshops, public interfaces, and systems artists & organizations can actually maintain.
        </p>
      </div>
    ),
    { ...size }
  );
}
