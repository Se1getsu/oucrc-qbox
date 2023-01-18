import { sha512_256 } from 'js-sha512';
import { timestampTotime } from '../../lib/util';

const { cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../firebase'); //秘密鍵取得
const admin = require('firebase-admin');

export default async function handler(req, res) {
  const COLLECTION_NAME = 'session';
  //　初期化
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const db = getFirestore();

  if (req.method === 'GET') {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const slist = snapshot.docs.map((value, index, array) => {
      return { id: value.id, ...value.data() };
    });
    const nowd = new Date();

    //期限切れのセッションをデータベースから削除
    slist.forEach(async (sdata) => {
      sdata.expiration = timestampTotime(sdata.expiration);
      if (sdata.expiration < nowd) {
        await db.collection(COLLECTION_NAME).doc(sdata.id).delete();
      }
    });

    const cdata = slist.find((sdata) => sdata.id == req.query.id);
    if (cdata && cdata.expiration > nowd) {
      res.status(200).json(cdata);
    } else {
      res.status(200).send('');
    }
  } else if (req.method === 'DELETE') {
    const sidh = sha512_256(req.query.id);
    await db.collection(COLLECTION_NAME).doc(sidh).delete();
    res.status(200).send('');
  } else {
    res.status(400).send('');
  }
}
