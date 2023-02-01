import { useSession, signIn, signOut } from 'next-auth/react';

const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Email: {session.user?.email} <br />
        <button onClick={() => signOut()}>サインアウト</button>
      </>
    );
  }
  return (
    <>
      サインインしていません。
      <br />
      <button onClick={() => signIn()}>サインイン</button>
    </>
  );
};

export default LoginButton;
