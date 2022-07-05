import axios from "axios";
import { sha512_256 } from "js-sha512";
import { gettCookie, killCookie } from "./util";

export async function getSortedQAList(){
    const resp = await axios.get(process.env.BASE_URL + '/api/qas');
    return resp.data;
}

export async function getAllQAIds(){
    const qaList = await getSortedQAList();
    const idList = qaList.map((value, index, array) => {
        return { params: {id: value.id} }
    })
    return idList;
}

export async function getQAData(id){
    const qaList = await getSortedQAList();
    return qaList.find(qaData => qaData.id == id);
}

export async function getSid(pass){
    const resp = await axios.get('/api/login', {params: {pass: pass}});
    return resp.data;
}

export async function getSessionData(id){
    const idh = sha512_256(id);
    const resp = await axios.get(process.env.BASE_URL + '/api/session', {params: {id: idh}});
    return resp.data;
}

export async function deleteSession(id){
    await axios.delete(process.env.BASE_URL + '/api/session', {params: {id: id}});
}

//ログイン状態を必要とするページのgetServerSidePropsを代行
export async function authProps(ctx, props){
    const cookie = gettCookie(ctx);
    const sid = cookie.sid;
    const sdata = sid ? await getSessionData(sid) : '';

    if(sdata){
        return { props: {sid, sdata, ...props} }
    }else{
        killCookie('sid', ctx);
        return {
            redirect: {
                permanent: false,
                destination: '/login'
            }
        }
    }
}