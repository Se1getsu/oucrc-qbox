import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { getSessionData, getSid } from '../lib/posts';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert } from '@material-ui/lab';
import { choice, gettCookie, settCookie } from '../lib/util';
import Layout from '../components/Layout';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = gettCookie(ctx);
  const sid = cookie.sid;
  const sdata = sid ? await getSessionData(sid) : '';

  //既にログイン済みの場合は /answer にリダイレクト
  if (!sdata) {
    return { props: {} };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/answer',
      },
    };
  }
}

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const errorTexts = [
    'パスワードが全然違います。',
    'パスワードが極端に異なります。',
    'パスワードが引くほど違います。',
    'そんなパスワードではありません。',
    'パスワードが微塵もかすっていません。',
    'パスワードを知らないなら諦めましょう。',
    '有り得ないないほどパスワードが違います。',
    '知ったかぶりのパスワードを受け取りました。',
    'パスワードを適当に入力するのはよくありません。',
    '入力されたパスワードにログインの意思を感じられません。',
  ];

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    if (!password) {
      setError('パスワードを入力して下さい。');
      return;
    }
    const sid = await getSid(password);
    if (sid) {
      settCookie('sid', sid);
      router.push('/answer');
    } else {
      setError(choice(errorTexts));
    }
  };

  return (
    <Layout>
      <Head>
        <title>電算研質問箱 - 認証</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/oucrc.ico" />
      </Head>

      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
      <p>
        質問に回答するにはログインが必要です。
        <br />
      </p>
      <TextField
        id="standard-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit}>LOGIN</Button>
      <br />
    </Layout>
  );
}
