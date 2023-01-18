import axios from 'axios';
import { sha512_256 } from 'js-sha512';
import { NookieCtxReq, NookieCtxRes, gettCookie, killCookie } from './util';
import { QA } from '@/types/qa';

export async function getSortedQAList() {
  const resp = await axios.get<QA[]>(process.env.BASE_URL + '/api/qas');
  return resp.data;
}

export async function getAllQAIds() {
  const qaList = await getSortedQAList();
  const idList = qaList.map((value) => {
    return { params: { id: value.id } };
  });
  return idList;
}

export async function getQAData(id: QA['id']) {
  const qaList = await getSortedQAList();
  return qaList.find((qaData) => qaData.id == id);
}

export async function getSid(pass: string) {
  const resp = await axios.get('/api/login', { params: { pass } });
  return resp.data;
}

export async function getSessionData(id: string) {
  const idh = sha512_256(id);
  const resp = await axios.get(process.env.BASE_URL + '/api/session', {
    params: { id: idh },
  });
  return resp.data;
}

export async function deleteSession(id: string) {
  await axios.delete(process.env.BASE_URL + '/api/session', {
    params: { id },
  });
}

//ログイン状態を必要とするページのgetServerSidePropsを代行
export async function authProps(ctx: NookieCtxRes, props: Record<string, any>) {
  const cookie = gettCookie(ctx);
  const sid = cookie.sid;
  const sdata = sid ? await getSessionData(sid) : '';

  if (sdata) {
    return { props: { sid, sdata, ...props } };
  } else {
    // TODO: reqとresの型が矛盾している状態を解決
    killCookie('sid', ctx as NookieCtxReq);
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
}
