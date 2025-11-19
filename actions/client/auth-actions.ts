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
import { signInWithGoogleActionServer, signUpWithEmailActionServer } from "@/actions/server/auth-actions";

export const signInWithGoogleActionClient = async (router: any) => {
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in in.");
      return;
    }

    const user = await signInWithGoogle();
    const idToken = await user.getIdToken(true);
    const result = await signInWithGoogleActionServer(idToken);
    if (!result || !result.sessionCookie) {
      console.error("Failed to complete sign in with Google.");
      return;
    }
    router.push(HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with Google:", error);
  }
};

export const signUpWithEmailActionClient = async (
  { email, password, passwordConfirm }: { email: string; password: string; passwordConfirm: string },
  router: any
) => {
  if (!email || !password || !passwordConfirm) {
    console.error("Email and password must be provided.");
    return;
  }
  if (password !== passwordConfirm) {
    console.error("Passwords do not match.");
    return;
  }

  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in.");
      return;
    }

    const user = await signUpWithEmail(email, password);
    await sendEmailVerification(user);
    const idToken = await user.getIdToken(true);
    const result = await signUpWithEmailActionServer(idToken);
    if (!result || !result.sessionCookie) {
      console.error("Failed to complete sign up with Email.");
      return;
    }
  } catch (error) {
    console.error("Failed to sign up with email:", error);
  }
};

export const signInWithEmailAction = async (
  { email, password }: { email: string; password: string },
  router: any
) => {
  if (!email || !password) {
    console.error("Email and password must be provided.");
    return;
  }

  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in in signUpWithEmailAction.");
      return;
    }

    const user = await signInWithEmail(email, password);
    await user.reload();
    if (!user.emailVerified) {
      console.error("Email is not verified.");
      return;
    }

    const idToken = await user.getIdToken(true);
    const result = await signInWithEmailActionServer(idToken);
    if (!result || !result.sessionCookie) {
      console.error("Failed to complete sign in with Email.");
      return;
    }

    router.push(HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign up with Email in signUpWithEmailAction:", error);
  }
};

export const signOutAction = async (router: any) => {
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    await signOut();
    router.push(ROOT_ROUTE);
  } catch (error) {
    console.error("Failed to log out in signOutAction:", error);
  }
};
