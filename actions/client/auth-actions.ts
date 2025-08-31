import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from "@/lib/firebase/auth";
import { createUserProfileIfNotExists } from "@/lib/firebase/users";
import { createSession, removeSession, getSession } from "@/actions/server/session-actions";
import { redirect } from "next/navigation";
import { HOME_ROUTE, ROOT_ROUTE } from "@/constants";

const signInWithGoogleAction = async (formData: any) => {
  const session = await getSession();
  if (session) {
    console.error("User is already signed in.");
    return;
  }

  const [user, success, errorMessage] = (await signInWithGoogle()) as any[];
  if (!success || !user) {
    console.error("Google sign-in failed:", errorMessage);
    return;
  }

  const [profile, profileSuccess, profileError] = await createUserProfileIfNotExists(user);
  if (!profileSuccess) {
    console.error("Failed to create or fetch user profile:", profileError);
    return;
  }

  await createSession(user.uid);
  redirect(HOME_ROUTE);
};

export { signInWithGoogleAction };
