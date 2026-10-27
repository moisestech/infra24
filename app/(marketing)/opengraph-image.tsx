import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'DCC.miami — Digital Culture Center Miami: artist-centered digital culture, workshops, public programs, and creative technology in Miami';
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
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(145deg, #fafafa 0%, #e5e5e5 45%, #d4d4d4 100%)',
          color: '#171717',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#404040',
            }}
          >
            DCC.MIAMI
          </p>
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 22,
              fontWeight: 500,
              color: '#737373',
            }}
          >
            Digital Culture Center Miami
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              margin: 0,
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: 960,
              letterSpacing: '-0.025em',
            }}
          >
            Public digital culture infrastructure for Miami
          </p>
          <p
            style={{
              margin: '28px 0 0',
              fontSize: 24,
              lineHeight: 1.4,
              maxWidth: 900,
              color: '#404040',
            }}
          >
            Artists · workshops · fabrication · public programs · networks · civic interfaces
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
