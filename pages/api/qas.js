import { getSessionData } from '../../lib/posts';
import { strftime, timestampTotime } from '../../lib/util';

const { cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../firebase'); //秘密鍵取得
const admin = require('firebase-admin');

export default async function handler(req, res) {
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
    res.status(200).send('');

  } else if (req.method === 'GET') {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const qalist = snapshot.docs.map((value, index, array) => {
      return {id: value.id, ...value.data()};
    })
    qalist.sort((a,b) => b.date-a.date);
    qalist.forEach(qadata => {
      const date = timestampTotime(qadata.date);
      qadata.date = strftime(date, "%Y-%m-%d %H:%M:%S");
    })
    res.status(200).json(qalist);

  } else if (req.method === 'PATCH') {
    const sdata = await getSessionData(req.body.sid);
    if(!sdata){
      res.status(200).send('No permission.')
    }else{
      const docRef = db.collection(COLLECTION_NAME).doc(req.body.qid);
      const snapshot = await docRef.get();
      const data = snapshot.data();
      data.answer = req.body.answer;
      docRef.set(data);
      res.status(200).send('');
    }

  } else {
    res.status(400).send('');
  }

  
}