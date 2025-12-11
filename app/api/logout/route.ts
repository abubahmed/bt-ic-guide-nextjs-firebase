import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants";
import { getSessionUser } from "@/actions/session-actions";
import { auth } from "@/lib/firebase/server/config";

export async function POST() {
  try {
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
    return res;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
