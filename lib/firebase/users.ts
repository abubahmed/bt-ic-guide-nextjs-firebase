import { db } from "./config";

import { doc, getDoc, setDoc, Timestamp, deleteDoc, updateDoc } from "firebase/firestore";

export async function getUserProfile(uid: string) {
  try {
    const userDoc = doc(db, "users", uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data();
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
    const userDocRef = doc(db, "users", user.uid);
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
    await setDoc(userDocRef, newUserProfile, { merge: true });
    const createdProfile = (await getDoc(userDocRef)).data();
    return createdProfile;
  } catch (error) {
    console.error("Error creating user profile", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, updates: any) {
  try {
    const userDocRef = doc(db, "users", uid);
    updates.updatedAt = Timestamp.now();
    await updateDoc(userDocRef, updates);
    const updatedProfile = (await getDoc(userDocRef)).data();
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile", error);
  }
}

export async function deleteUserProfile(uid: string) {
  try {
    const userDocRef = doc(db, "users", uid);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Error deleting user profile", error);
  }
}
