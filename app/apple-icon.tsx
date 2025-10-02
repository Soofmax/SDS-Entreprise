import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default async function AppleIcon() {
  const playfairBold = await fetch(
    'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXDTz-8a_hzA.woff2'
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0b0b0b 0%, #3b0e24 65%, #C73863 100%)',
          borderRadius: 36,
          position: 'relative',
        }}
      >
        {/* Gloss highlight */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            height: 42,
            borderRadius: 28,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.06), rgba(255,255,255,0))',
          }}
        />
        {/* 3D layered text */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: 6,
              color: 'rgba(0,0,0,0.4)',
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
              top: -2,
              left: -2,
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
      ...size,
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