import { QA, QAOnFirestore } from '@/types/qa';
import { firestore } from 'firebase-admin';

/**
 * dateをJSのDateに変換する
 */
export const qaConverter = {
  fromFirestore: function (
    snapshot: firestore.QueryDocumentSnapshot<QAOnFirestore>
  ): QA {
    const { date: dateTimestamp, ...data } = snapshot.data();
    const date = dateTimestamp.toDate();
    return {
      ...data,
      // IDはここで付ける
      id: snapshot.id,
      date,
    };
  },
  toFirestore: function (data: QA): firestore.DocumentData {
    return data;
  },
};

export async function getSortedQAList() {
  try {
    const resp = await fetch(process.env.NEXTAUTH_URL + '/api/qas');
    return (await resp.json()) as QA[];
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllQAIds() {
  const qaList = await getSortedQAList();
  const idList = qaList?.map((value) => {
    return { params: { id: value.id } };
  });
  return idList ?? null;
}

export async function getQAData(id: QA['id']) {
  const qaList = await getSortedQAList();
  return qaList?.find((qaData) => qaData.id == id) ?? null;
}
