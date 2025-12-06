import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/server/config";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants";
import { getSessionUser } from "@/actions/session-actions";
import { getUser } from "@/lib/firebase/server/users";

export async function POST() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
