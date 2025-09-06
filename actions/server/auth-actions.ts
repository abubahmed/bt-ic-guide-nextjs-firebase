"use server";

import { createUserProfileIfNotExists } from "@/lib/firebase/users";
import { getSessionUser } from "@/actions/server/session-actions";

export async function createUserProfileIfNotExistsAction(idToken: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return;
  }
  const profile = await createUserProfileIfNotExists(sessionUser.uid);
  return profile;
}
