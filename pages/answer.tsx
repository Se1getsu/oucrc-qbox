import Head from 'next/head';
import { getSortedQAList } from '../lib/posts';
import QAList from '../components/QAList';
import Layout from '../components/Layout';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const qaList = await getSortedQAList();
  return { props: { qaList } };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Answer: NextPage<Props> = ({ qaList }) => {
  return (
    <Layout>
      <Head>
        <title>電算研質問箱 - 回答</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/oucrc.ico" />
      </Head>

      <h1>質問に回答</h1>

      <p>質問が届いてる場合は、下に質問の一覧が表示されます。</p>
      {qaList && <QAList qaList={qaList} mode={'unanswered'} />}
    </Layout>
  );
};

export default Answer;
