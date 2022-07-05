import { Pagination } from "@material-ui/lab";
import { useState } from "react";
import QSheet from "./QSheet";

export default function QAList({qaList, mode}){
    var exqaList;
    if(mode == 'answered'){
        exqaList = qaList.filter(qaData => qaData.answer);
    }else if(mode == 'unanswered'){
        exqaList = qaList.filter(qaData => !qaData.answer);
    }else{
        return ( <p>- QAListUndefinedModeError -</p> )
    }

    const [page, setPage] = useState(1);
    const numofDisp = 20;
    
    return (
        <div style={{
            width: '100%',
            textAlign: 'center'
        }}>
            <Pagination
                style={{
                    display: 'inline-block',
                    margin: '1rem auto 0'
                }}
                variant="outlined"
                shape="rounded"
                page={page}
                count={1 + Math.floor((exqaList.length-1)/numofDisp)}
                onChange={(e,p) => setPage(p)}
            />

            {exqaList
                .slice((page-1)*numofDisp, Math.min(page*numofDisp, exqaList.length))
                .map(({id, date, question, qnswer}) => (
                    <QSheet key={id} text={question} href={"/q/"+id} />
                ))
            }

            <Pagination
                style={{
                    display: 'inline-block',
                    margin: '1rem auto 0'
                }}
                variant="outlined"
                shape="rounded"
                page={page}
                count={1 + Math.floor((exqaList.length-1)/numofDisp)}
                onChange={(e,p) => setPage(p)}
            />
        </div>
    )
}