export function strftime(date: Date, format: string) {
  format = format.replace(/%Y/, date.getFullYear().toString());
  format = format.replace(/%m/, (date.getMonth() + 1).toString());
  format = format.replace(/%d/, date.getDate().toString());
  format = format.replace(/%a/, '日月火水木金土'.charAt(date.getDay()));
  format = format.replace(/%H/, date.getHours().toString());
  format = format.replace(/%M/, date.getMinutes().toString());
  format = format.replace(/%S/, date.getSeconds().toString());
  return format;
}

export function timestampTotime(timestamp?: Date | number) {
  const date = new Date(timestamp ?? 0 * 1000);
  date.setFullYear(date.getFullYear() - 1969);
  return date;
}

export function choice(arr: Array<any>) {
  const len = arr.length;
  const idx = Math.floor(Math.random() * len);
  return arr[idx];
}
