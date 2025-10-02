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
        }}
      >
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