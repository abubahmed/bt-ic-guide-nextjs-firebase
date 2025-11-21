import { db } from "@/lib/firebase/server/config";
import { Timestamp } from "firebase-admin/firestore";
import { serialize } from "@/util/firebase/server";

const USERS_COLLECTION = "users";

export async function getUserProfile(uid: string) {
  const userDoc = db.collection(USERS_COLLECTION).doc(uid);
  const userSnap = await userDoc.get();
  if (userSnap.exists) {
    return serialize(userSnap.data());
  }
}

export async function createUserProfile(user: any) {
  const userProfile = await getUserProfile(user.uid);
  if (userProfile) {
    return userProfile;
  }
  const userDocRef = db.collection(USERS_COLLECTION).doc(user.uid);
  const newUserProfile = {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    phoneNumber: user.phoneNumber || "",
    providerId: user.providerId || "",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: user.emailVerified || false,
  };
  await userDocRef.set(newUserProfile);
  const createdProfile = await userDocRef.get().then((doc) => doc.data());
  return serialize(createdProfile);
}

export async function updateUserProfile(uid: string, updates: any) {
  const userDocRef = db.collection(USERS_COLLECTION).doc(uid);
  updates.updatedAt = Timestamp.now();
  await userDocRef.update(updates);
  const updatedProfile = await userDocRef.get().then((doc) => doc.data());
  return serialize(updatedProfile);
}

export async function deleteUserProfile(uid: string) {
  const userDocRef = db.collection(USERS_COLLECTION).doc(uid);
  await userDocRef.delete();
}
