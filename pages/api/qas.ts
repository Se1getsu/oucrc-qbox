import { sendToSlack } from '../../lib/slack';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../../lib/firebase-service-account'; //秘密鍵取得
import * as admin from 'firebase-admin';
import { QA } from '@/types/qa';
import { qaConverter } from '@/lib/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const COLLECTION_NAME = 'qas';

  //　初期化
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = getFirestore();

  if (req.method === 'POST') {
    const docRef = db.collection(COLLECTION_NAME).doc();
    const insertData = {
      date: admin.firestore.FieldValue.serverTimestamp(),
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
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .withConverter(qaConverter)
      .get();
    const qalist = snapshot.docs.map((value) => {
      return value.data();
    }) as QA[];
    if (qalist.length > 0) {
      qalist.sort((a, b) => {
        if (a.date && b.date) {
          return b.date.getTime() - a.date.getTime();
        }
        return 0;
      });
    }
    res.status(200).json(qalist);
  } else if (req.method === 'PATCH') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
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
