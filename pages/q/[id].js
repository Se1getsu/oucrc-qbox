import Head from 'next/head';
import AnswerForm from '../../components/AnswerForm';
import Layout from '../../components/Layout';
import QSheet from '../../components/QSheet';
import { authProps, getQAData } from '../../lib/posts';
import styles from '../../styles/Home.module.css';

export async function getServerSideProps(ctx) {
  const qaData = await getQAData(ctx.query.id);
  //存在しないIDの場合
  if (!qaData) {
    return { props: {} };
    //回答済みの場合
  } else if (qaData.answer) {
    return { props: { qaData } };
    //未回答の場合
  } else {
    return authProps(ctx, { qaData });
  }
}

export default function Post({ sid, qaData }) {
  if (!qaData) {
    return (
      <Layout sid={sid}>
        <Head>
          <title>電算研質問箱 - エラー</title>
          <meta charSet="utf-8" />
          <link rel="icon" href="/oucrc.ico" />
        </Head>
        <h2>おや？</h2>
        存在しない質問IDにアクセスしました。
        <br />
        URLをもう一度ご確認ください。
      </Layout>
    );
  } else if (qaData.answer) {
    return (
      <Layout sid={sid}>
        <Head>
          <title>電算研質問箱 - 回答閲覧</title>
          <link rel="icon" href="/oucrc.ico" />
          <meta charSet="utf-8" />
          <meta
            name="description"
            content={'岡大電算研への質問：' + qaData.question}
          />
          <meta property="og:url" content={process.env.BASE_URL} />
          <meta property="og:title" content="岡大電算研質問箱" />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content="岡大電算研（OUCRC）が質問に回答しました。"
          />
          <meta
            property="og:image"
            content={'/api/ogp?text=' + encodeURI(qaData.question)}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="岡大電算研質問箱" />
          <meta
            name="twitter:description"
            content="岡大電算研（OUCRC）が質問に回答しました。"
          />
        </Head>
        <h2>質問</h2>
        <QSheet text={qaData.question} />（{qaData.date}）<h2>回答</h2>
        <p className={styles.qwidth}>
          {qaData.answer.split('\n').map((textline) => (
            <>
              {textline}
              <br />
            </>
          ))}
        </p>
      </Layout>
    );
  } else {
    return (
      <Layout sid={sid}>
        <Head>
          <title>電算研質問箱 - 回答入力</title>
          <meta charSet="utf-8" />
          <link rel="icon" href="/oucrc.ico" />
        </Head>
        <h2>質問</h2>
        <QSheet text={qaData.question} />（{qaData.date}）<h2>回答</h2>
        <AnswerForm sid={sid} qid={qaData.id} />
      </Layout>
    );
  }
}
