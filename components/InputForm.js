import { useState } from "react"
import { Button } from "@material-ui/core";
import axios from "axios";
import QSheet from "./QSheet";
import SendIcon from '@material-ui/icons/Send';
import { useSpring, animated, easings } from "@react-spring/web";
import styles from "../styles/Home.module.css";

export default function inputForm(){
    const [comment, setComment] = useState('');
    
    // 送信アニメーション
    // 0 => 1: 倒れる　　　　　　　　　　（入力不可）
    // 1 => 2: 飛んで行く　　　　　　　　（入力不可）
    // 2 => 3: 透明な状態で元の位置に戻る（瞬時）
    // 3 => 0: フェードインで現れる　　　（入力可）
    const [prog, setProg] = useState(0);
    const sptyles = useSpring({
        transform:
            `perspective(${['600','600','10','600'][prog]}px) `+
            `rotateX(${['0','75','90','0'][prog]}deg) `+
            `scale(${['1','1','0','1'][prog]})`,
        transformOrigin:
            `50% ${['120','90','90','120'][prog]}%`,
        y: prog==2 ? -130 : 0,
        opacity: prog==3 ? 0 : 1,
        config: {
            duration: [800,400,800,0][prog],
            easing: [easings.linear, easings.easeOutCirc, easings.easeOutCirc, easings.linear][prog]
        },
        onRest: () => {
            if(prog == 2) setComment('');
            if(0 < prog && prog < 3){
                setProg(prog+1);
            }else{
                setProg(0);
            }
        }
    })

    const handleChange = (event) => {
        setComment(event.target.value);
    }

    const postComment = async () => {
        if(!comment) return;
        await axios.post('/api/qas', {
            question: comment,
            answer: ''
        });
        setProg(1);
    }

    return (
        <div style={{width: '100%', textAlign: 'center'}}>
            <animated.div style={sptyles}>
                <QSheet text={comment} onChange={prog ? undefined : handleChange} />
            </animated.div>

            <div className={styles.sendButton}>
                <Button
                    style={{width: '100%'}}
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    disabled={!!prog || !comment}
                    onClick={postComment}
                >
                    送信
                </Button>
            </div>
        </div>
    )
}