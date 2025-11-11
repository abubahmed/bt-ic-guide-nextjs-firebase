"use server";

import { createUserProfileIfNotExists } from "@/lib/firebase/server/users";
import { getSessionUser } from "@/actions/server/session-actions";

export async function createUserProfileIfNotExistsAction() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return;
  await createUserProfileIfNotExists(sessionUser);
  return true;
}
