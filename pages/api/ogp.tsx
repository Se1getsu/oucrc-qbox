import { NextApiRequest, NextApiResponse } from 'next';
import ReactDOM from 'react-dom/server';
const nodeHtmlToImage = require('node-html-to-image');
const Jimp = require('jimp');

const styles = `
  html, body {
    width: 100%;
    height: 100%;
    display: grid;
    background-image: url(${process.env.BASE_URL}/images/ogpsheet.png);
    transform: translateX(-4px) translateY(-4px);
  }

  .bg{
    margin: 32px 31px 0;
    padding: 46px 46px 37px;
    border-radius: 55px;
    width: 1045px;
    height: 413px;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    font-size: calc(16px *1200/528);
    line-height: 1.2;
    text-align: center;
    word-wrap: break-word;
    overflow: hidden;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  h1 { margin: auto }
`;

const Content = ({ text }: { text: string }) => (
  <html>
    <head>
      <link rel="icon" href="/oucrc.ico" />
      <style>{styles}</style>
      <meta charSet="utf-8" />
    </head>
    <body>
      <p className="bg">
        {text.split('\n').map((textline, index) => (
          <span key={index}>
            {textline}
            <br />
          </span>
        ))}
      </p>
    </body>
  </html>
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text = req.query.text ? req.query.text : '';
  if (typeof text === 'string') {
    const props = { text };
    const markup = ReactDOM.renderToStaticMarkup(<Content {...props} />);
    const html = `<!doctype html>${markup}`;

    // ????
    if (process.env.OGP_DEBUG === 'true') {
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      return;
    }

    const buffer = await nodeHtmlToImage({
      html: html,
      puppeteerArgs: {
        defaultViewport: { width: 1200, height: 630 },
      },
    });

    // なぜかbufferの縦横比が1200x630をオーバーしてしまうので、Jimpを使ってトリミング
    const image = await Jimp.read(buffer);
    const trimed = await image
      .crop(0, 0, 1200, 630)
      .getBufferAsync(Jimp.MIME_PNG);

    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    res.setHeader('Content-Type', 'image/png');
    res.end(trimed);
  } else {
    res.status(400).send('text should be one string');
  }
}
