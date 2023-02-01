import axios from 'axios';
import { QA } from '@/types/qa';

export async function getSortedQAList() {
  const resp = await axios.get<QA[]>(process.env.BASE_URL + '/api/qas');
  return resp.data ?? null;
}

export async function getAllQAIds() {
  const qaList = await getSortedQAList();
  const idList = qaList.map((value) => {
    return { params: { id: value.id } };
  });
  return idList ?? null;
}

export async function getQAData(id: QA['id']) {
  const qaList = await getSortedQAList();
  return qaList.find((qaData) => qaData.id == id) ?? null;
}
