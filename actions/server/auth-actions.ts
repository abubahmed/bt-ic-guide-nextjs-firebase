"use server";

import { createUserProfile, getUserProfile } from "@/lib/firebase/server/users";
import { getSessionUser } from "@/actions/server/session-actions";

export async function createVerifiedProfileAction() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    throw new Error("Session user is not found in createVerifiedProfileAction.");
  }

  const userData = {
    uid: sessionUser.uid,
    displayName: sessionUser.displayName || null,
    email: sessionUser.email || null,
    photoURL: sessionUser.photoURL || null,
    phoneNumber: sessionUser.phoneNumber || null,
    providerId: sessionUser.providerId || null,
    emailVerified: true,
  };
  await createUserProfile(userData as any);
}

export async function createProfileAndGetVerifiedStatus(user: any) {
  const userProfile = (await getUserProfile(user.uid)) || null;
  if (userProfile) {
    return userProfile.emailVerified || false;
  }

  const userData = {
    uid: user.uid,
    displayName: user.displayName || null,
    email: user.email,
    photoURL: user.photoURL || null,
    phoneNumber: user.phoneNumber || null,
    providerId: user.providerId || null,
    emailVerified: false,
  };
  await createUserProfile(userData as any);
  return false;
}
