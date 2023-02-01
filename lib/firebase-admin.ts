import * as admin from 'firebase-admin';
import serviceAccount from './firebase-service-account';

export const firebaseAdmin =
  admin.apps[0] ??
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
