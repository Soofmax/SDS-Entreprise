import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const width = 1200;
  const height = 630;

  // Load Playfair Display Bold for typographic consistency with the site
  const playfairBold = await fetch(
    // Google Fonts static woff2 for Playfair Display 700
    'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXDTz-8a_hzA.woff2'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0b0b0b 0%, #1a0e14 35%, #3b0e24 75%, #C73863 100%)',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 900,
            height: 900,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 50%, rgba(199,56,99,0.35), transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Gloss highlight */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            height: 140,
            borderRadius: 16,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05), rgba(255,255,255,0))',
          }}
        />
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
            position: 'relative',
          }}
        >
          {/* 3D layered text */}
          <div
            style={{
              position: 'relative',
              width: 'auto',
              height: 'auto',
            }}
          >
            {/* Deep shadow layer */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 12,
                fontFamily: 'Playfair',
                fontSize: 210,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 8,
                color: 'rgba(0,0,0,0.45)',
                textTransform: 'uppercase',
              }}
            >
              SLW
            </div>
            {/* Mid shadow layer */}
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 6,
                fontFamily: 'Playfair',
                fontSize: 210,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 8,
                color: 'rgba(0,0,0,0.28)',
                textTransform: 'uppercase',
              }}
            >
              SLW
            </div>
            {/* Main text */}
            <div
              style={{
                fontFamily: 'Playfair',
                fontSize: 210,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 8,
                color: 'white',
                textTransform: 'uppercase',
              }}
            >
              SLW
            </div>
            {/* Edge highlight */}
            <div
              style={{
                position: 'absolute',
                top: -2,
                left: -2,
                fontFamily: 'Playfair',
                fontSize: 210,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 8,
                color: 'rgba(255,255,255,0.18)',
                textTransform: 'uppercase',
              }}
            >
              SLW
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 42,
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: 2,
              fontFamily: 'Playfair',
            }}
          >
            Smarter Logic Web
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: 'rgba(255,255,255,0.72)',
              fontFamily: 'Playfair',
            }}
          >
            Sites vitrines statiques • Performance • Accessibilité • SEO
          </div>
        </div>

        {/* Corner accent */}
        <div
          style={{
            position: 'absolute',
            inset: 40,
            border: '2px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
          }}
        />
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