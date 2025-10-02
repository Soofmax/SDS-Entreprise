import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const width = 512;
  const height = 512;

  const playfairBold = await fetch(
    'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXDTz-8a_hzA.woff2'
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background:
            'linear-gradient(135deg, #0b0b0b 0%, #1a0e14 35%, #3b0e24 75%, #C73863 100%)',
        }}
      >
        {/* Gloss highlight */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            right: 18,
            height: 96,
            borderRadius: 28,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06), rgba(255,255,255,0))',
          }}
        />
        {/* 3D layered text */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 16,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 240,
              letterSpacing: 10,
              color: 'rgba(0,0,0,0.42)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SLW
          </div>
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 8,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 240,
              letterSpacing: 10,
              color: 'rgba(0,0,0,0.28)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SLW
          </div>
          <div
            style={{
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 240,
              letterSpacing: 10,
              color: '#ffffff',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SLW
          </div>
          <div
            style={{
              position: 'absolute',
              top: -3,
              left: -3,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 240,
              letterSpacing: 10,
              color: 'rgba(255,255,255,0.16)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SLW
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: 'Playfair',
          data: playfairBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}