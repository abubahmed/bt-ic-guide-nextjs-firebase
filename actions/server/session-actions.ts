"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase/server/config";
import { SESSION_COOKIE_NAME } from "@/constants";

export async function getSessionFromCookies(): Promise<string | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return cookie || null;
}

export async function verifySessionCookie(cookie: string): Promise<any> {
  return auth.verifySessionCookie(cookie, true);
}

export async function getSessionUser(): Promise<any | null> {
  const cookie = await getSessionFromCookies();
  if (!cookie) return null;
  const decoded = await verifySessionCookie(cookie);
  const user = await auth.getUser(decoded.uid);
  return JSON.parse(JSON.stringify(user));
}
