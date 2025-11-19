import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/server/config";
import { getUserProfile } from "@/lib/firebase/server/users";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_LIFESPAN } from "@/constants";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    await auth.verifyIdToken(idToken);

    const user = await auth.getUser(idToken);
    if (!user || !user.emailVerified) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_LIFESPAN,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_LIFESPAN / 1000,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
