/**
 * @file session-actions.ts
 * @description Server-side session actions for Firebase Auth.
 * @module actions/session-actions
 */

"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase/server/config";
import { SESSION_COOKIE_NAME } from "@/constants";

/*
Get session user from session cookie.

@returns { User | null }
*/
export async function getSessionUser() {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  const decoded = await auth.verifySessionCookie(sessionCookie, true);
  const user = await auth.getUser(decoded.uid);
  return JSON.parse(JSON.stringify(user));
}
