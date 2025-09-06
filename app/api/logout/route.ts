import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/server/config";
import { cookies } from "next/headers";

const COOKIE_NAME = "__Host-session";

export async function POST() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (session) {
    try {
      const decoded = await auth.verifySessionCookie(session, false);
      await auth.revokeRefreshTokens(decoded.sub as string);
    } catch (error) {
      console.error("Error verifying or revoking session cookie:", error);
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
