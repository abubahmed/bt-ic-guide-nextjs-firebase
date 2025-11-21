/**
 * @file auth-actions.ts
 * @description Server-side authentication actions for Firebase Auth.
 * @module actions/server/auth-actions
 */

"use server";

import { createUserProfile } from "@/lib/firebase/server/users";
import { getSessionUser } from "@/actions/server/session-actions";
import { auth } from "@/lib/firebase/server/config";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_LIFESPAN } from "@/constants";

/*
Complete Google OAuth sign in flow on server side. Checks if user is already signed in, creates session cookie and user profile.

@param idToken: string
@returns { sessionCookie: string }
*/
export async function signInWithGoogleActionServer(idToken: string) {
  if (!idToken) {
    console.error("ID token must be provided in signInWithGoogleActionServer.");
    return;
  }

  // check if user is already signed in
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in in signInWithGoogleActionServer.");
    return;
  }

  // verify idToken and create session cookie
  const decodedToken = await auth.verifyIdToken(idToken);
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_LIFESPAN,
  });
  (await cookies()).set({
    name: SESSION_COOKIE_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_COOKIE_LIFESPAN / 1000,
    path: "/",
  });

  // create user profile
  const user = await auth.getUser(decodedToken.uid);
  await createUserProfile(user);
  return sessionCookie;
}

/*
Complete email sign in flow on server side. Checks if user is already signed in, verifies idToken and returns if email is not verified. Otherwise, creates session cookie and user profile.

@param idToken: string
@returns { sessionCookie: string }
*/
export async function signInWithEmailActionServer(idToken: string) {
  if (!idToken) {
    console.error("ID token must be provided in signInWithEmailActionServer.");
    return;
  }

  // check if user is already signed in
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in in signInWithEmailActionServer.");
    return;
  }

  // verify idToken and create session cookie
  const decodedToken = await auth.verifyIdToken(idToken);
  const user = await auth.getUser(decodedToken.uid);
  if (!user.emailVerified) {
    console.error("Email is not verified in signInWithEmailActionServer.");
    return;
  }

  // create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_LIFESPAN,
  });
  (await cookies()).set({
    name: SESSION_COOKIE_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_COOKIE_LIFESPAN / 1000,
    path: "/",
  });

  // create user profile
  await createUserProfile(user);
  return sessionCookie;
}
