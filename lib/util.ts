import { NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import nookies from 'nookies';

export type NookieCtxRes =
  | Pick<NextPageContext, 'req'>
  | {
      req: NextApiRequest;
    }
  | null
  | undefined;

export type NookieCtxReq =
  | Pick<NextPageContext, 'res'>
  | {
      res: NextApiResponse;
    }
  | null
  | undefined;

export function gettCookie(ctx: NookieCtxRes) {
  return parseCookies(ctx, {
    path: '/',
  });
}
//gettCookie().Cookie名

export function settCookie(key: string, value: string) {
  setCookie(null, key, value, {
    maxAge: 3 * 60 * 60,
    path: '/',
  });
}
//settCookie(null, '任意のcookie値');

export function killCookie(key: string, ctx?: NookieCtxReq) {
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

export function timestampTotime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  date.setFullYear(date.getFullYear() - 1969);
  return date;
}

export function choice(arr: Array<any>) {
  const len = arr.length;
  const idx = Math.floor(Math.random() * len);
  return arr[idx];
}
