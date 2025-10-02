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
          background:
            'linear-gradient(135deg, #0b0b0b 0%, #1a0e14 35%, #3b0e24 75%, #C73863 100%)',
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