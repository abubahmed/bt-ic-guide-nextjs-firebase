import { type NextRequest, NextResponse } from "next/server";
import { APP_ROUTES } from "./route-config";
import { SESSION_COOKIE_NAME } from "./constants";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";


  const currentRoute = request.nextUrl.pathname;

//   if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
//     const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }

//   if (session && request.nextUrl.pathname === ROOT_ROUTE) {
//     const absoluteURL = new URL(HOME_ROUTE, request.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }
}
