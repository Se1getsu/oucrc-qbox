import Head from 'next/head';
import Layout from '../components/Layout';
import { Button, TextField } from '@material-ui/core';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Test() {
  const text = 'こんなページは存在しない。\n分かった？';

  const handleSubmit = async (event: any) => {
    console.log('TEST処理開始');

    // const comment = "Hello, second world!";
    // fetch('/api/comments', {
    //     method: 'POST',
    //     mode: 'same-origin',
    //     credentials: 'same-origin',
    //     headers: { 'Content-Type': 'application/json; charset=utf-8' },
    //     body : JSON.stringify({message: comment}),
    // });

    console.log('TEST処理終了');
  };

  return (
    <Layout>
      <Head>
        <title>てすと</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/oucrc.ico" />
      </Head>

      <div className={styles.ogpqsheetbg}>
        <TextField
          className={styles.ogpqsheetTextfield}
          multiline
          value={text}
          InputProps={{
            readOnly: true,
            'aria-label': 'naked',
            disableUnderline: true,
            inputProps: {
              style: {
                fontSize: (16 * 1200) / 528,
                lineHeight: 1.2,
                textAlign: 'center',
              },
            },
          }}
        />

        <div className={styles.ogpqsheetbottom}>
          <Image
            src="/images/oucrc-logo.webp"
            width={(36 * 1200) / 528}
            height={(36 * 1200) / 528}
            alt="OUCRC"
          />
          <Image
            src="/images/oucrc-label.webp"
            width={(((24 * 1188) / 160) * 1200) / 528}
            height={(24 * 1200) / 528}
            alt="OUCRC"
          />
        </div>
      </div>

      <Button onClick={handleSubmit}>TEST</Button>
    </Layout>
  );
}
