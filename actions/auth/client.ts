/**
 * @file auth-actions.ts
 * @description Client-side authentication actions for Firebase Auth.
 * @module actions/auth/client
 */

"use client";

import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentUser,
  sendEmailVerification,
} from "@/lib/firebase/client/auth";
import { STAFF_HOME_ROUTE, ATTENDEE_HOME_ROUTE, ATTENDEE_LOGIN_ROUTE } from "@/route-config";
import { getSessionUser } from "@/actions/session-actions";
import { signInWithGoogleActionServer, signInWithEmailActionServer } from "@/actions/auth/server";

/*
Perform Google OAuth sign in flow on client side. Checks if user is already signed in, signs in with Google OAuth and requests backend to complete Google OAuth sign in flow.

@param router: any
@returns { void }
*/
export const signInWithGoogleActionClient = async (router: any) => {
  try {
    // check if user is already signed in
    if (await getCurrentUser() || await getSessionUser()) {
      console.error("User is already signed in in signInWithGoogleActionClient.");
      return;
    }

    // sign in with Google OAuth and get idToken
    const user = await signInWithGoogle();
    const idToken = await user.getIdToken(true);

    // complete sign in on server side
    const result = await signInWithGoogleActionServer(idToken);
    if (!result) {
      console.error("Failed to complete sign in with Google in signInWithGoogleActionClient.");
      await signOut();
      return;
    }

    // redirect to home page
    router.push(STAFF_HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with Google in signInWithGoogleActionClient:", error);
    await signOut();
    return;
  }
};

/*
Perform email sign up flow on client side. Checks if user is already signed in, signs up with email and password and sends email verification email.

@param { email: string; password: string; passwordConfirm: string }
@param router: any
@returns { void }
*/
export const signUpWithEmailActionClient = async (
  { email, password, passwordConfirm }: { email: string; password: string; passwordConfirm: string },
  router: any
) => {
  if (!email || !password || !passwordConfirm) {
    console.error("Email and password must be provided in signUpWithEmailActionClient.");
    return;
  }
  if (password !== passwordConfirm) {
    console.error("Passwords do not match in signUpWithEmailActionClient.");
    return;
  }

  try {
    // check if user is already signed in
    if (await getCurrentUser() || await getSessionUser()) {
      console.error("User is already signed in in signUpWithEmailActionClient.");
      return;
    }

    // sign up with email and password, send email verification if not verified
    const user = await signUpWithEmail(email, password);
    await sendEmailVerification(user);
  } catch (error) {
    console.error("Failed to sign up with email in signUpWithEmailActionClient:", error);
    await signOut();
  }
};

/*
Perform email sign in flow on client side. Checks if user is already signed in, signs in with email and password and requests backend to complete email sign in flow.

@param { email: string; password: string }
@param router: any
@returns { void }
*/
export const signInWithEmailActionClient = async (
  { email, password }: { email: string; password: string },
  router: any
) => {
  if (!email || !password) {
    console.error("Email and password must be provided in signInWithEmailActionClient.");
    return;
  }

  try {
    // check if user is already signed in
    if (await getCurrentUser() || await getSessionUser()) {
      console.error("User is already signed in in signInWithEmailActionClient.");
      return;
    }

    // sign in with email and password, send email verification if not verified
    const user = await signInWithEmail(email, password);
    await user.reload();
    if (!user.emailVerified) {
      console.error("Email is not verified in signInWithEmailActionClient.");
      await sendEmailVerification(user);
      await signOut();
      return;
    }

    // get idToken and request backend to complete email sign in flow
    const idToken = await user.getIdToken(true);
    const result = await signInWithEmailActionServer(idToken);
    if (!result) {
      console.error("Failed to complete sign in with email in signInWithEmailActionClient.");
      await signOut();
      return;
    }

    // redirect to home page
    router.push(ATTENDEE_HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with email in signInWithEmailActionClient:", error);
    await signOut();
  }
};

/*
Perform sign out flow on client and server side. Signs out and redirects to login page.

@param router: any
@returns { void }
*/
export const signOutActionClient = async (router: any) => {
  try {
    if (!(await getCurrentUser()) && !(await getSessionUser())) {
      console.error("User is not signed in in signOutActionClient.");
      return;
    }
    await signOut();
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push(ATTENDEE_LOGIN_ROUTE);
  } catch (error) {
    console.error("Failed to log out in signOutActionClient:", error);
  }
};
