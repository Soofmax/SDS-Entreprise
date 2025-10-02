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
        }}
      >
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
          }}
        >
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