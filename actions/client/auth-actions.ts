"use client";

import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from "@/lib/firebase/auth";
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
  const [profile, profileSuccess, profileError] = await createUserProfileIfNotExistsAction(idToken);
  if (!profileSuccess) {
    console.error("Failed to create or fetch user profile:", profileError);
    return;
  }
};

const signInWithGoogleAction = async () => {
  const router = useRouter();
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }

  const [user, success, errorMessage] = (await signInWithGoogle()) as any[];
  if (!success || !user) {
    console.error("Google sign-in failed:", errorMessage);
    return;
  }

  await createSessionAndProfile(user);
  router.push(HOME_ROUTE);
};

const signInWithEmailAction = async (formData: any) => {
  const router = useRouter();
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    console.error("Email and password must be provided.");
    return;
  }

  const [user, success, errorMessage] = (await signInWithEmail(email, password)) as any[];
  if (!success || !user) {
    console.error("Email sign-in failed:", errorMessage);
    return;
  }

  await createSessionAndProfile(user);
  router.push(HOME_ROUTE);
};

const signUpWithEmailAction = async (formData: any) => {
  const router = useRouter();
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    console.error("User is already signed in.");
    return;
  }

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!email || !password || !confirmPassword) {
    console.error("Email, password, and confirm password must be provided.");
    return;
  }
  if (password !== confirmPassword) {
    console.error("Passwords do not match.");
    return;
  }

  const [user, success, errorMessage] = (await signUpWithEmail(email, password)) as any[];
  if (!success || !user) {
    console.error("Email sign-up failed:", errorMessage);
    return;
  }

  await createSessionAndProfile(user);
  router.push(HOME_ROUTE);
};

const signOutAction = async () => {
  const router = useRouter();
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
  } catch (error) {
    console.error("Failed to log out:", error);
  }
  await signOut();
  router.push(ROOT_ROUTE);
};

export { signInWithGoogleAction, signInWithEmailAction, signUpWithEmailAction, signOutAction };
