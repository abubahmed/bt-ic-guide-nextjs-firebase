import { db } from "@/lib/firebase/server/config";
import { Timestamp } from "firebase-admin/firestore";

function serialize(v: any): any {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") {
    const out: Record<string, any> = {};
    for (const [k, x] of Object.entries(v)) out[k] = serialize(x);
    return out;
  }
  return v;
}

export async function getUserProfile(uid: string) {
  try {
    const userDoc = db.collection("users").doc(uid);
    const userSnap = await userDoc.get();
    if (userSnap.exists) {
      return serialize(userSnap.data());
    }
    console.error("No user profile found for UID:", uid);
  } catch (error) {
    console.error("Error fetching user profile", error);
  }
}

export async function createUserProfileIfNotExists(user: any) {
  const userProfile = await getUserProfile(user.uid);
  if (userProfile) {
    return userProfile;
  }
  try {
    const userDocRef = db.collection("users").doc(user.uid);
    const newUserProfile = {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      phoneNumber: user.phoneNumber || "",
      providerId: user.providerId || "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await userDocRef.set(newUserProfile);
    const createdProfile = await userDocRef.get().then((doc) => doc.data());
    return serialize(createdProfile);
  } catch (error) {
    console.error("Error creating user profile", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, updates: any) {
  try {
    const userDocRef = db.collection("users").doc(uid);
    updates.updatedAt = Timestamp.now();
    await userDocRef.update(updates);
    const updatedProfile = await userDocRef.get().then((doc) => doc.data());
    return serialize(updatedProfile);
  } catch (error) {
    console.error("Error updating user profile", error);
  }
}

export async function deleteUserProfile(uid: string) {
  try {
    const userDocRef = db.collection("users").doc(uid);
    await userDocRef.delete();
  } catch (error) {
    console.error("Error deleting user profile", error);
  }
}
