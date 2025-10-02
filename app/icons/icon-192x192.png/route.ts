import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const width = 192;
  const height = 192;

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
            top: 8,
            left: 8,
            right: 8,
            height: 30,
            borderRadius: 16,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06), rgba(255,255,255,0))',
          }}
        />
        {/* 3D layered text */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 5,
              left: 6,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: 6,
              color: 'rgba(0,0,0,0.38)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SLW
          </div>
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: 3,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: 6,
              color: 'rgba(0,0,0,0.22)',
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
              fontSize: 84,
              letterSpacing: 6,
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
              top: -1,
              left: -1,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: 6,
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