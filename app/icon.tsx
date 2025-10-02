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
          background:
            'radial-gradient(circle at 30% 30%, #C73863 22%, #1a0e14 95%)',
        }}
      >
        <div
          style={{
            fontFamily: 'Playfair',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 1,
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          S
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