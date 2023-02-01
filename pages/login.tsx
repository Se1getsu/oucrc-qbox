import Head from 'next/head';
import Layout from '../components/Layout';
import LoginButton from '@/components/LoginButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const { data: session } = useSession();
  return (
    <Layout>
      <Head>
        <title>電算研質問箱 - 認証</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/oucrc.ico" />
      </Head>
      <p>質問に回答するにはログインが必要です。</p>
      <LoginButton />
      {session && (
        <Link href="/answer">
          <a>回答する</a>
        </Link>
      )}
    </Layout>
  );
}
