import ReactDOM from "react-dom/server";
import * as playwright from "playwright-aws-lambda";

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

const Content = ({text}) => (
  <html>
    <head>
      <link rel="icon" href="/oucrc.ico" />
      <style>{styles}</style>
      <meta charSet='utf-8' />
    </head>
    <body>
      <p className="bg">
        {text.split('\n').map((textline) => (
            <>
                {textline}<br />
            </>
        ))}
      </p>
    </body>
  </html>
);

export default async (req, res) => {

  // ブラウザインスタンスの生成
  const browser = await playwright.launchChromium();
  const viewport = { width: 1200, height: 630 };
  const page = await browser.newPage({ viewport });

  // HTMLの生成
  const props = { text: req.query.text };
  const markup = ReactDOM.renderToStaticMarkup(<Content {...props} />);
  const html = `<!doctype html>${markup}`;
  if(0){
    res.setHeader("Content-Type", "text/html");
    res.end(html);
    return;
  }

  // HTMLをセットして、ページの読み込み完了を待つ
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  const image = await page.screenshot({ type: "png" });
  await browser.close();

  // Vercel Edge Networkのキャッシュを利用するための設定
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
  res.setHeader("Content-Type", "image/png");
  res.end(image);
};