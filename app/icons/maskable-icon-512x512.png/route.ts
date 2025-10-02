import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const width = 512;
  const height = 512;

  const playfairBold = await fetch(
    'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXDTz-8a_hzA.woff2'
  ).then((r) => r.arrayBuffer());

  // Maskable: content centered with safe zone margin; solid background to edges
  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 50% 50%, #3b0e24 20%, #C73863 100%)',
          position: 'relative',
        }}
      >
        {/* Outer gloss */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            right: 18,
            height: 86,
            borderRadius: 28,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06), rgba(255,255,255,0))',
          }}
        />
        <div
          style={{
            width: 384, // safe zone
            height: 384,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 64,
            background:
              'linear-gradient(135deg, rgba(11,11,11,0.9) 0%, rgba(26,14,20,0.9) 65%, rgba(199,56,99,0.9) 100%)',
            border: '2px solid rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          {/* Inner gloss */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              height: 64,
              borderRadius: 56,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06), rgba(255,255,255,0))',
            }}
          />
          {/* 3D layered text */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 14,
                fontFamily: 'Playfair',
                fontWeight: 700,
                fontSize: 200,
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
                top: 5,
                left: 7,
                fontFamily: 'Playfair',
                fontWeight: 700,
                fontSize: 200,
                letterSpacing: 10,
                color: 'rgba(0,0,0,0.26)',
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
                fontSize: 200,
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
                fontSize: 200,
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