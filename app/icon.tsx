import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
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
          position: 'relative',
          background:
            'radial-gradient(circle at 30% 30%, #C73863 25%, #130a0e 95%)',
          borderRadius: 6,
        }}
      >
        {/* Gloss highlight */}
        <div
          style={{
            position: 'absolute',
            top: 1,
            left: 1,
            right: 1,
            height: 8,
            borderRadius: 5,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.06), rgba(255,255,255,0))',
          }}
        />
        {/* 3D layered letter */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 1,
              left: 1,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 0.5,
              color: 'rgba(0,0,0,0.5)',
              lineHeight: 1,
            }}
          >
            S
          </div>
          <div
            style={{
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 0.5,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            S
          </div>
          <div
            style={{
              position: 'absolute',
              top: -0.5,
              left: -0.5,
              fontFamily: 'Playfair',
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 0.5,
              color: 'rgba(255,255,255,0.18)',
              lineHeight: 1,
            }}
          >
            S
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