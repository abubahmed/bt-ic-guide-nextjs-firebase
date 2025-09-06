"use client";

import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from "@/lib/firebase/client/auth";
import { createUserProfileIfNotExistsAction } from "@/actions/server/auth-actions";
import { useRouter } from "next/navigation";
import { HOME_ROUTE, ROOT_ROUTE } from "@/constants";
import { getSessionUser } from "@/actions/server/session-actions";

const createSessionAndProfile = async (user: any) => {
  const idToken = await user.getIdToken(true);
  try {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });
  } catch (error) {
    console.error("Failed to create session:", error);
    return;
  }

  const profile = await createUserProfileIfNotExistsAction(idToken);
  if (profile) {
    console.error("Failed to create or fetch user profile");
  }
};

export const signInWithGoogleAction = async (router: any) => {
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }

  const user = await signInWithGoogle();
  if (!user) {
    console.error("Google sign-in failed.");
    return;
  }

  await createSessionAndProfile(user);
  router.push(HOME_ROUTE);
};

export const signInWithEmailAction = async ({ email, password }: { email: string; password: string }, router: any) => {
  if (!email || !password) {
    console.error("Email and password must be provided.");
    return;
  }

  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }

  const user = await signInWithEmail(email, password);
  if (!user) {
    console.error("Email sign-in failed.");
    return;
  }

  await createSessionAndProfile(user);
  router.push(HOME_ROUTE);
};

export const signUpWithEmailAction = async (
  { email, password, passwordConfirm }: { email: string; password: string; passwordConfirm: string },
  router: any
) => {
  if (!email || !password || !passwordConfirm) {
    console.error("Email, password, and confirm password must be provided.");
    return;
  }
  if (password !== passwordConfirm) {
    console.error("Passwords do not match.");
    return;
  }

  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }

  const user = await signUpWithEmail(email, password);
  if (!user) {
    console.error("Email sign-up failed.");
    return;
  }

  await createSessionAndProfile(user);
  router.push(HOME_ROUTE);
};

export const signOutAction = async (router: any) => {
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
  } catch (error) {
    console.error("Failed to log out:", error);
  }
  await signOut();
  router.push(ROOT_ROUTE);
};
