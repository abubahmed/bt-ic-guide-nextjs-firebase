import { db } from "@/lib/firebase/server/config";
import { Timestamp } from "firebase-admin/firestore";
import { serialize } from "@/lib/firebase/server/utils";
import { USERS_COLLECTION } from "@/constants";

export async function getUserProfile(uid: string) {
  const userDoc = db.collection(USERS_COLLECTION).doc(uid);
  const userSnap = await userDoc.get();
  if (userSnap.exists) {
    return serialize(userSnap.data());
  }
}

export async function getUserProfiles() {
  const userDocs = await db.collection(USERS_COLLECTION).get();
  return userDocs.docs.map((doc) => serialize(doc.data()));
}

export async function createUserProfile(user: any) {
  const existing = await getUserProfile(user.uid);
  if (existing) {
    return existing;
  }

  const userDocRef = db.collection(USERS_COLLECTION).doc(user.uid);
  const newUserProfile = {
    uid: user.uid || "",
    displayName: user.displayName || "",
    email: user.email || "",
    emailVerified: user.emailVerified || false,
    photoURL: user.photoURL || "",
    phoneNumber: user.phoneNumber || "",
    providerId: user.providerId || "",

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    role: null,
    accessStatus: null,
    fullName: null,
    subteam: null,

    school: null,
    grade: null,
    company: null,

    eventIds: [],
    roomNumber: null,
    qrCode: null,
    helpRequests: [],
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
