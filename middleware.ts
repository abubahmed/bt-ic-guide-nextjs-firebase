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

const staffOrAttendee = () => {
  const values = ["STAFF", "STAFF"];
  const index = Math.random() < 0.5 ? 0 : 1;
  return values[index];
};

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";
  const sessionRole = session ? staffOrAttendee() : null;
  const currentRoute = request.nextUrl.pathname;

  if (PUBLIC_ROUTES.includes(currentRoute)) {
    if (sessionRole === "STAFF") {
      return NextResponse.redirect(new URL(STAFF_HOME_ROUTE, request.url));
    } else if (sessionRole === "ATTENDEE") {
      return NextResponse.redirect(new URL(ATTENDEE_HOME_ROUTE, request.url));
    } else {
      return NextResponse.next();
    }
  }

  if (currentRoute.startsWith(STAFF_ROUTE_PREFIX)) {
    if (sessionRole === "ATTENDEE") {
      return NextResponse.redirect(new URL(ATTENDEE_HOME_ROUTE, request.url));
    } else if (sessionRole === null) {
      return NextResponse.redirect(new URL(STAFF_LOGIN_ROUTE, request.url));
    } else {
      return NextResponse.next();
    }
  }

  if (currentRoute.startsWith(ATTENDEE_ROUTE_PREFIX)) {
    if (sessionRole === "STAFF") {
      return NextResponse.redirect(new URL(STAFF_HOME_ROUTE, request.url));
    } else if (sessionRole === null) {
      return NextResponse.redirect(new URL(ATTENDEE_LOGIN_ROUTE, request.url));
    } else {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}
