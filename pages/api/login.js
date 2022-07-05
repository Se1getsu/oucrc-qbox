import sha512, { sha512_256 } from 'js-sha512';

const { cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../firebase'); //秘密鍵取得
const admin = require('firebase-admin');

export default async function handler(req, res) {
  const SYS_COLLECTION_NAME = 'system';
  const SESSION_COLLECTION_NAME = 'session';
  //　初期化
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const db = getFirestore();

  if (req.method === 'GET') {

    //パスハッシュ取得
    const snapshot = await db.collection(SYS_COLLECTION_NAME).doc("login").get();
    const passhash = snapshot.data().passhash;

    if(req.query.pass && sha512(req.query.pass) == passhash){

      //セッションID生成
      const lets="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./"
      const len=20;
      const randomLet = () => lets[Math.floor(Math.random()*lets.length)];
      const sid = Array.from(Array(len)).map(randomLet).join('');
      const sidh = sha512_256(sid);

      //データベースに保存
      const docRef = db.collection(SESSION_COLLECTION_NAME).doc(sidh);
      const expiration = new Date();
      expiration.setHours(expiration.getHours()+3);
      docRef.set({
        expiration: expiration
      });

      //セッションIDを提供
      res.status(200).send(sid);

    }else{
      res.status(200).send('');
    }

  } else {
    res.status(400).send('');
  }

  
}