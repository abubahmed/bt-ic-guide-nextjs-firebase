import { NextResponse } from "next/server";
import { getSessionUser } from "@/actions/session-actions";
import { getUserProfile, getUserProfiles } from "@/lib/firebase/server/users";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserProfile(sessionUser.uid);
  if (user.role !== "admin" || user.accessStatus !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const people = await getUserProfiles();
  return NextResponse.json({ people });
}
