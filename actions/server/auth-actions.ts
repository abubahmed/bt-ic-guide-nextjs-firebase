"use server";

import { createUserProfileIfNotExists } from "@/lib/firebase/server/users";
import { getSessionUser } from "@/actions/server/session-actions";

export async function createUserProfileIfNotExistsAction(idToken: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return;
  }
  const profile = await createUserProfileIfNotExists(sessionUser);
  return profile;
}
