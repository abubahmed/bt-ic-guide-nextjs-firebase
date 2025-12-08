import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
  sendEmailVerification as _sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client/config";

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((user) => {
      resolve(user);
      unsub();
    });
  });
}

export async function signOut() {
  await auth.signOut();
}

export async function sendEmailVerification(user: User) {
  await _sendEmailVerification(user);
}
