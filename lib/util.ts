import dayjs from 'dayjs';

/**
 * @returns フォーマットした文字列
 */
export function formatDate(date: Date) {
  return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
}

export function choice(arr: Array<any>) {
  const len = arr.length;
  const idx = Math.floor(Math.random() * len);
  return arr[idx];
}
