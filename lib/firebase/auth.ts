import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase/config";

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (!result || !result.user) {
      throw new Error("Google sign-in failed.");
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (!result || !result.user) {
      throw new Error("Email sign-in failed.");
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with email", error);
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (!result || !result.user) {
      throw new Error("Email sign-up failed, no user information available.");
    }
    return result.user;
  } catch (error) {
    console.error("Error signing up with email", error);
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function signOut() {
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    console.error("Error signing out", error);
    return false;
  }
}
