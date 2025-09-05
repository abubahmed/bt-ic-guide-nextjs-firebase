import { createUserProfileIfNotExists } from "@/lib/firebase/users";
import { getSessionUser } from "@/actions/server/session-actions";
import { useRouter } from "next/navigation";
import { HOME_ROUTE, ROOT_ROUTE } from "@/constants";

export async function createUserProfileIfNotExistsAction(idToken: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return [null, false, "No session user found."];
  }
  const [profile, success, errorMessage] = await createUserProfileIfNotExists(sessionUser.uid);
  return [profile, success, errorMessage];
}
