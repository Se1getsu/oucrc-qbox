import Head from 'next/head';
import { authProps, getSortedQAList } from '../lib/posts';
import QAList from '../components/QAList';
import Layout from '../components/Layout';

export async function getServerSideProps(ctx) {
  const qaList = await getSortedQAList();
  return await authProps(ctx, { qaList });
}

export default function Home({ sid, qaList }) {
  return (
    <Layout sid={sid}>
      <Head>
        <title>電算研質問箱 - 回答</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/oucrc.ico" />
      </Head>

      <h1>質問に回答</h1>

      <p>質問が届いてる場合は、下に質問の一覧が表示されます。</p>
      <QAList qaList={qaList} mode={'unanswered'} />
    </Layout>
  );
}
