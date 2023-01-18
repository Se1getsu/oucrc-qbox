import { parseCookies, setCookie, destroyCookie } from 'nookies';
import nookies from 'nookies';

export function gettCookie(ctx) {
  return parseCookies(ctx, {
    path: '/',
  });
}
//gettCookie().Cookie名

export function settCookie(key, value) {
  setCookie(null, key, value, {
    maxAge: 3 * 60 * 60,
    path: '/',
  });
}
//settCookie(null, '任意のcookie値');

export function killCookie(key, ctx) {
  if (ctx) {
    nookies.destroy(ctx, key, {
      path: '/',
    });
  } else {
    destroyCookie(null, key, {
      path: '/',
    });
  }
}

export function strftime(date, format) {
  format = format.replace(/%Y/, date.getFullYear());
  format = format.replace(/%m/, date.getMonth() + 1);
  format = format.replace(/%d/, date.getDate());
  format = format.replace(/%a/, '日月火水木金土'.charAt(date.getDay()));
  format = format.replace(/%H/, date.getHours());
  format = format.replace(/%M/, date.getMinutes());
  format = format.replace(/%S/, date.getSeconds());
  return format;
}

export function timestampTotime(timestamp) {
  const date = new Date(timestamp * 1000);
  date.setFullYear(date.getFullYear() - 1969);
  return date;
}

export function choice(arr) {
  const len = arr.length;
  const idx = Math.floor(Math.random() * len);
  return arr[idx];
}
