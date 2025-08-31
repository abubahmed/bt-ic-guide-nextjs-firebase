import { db } from "./config";

import { doc, getDoc, setDoc, Timestamp, deleteDoc, updateDoc } from "firebase/firestore";

export async function getUserProfile(uid: string) {
  try {
    const userDoc = doc(db, "users", uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return [userSnap.data(), true, ""];
    } else {
      return [null, false, "User profile does not exist."];
    }
  } catch (error) {
    console.error("Error fetching user profile", error);
    return [null, false, (error as Error).message];
  }
}

export async function createUserProfileIfNotExists(user: any) {
  const [userProfile, success, errorMessage] = await getUserProfile(user.uid);
  if (success && userProfile) {
    return [userProfile, true, ""];
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
    return [createdProfile, true, ""];
  } catch (error) {
    console.error("Error creating user profile", error);
    return [null, false, (error as Error).message];
  }
}

export async function updateUserProfile(uid: string, updates: any) {
  try {
    const userDocRef = doc(db, "users", uid);
    updates.updatedAt = Timestamp.now();
    await updateDoc(userDocRef, updates);
    const updatedProfile = (await getDoc(userDocRef)).data();
    return [updatedProfile, true, ""];
  } catch (error) {
    console.error("Error updating user profile", error);
    return [null, false, (error as Error).message];
  }
}

export async function deleteUserProfile(uid: string) {
  try {
    const userDocRef = doc(db, "users", uid);
    await deleteDoc(userDocRef);
    return [true, ""];
  } catch (error) {
    console.error("Error deleting user profile", error);
    return [false, (error as Error).message];
  }
}
