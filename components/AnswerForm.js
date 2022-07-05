import { useState } from "react"
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import axios from "axios";
import { killCookie } from "../lib/util";
import { useRouter } from "next/router";
import SendIcon from '@material-ui/icons/Send';
import styles from "../styles/Home.module.css";

export default function AnswerForm({sid, qid}){
    const [comment, setComment] = useState('');
    const router = useRouter();
    const handleChange = (event) => {
        setComment(event.target.value);
    }

    const postComment = async () => {
        if(!comment) return;
        const resp = await axios.patch('/api/qas', {
            sid,
            qid,
            answer: comment
        });

        if(resp.data == 'No permission.'){
            killCookie('sid');
            router.replace('/login');
        }else{
            router.reload();
        }
    }

    return (
        <div style={{width: '100%', textAlign: 'center'}}>
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
                    style={{width: '100%'}}
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
    )
}