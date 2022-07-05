import Head from "next/head";
import Layout from "../components/Layout";
import { TextField } from "@material-ui/core";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Test(){
    const text = 'こんなページは存在しない。\n分かった？';
    return (
        <Layout>
            <Head>
                <title>てすと</title>
                <meta charSet='utf-8' />
                <link rel="icon" href="/oucrc.ico" />
            </Head>
            
            <div className={styles.ogpqsheetbg}>
                <TextField
                    className={styles.ogpqsheetTextfield}
                    multiline
                    value={text}
                    InputProps={{
                        'readOnly': true,
                        'aria-label': 'naked',
                        'disableUnderline': true,
                        'inputProps': {
                            'style': {
                                'fontSize': 16 *1200/528,
                                'lineHeight': 1.2,
                                'textAlign': 'center'
                            }
                        }
                    }}
                />
                <div className={styles.ogpqsheetbottom}>
                    <Image
                        src='/images/oucrc-logo.webp'
                        width={36 *1200/528}
                        height={36 *1200/528}
                    />
                    <Image
                        src='/images/oucrc-label.webp'
                        width={24*1188/160 *1200/528}
                        height={24 *1200/528}
                    />
                </div>
            </div>

        </Layout>
    )
}