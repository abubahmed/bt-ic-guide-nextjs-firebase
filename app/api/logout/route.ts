import { NextResponse } from "next/server";
import { ROLE_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/constants";
import { getSessionUser } from "@/actions/session-actions";
import { auth } from "@/lib/firebase/server/config";

export async function POST() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await auth.revokeRefreshTokens(sessionUser.uid);
  } catch (error) {
    console.error("Error revoking refresh tokens in logout route:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set({
    name: ROLE_COOKIE_NAME,
    value: "",
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res
}
