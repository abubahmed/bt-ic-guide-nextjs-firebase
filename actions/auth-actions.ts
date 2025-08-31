import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from "@/lib/firebase/auth";
import { createSession, removeSession, getSession } from "./session-actions";
import { redirect } from "next/navigation";
import { HOME_ROUTE, ROOT_ROUTE } from "@/constants";

const signInWithGoogleAction = async (formData: any) => {
  const session = await getSession();
  if (session) {
    console.error("User is already signed in.");
    return;
  }

  const [user, success, errorMessage] = (await signInWithGoogle()) as any[];
  if (!success || !user) {
    console.error("Google sign-in failed:", errorMessage);
    return;
  }

  await createSession(user.uid);
  redirect(HOME_ROUTE);
};

const signInWithEmailAction = async (formData: any) => {
  const session = await getSession();
  if (session) {
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

  await createSession(user.uid);
  redirect(HOME_ROUTE);
};

const signUpWithEmailAction = async (formData: any) => {
  const session = await getSession();
  if (session) {
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
  await createSession(user.uid);
  redirect(HOME_ROUTE);
};

const signOutAction = async () => {
  const session = await getSession();
  if (!session) {
    console.error("No active session found.");
    return;
  }
  await signOut();
  await removeSession();
  redirect(ROOT_ROUTE);
};

export { signInWithGoogleAction, signInWithEmailAction, signUpWithEmailAction, signOutAction };
