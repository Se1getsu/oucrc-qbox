import { TextField } from '@material-ui/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function QSheet({
  text,
  href,
  onChange,
}: {
  text: string;
  href?: string;
  onChange?: any;
}) {
  const router = useRouter();

  return (
    <div
      className={`${styles.qsheetbg}` + (href ? ` ${styles.hov}` : ``)}
      onClick={href ? () => router.push(href) : () => {}}
    >
      <TextField
        className={styles.qsheetTextfield}
        multiline
        value={text}
        onChange={onChange}
        placeholder={onChange ? 'ここに質問を入力' : ''}
        InputProps={{
          readOnly: !onChange,
          'aria-label': 'naked',
          disableUnderline: true,
          inputProps: {
            style: {
              textAlign: 'center',
            },
          },
        }}
      />
      <div className={styles.qsheetbottom}>
        <Image
          src="/images/oucrc-logo.webp"
          width={36}
          height={36}
          alt="OUCRC"
        />
        <Image
          src="/images/oucrc-label.webp"
          width={(24 * 1188) / 160}
          height={24}
          alt="OUCRC"
        />
      </div>
    </div>
  );
}
