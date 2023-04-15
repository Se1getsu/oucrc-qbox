import { ImageResponse } from '@vercel/og';
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

/**
 * OG画像生成
 *
 * @see https://www.newt.so/docs/tutorials/vercel-og-image-generation
 */
export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const hasText = searchParams.has('text');
    const text = hasText ? searchParams.get('text') : null;

    if (typeof text === 'string') {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              backgroundImage: `url(${process.env.NEXTAUTH_URL}/images/ogpsheet.png)`,
            }}
          >
            <div
              style={{
                padding: '0 18px 0',
                position: 'absolute',
                top: '32px',
                left: '32px',
                width: '1135px',
                height: '496px',
                borderRadius: '56px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '48px',
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              {
                text.length > 128
                ? text.slice(0, 128) + '…'
                : text
              }
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } else {
      return new Response(`text should be one string`, {
        status: 400,
      });
    }
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
