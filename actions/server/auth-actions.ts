/**
 * @file auth-actions.ts
 * @description Server-side authentication actions for Firebase Auth.
 * @module actions/server/auth-actions
 */

"use server";

import { createUserProfile } from "@/lib/firebase/server/users";
import { getSessionUser } from "@/actions/server/session-actions";
import { auth } from "@/lib/firebase/server/config";

export const SESSION_COOKIE_LIFESPAN = 14 * 24 * 60 * 60 * 1000;

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
export async function signUpWithEmailActionServer(idToken: string) {
  if (!idToken) {
    console.error("ID token must be provided in signUpWithEmailActionServer.");
    return;
  }

  // check if user is already signed in
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in in signUpWithEmailActionServer.");
    return;
  }

  // verify idToken and return if email is not verified
  const decodedToken = await auth.verifyIdToken(idToken);
  const user = await auth.getUser(decodedToken.uid);
  if (!user.emailVerified) {
    console.error("Email is not verified in signUpWithEmailActionServer.");
    return;
  }

  // create session cookie and create user profile
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_LIFESPAN,
  });
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

  // create session cookie and create user profile
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_LIFESPAN,
  });
  await createUserProfile(user);
  return sessionCookie;
}
