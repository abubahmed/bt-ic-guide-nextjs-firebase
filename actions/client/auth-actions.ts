"use client";

import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from "@/lib/firebase/client/auth";
import { createUserProfileIfNotExistsAction } from "@/actions/server/auth-actions";
import { HOME_ROUTE, ROOT_ROUTE } from "@/constants";
import { getSessionUser } from "@/actions/server/session-actions";

const createSessionAndProfile = async (user: any) => {
  const idToken = await user.getIdToken(true);
  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
  await createUserProfileIfNotExistsAction(idToken);
};

export const signInWithGoogleAction = async (router: any) => {
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in in signInWithGoogleAction.");
      return;
    }

    const user = await signInWithGoogle();
    await createSessionAndProfile(user);
    router.push(HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with Google in signInWithGoogleAction:", error);
  }
};

export const signInWithEmailAction = async ({ email, password }: { email: string; password: string }, router: any) => {
  if (!email || !password) {
    console.error("Email and password must be provided in signInWithEmailAction.");
    return;
  }

  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in in signInWithEmailAction.");
      return;
    }

    const user = await signInWithEmail(email, password);
    await createSessionAndProfile(user);
    router.push(HOME_ROUTE);
  } catch (error) {
    console.error("Failed to sign in with Email in signInWithEmailAction:", error);
  }
};

export const signUpWithEmailAction = async (
  { email, password, passwordConfirm }: { email: string; password: string; passwordConfirm: string },
  router: any
) => {
  if (!email || !password || !passwordConfirm) {
    console.error("Email, password, and confirm password must be provided in signUpWithEmailAction.");
    return;
  }
  if (password !== passwordConfirm) {
    console.error("Passwords do not match in signUpWithEmailAction.");
    return;
  }

  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      console.error("User is already signed in in signUpWithEmailAction.");
      return;
    }

    const user = await signUpWithEmail(email, password);
    await createSessionAndProfile(user);
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
