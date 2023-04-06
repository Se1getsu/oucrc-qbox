import { sendToSlack } from '../../lib/slack';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../../lib/firebase-service-account'; //秘密鍵取得
import * as admin from 'firebase-admin';
import { QA } from '@/types/qa';
import { qaConverter } from '@/lib/posts';
import { constants } from 'http2';

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
    // 新規作成
    const docRef = db.collection(COLLECTION_NAME).doc();
    // TODO: bodyのバリデーション
    const parsedBody = JSON.parse(req.body);
    const { question, answer } = parsedBody;
    const insertData = {
      date: admin.firestore.FieldValue.serverTimestamp(),
      question,
      answer,
    };
    docRef.set(insertData);

    const message =
      process.env.NEXTAUTH_URL +
      ' に新しい質問が投稿されました。\n```' +
      parsedBody.question +
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
    // 更新
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(200).send('No permission.');
    } else {
      // TODO: bodyのバリデーション
      const parsedBody = JSON.parse(req.body);
      const { qid, answer } = parsedBody;
      const docRef = db.collection(COLLECTION_NAME).doc(qid);
      const snapshot = await docRef.get();
      const data = snapshot.data() as QA;

      if (data) {
        docRef.set(
          {
            answer,
          },
          { merge: true } // answerだけを更新する
        );
        res.status(200).send('');
      } else {
        res.status(404).send('Not found');
      }
    }
  } else {
    res.status(constants.HTTP_STATUS_METHOD_NOT_ALLOWED).send('Invalid method');
  }
}
