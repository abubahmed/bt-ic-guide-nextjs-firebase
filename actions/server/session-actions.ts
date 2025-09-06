"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/constants";

export async function getSessionFromCookies(): Promise<string | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return cookie || null;
}

export async function verifySessionCookie(cookie: string): Promise<any> {
  return adminAuth.verifySessionCookie(cookie, true);
}

export async function getSessionUser(): Promise<any | null> {
  const cookie = await getSessionFromCookies();
  if (!cookie) return null;
  try {
    const decoded = await verifySessionCookie(cookie);
    if (!decoded || !decoded.uid) return null;
    const user = await adminAuth.getUser(decoded.uid);
    return user;
  } catch (error) {
    console.error("Error verifying session cookie or fetching user:", error);
    return null;
  }
}
