import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import SendIcon from '@material-ui/icons/Send';
import styles from '../styles/Home.module.css';

export default function AnswerForm({ qid }: { qid: string }) {
  const [comment, setComment] = useState('');
  const router = useRouter();
  const handleChange = (event: any) => {
    setComment(event.target.value);
  };

  const postComment = async () => {
    if (!comment) return;
    const resp = await fetch(process.env.NEXTAUTH_URL + '/api/qas', {
      method: 'PATCH',
      body: JSON.stringify({
        qid,
        answer: comment,
      }),
    });
    const data = await resp.json();

    if (data == 'No permission.') {
      router.replace('/login');
    } else {
      router.reload();
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <TextField
        className={styles.qwidth}
        id="outlined-multiline-static"
        label="本文"
        multiline
        minRows={7}
        variant="outlined"
        value={comment}
        onChange={handleChange}
      />

      <div className={styles.sendButton}>
        <Button
          style={{ width: '100%' }}
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          disabled={!comment}
          onClick={postComment}
        >
          回答
        </Button>
      </div>
    </div>
  );
}
