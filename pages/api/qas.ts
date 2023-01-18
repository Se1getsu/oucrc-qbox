import { getSessionData } from '../../lib/posts';
import { strftime, timestampTotime } from '../../lib/util';
import { sendToSlack } from '../../lib/slack';
import { NextApiRequest, NextApiResponse } from 'next';

import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccount = require('../../firebase'); //秘密鍵取得
import * as admin from 'firebase-admin';
import { QA } from '@/types/qa';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const COLLECTION_NAME = 'qas';
  //　初期化
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const db = getFirestore();

  if (req.method === 'POST') {
    const docRef = db.collection(COLLECTION_NAME).doc();
    const insertData = {
      date: new Date(),
      question: req.body.question,
      answer: req.body.answer,
    };
    docRef.set(insertData);

    const message =
      'https://oucrc-qbox.vercel.app に新しい質問が投稿されました。\n```' +
      req.body.question +
      '```';
    await sendToSlack(message);

    res.status(200).send('');
  } else if (req.method === 'GET') {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const qalist = snapshot.docs.map((value) => {
      return { id: value.id, ...value.data() };
    }) as QA[];
    qalist.sort((a, b) => b.date.getTime() - a.date.getTime());
    qalist.forEach((qadata) => {
      const date = timestampTotime(qadata.date.getTime());
      qadata.date = new Date(strftime(date, '%Y-%m-%d %H:%M:%S'));
    });
    res.status(200).json(qalist);
  } else if (req.method === 'PATCH') {
    const sdata = await getSessionData(req.body.sid);
    if (!sdata) {
      res.status(200).send('No permission.');
    } else {
      const docRef = db.collection(COLLECTION_NAME).doc(req.body.qid);
      const snapshot = await docRef.get();
      const data = snapshot.data() as QA;
      if (data) {
        data.answer = req.body.answer;
        docRef.set(data);
        res.status(200).send('');
      } else {
        res.status(404).send('Not found');
      }
    }
  } else {
    res.status(400).send('');
  }
}
