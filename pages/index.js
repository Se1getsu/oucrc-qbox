import Head from 'next/head'
import styles from '../styles/Home.module.css'
import InputForm from '../components/InputForm.js'
import { getSortedQAList } from '../lib/posts'
import QAList from '../components/QAList'
import Layout from '../components/Layout'

/*
styles.card は質問の一覧表示の所で使えそう。
*/

export async function getServerSideProps(){
  const qaList = await getSortedQAList();
  return {props: {qaList}};
}

export default function Home({qaList}) {
  return (
    <Layout>
      <Head>
        <title>電算研質問箱</title>
        <link rel="icon" href="/oucrc.ico" />
        <meta charSet='utf-8' />
        <meta
          name="description"
          content={
            "岡山大学のコンピュータ系部活である「岡山大学電子計算機研究会（OUCRC）」のオリジナル質問箱です。"+
            "疑問に思うことや相談などがあれば、この質問箱を使えば匿名で質問を送れます。"+
            "トップページでは既に回答がついた質問の一覧を見ることもできます。"
          }
        />
        <meta property='og:url' content={process.env.BASE_URL} />
        <meta property='og:title' content='岡大電算研質問箱' />
        <meta property='og:type' content='website' />
        <meta property='og:description' content='岡山大学のコンピュータ系部活である「岡山大学電子計算機研究会（OUCRC）」のオリジナル質問箱です。' />
        <meta property='og:image' content={process.env.BASE_URL + '/images/ogptop.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name='twitter:title' content='岡大電算研質問箱' />
        <meta name='twitter:description' content='岡山大学のコンピュータ系部活である「岡山大学電子計算機研究会（OUCRC）」のオリジナル質問箱です。' />
      </Head>

      <h1>
        岡大電算研質問箱
      </h1>

      <p className={styles.qwidth} style={{margin: '0 1.5rem'}}>
        岡山大学のコンピュータ系部活である「岡山大学電子計算機研究会（OUCRC）」について気になることを書いてみよう！例えば...
      </p>
      
      <ol style={{margin: '0 1rem'}}>
        <li>どのような活動をしているのですか？</li>
        <li>〇〇やっている人っていますか？</li>
        <li>見学をしたいのですがどうすればいいですか？</li>
      </ol>

      <h2>質問フォーム</h2>
      <InputForm />
      
      <h2>回答された質問</h2>
      <QAList qaList={qaList} mode={'answered'} />
    </Layout>
  )
}
