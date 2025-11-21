/**
 * @file auth-actions.ts
 * @description Client-side authentication actions for Firebase Auth.
 * @module actions/client/auth-actions
 */

"use client";

import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  sendEmailVerification,
} from "@/lib/firebase/client/auth";
import { HOME_ROUTE, ROOT_ROUTE } from "@/constants";
import { getSessionUser } from "@/actions/server/session-actions";
import {
  signInWithGoogleActionServer,
  signUpWithEmailActionServer,
  signInWithEmailActionServer,
} from "@/actions/server/auth-actions";

/*
Perform Google OAuth sign in flow on client side. Checks if user is already signed in, signs in with Google OAuth and requests backend to complete Google OAuth sign in flow.

@param router: any
@returns { void }
*/
export const signInWithGoogleActionClient = async (router: any) => {
  try {
    // check if user is already signed in
    const sessionUser = await getSessionUser();
    if (sessionUser) {
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
    router.push(HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with Google in signInWithGoogleActionClient:", error);
    await signOut();
    return;
  }
};

/*
Perform email sign up flow on client side. Checks if user is already signed in, signs up with email and password and requests backend to complete email sign up flow.

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
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in in signUpWithEmailActionClient.");
      return;
    }

    // sign up with email and password, send email verification if not verified
    const user = await signUpWithEmail(email, password);
    await user.reload();
    if (!user.emailVerified) {
      console.error("Email is not verified in signUpWithEmailActionClient.");
      await sendEmailVerification(user);
      await signOut();
      return;
    }

    // get idToken and request backend to complete email sign up flow
    const idToken = await user.getIdToken(true);
    const result = await signUpWithEmailActionServer(idToken);
    if (!result) {
      console.error("Failed to complete sign up with email in signUpWithEmailActionClient.");
      await signOut();
      return;
    }

    // redirect to home page
    router.push(HOME_ROUTE);
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
    const sessionUser = await getSessionUser();
    if (sessionUser) {
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
    router.push(HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with email in signInWithEmailActionClient:", error);
    await signOut();
  }
};

/*
Perform sign out flow on client and server side. Signs out and redirects to root page.

@param router: any
@returns { void }
*/
export const signOutActionClient = async (router: any) => {
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    await signOut();
    router.push(ROOT_ROUTE);
  } catch (error) {
    console.error("Failed to log out in signOutActionClient:", error);
  }
};
