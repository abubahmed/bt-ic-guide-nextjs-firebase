import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./constants";
import {
  PUBLIC_ROUTES,
  STAFF_ROUTE_PREFIX,
  ATTENDEE_ROUTE_PREFIX,
  STAFF_LOGIN_ROUTE,
  ATTENDEE_LOGIN_ROUTE,
  STAFF_HOME_ROUTE,
  ATTENDEE_HOME_ROUTE,
} from "./route-config";

export default async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";
  const isSignedIn = session ? true : false;
  const currentRoute = request.nextUrl.pathname;


  return NextResponse.next();
}
