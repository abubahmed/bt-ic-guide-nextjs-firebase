import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_LIFESPAN } from "@/constants";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
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
