import { sha512_256 } from 'js-sha512';
import { timestampTotime } from '../../lib/util';
import { NextApiRequest, NextApiResponse } from 'next';

import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccount = require('../../firebase'); //秘密鍵取得
import * as admin from 'firebase-admin';
import { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const slist = snapshot.docs.map((value) => {
      return { id: value.id, ...value.data() };
    }) as Session[];
    const nowd = new Date();

    //期限切れのセッションをデータベースから削除
    slist.forEach(async (sdata) => {
      sdata.expiration = timestampTotime(sdata.expiration);
      if (sdata.expiration < nowd) {
        await db.collection(COLLECTION_NAME).doc(sdata.id).delete();
      }
    });

    const cdata = slist.find((sdata) => sdata.id == req.query.id);
    if (cdata && cdata.expiration && cdata.expiration > nowd) {
      res.status(200).json(cdata);
    } else {
      res.status(200).send('');
    }
  } else if (req.method === 'DELETE' && typeof req.query.id === 'string') {
    const sidh = sha512_256(req.query.id);
    await db.collection(COLLECTION_NAME).doc(sidh).delete();
    res.status(200).send('');
  } else {
    res.status(400).send('');
  }
}
