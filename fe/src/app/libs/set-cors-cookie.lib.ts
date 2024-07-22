'use server';

import { cookies } from 'next/headers';

export const setCORSAuthCookie = (cookieName: string, cookieData: string) => {
  cookies().set(cookieName, cookieData);
};

export const getAuthCookie = async () => {
  const res = cookies().get('userId');
  return res;
};
