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
    const text = hasText ? searchParams.get('text')?.slice(0, 100) : null;

    if (typeof text === 'string') {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              backgroundImage: `url(${process.env.BASE_URL}/images/ogpsheet.png)`,
            }}
          >
            <div
              style={{
                margin: '32px 31px 32px 64px',
                padding: '47px 46px 0',
                borderRadius: '55px',
                width: '1045px',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '60px',
                justifyContent: 'center',
                fontSize: '48px',
                lineHeight: '1.2',
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              {/* うまいこと折り返してから、改行を考慮する */}
              {(text.match(new RegExp(`.{1,21}`, 'g')) ?? [])
                .map((t) => t ?? '')
                .join('\n')
                .split('\n')
                .map((textline) => (
                  <>
                    {textline}
                    <br />
                  </>
                ))}
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
