"use server";

import { createUserProfile, getUserProfile } from "@/lib/firebase/server/users";
import { getSessionUser } from "@/actions/server/session-actions";
import { auth } from "@/lib/firebase/server/config";

export const SESSION_COOKIE_LIFESPAN = 14 * 24 * 60 * 60 * 1000;

export async function signInWithGoogleActionServer(idToken: string) {
  if (!idToken) {
    console.error("ID token must be provided in signInWithGoogle.");
    return;
  }
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }
  const decodedToken = await auth.verifyIdToken(idToken);
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_LIFESPAN,
  });
  const user = await auth.getUser(decodedToken.uid);
  await createUserProfile(user);
  return { sessionCookie };
}

export async function signUpWithEmailActionServer(idToken: string) {
  if (!idToken) {
    console.error("ID token must be provided in signInWithEmailAction.");
    return;
  }
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }
  const decodedToken = await auth.verifyIdToken(idToken);
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_LIFESPAN,
  });
  const user = await auth.getUser(decodedToken.uid);
  await createUserProfile(user);
  return { sessionCookie };
}

