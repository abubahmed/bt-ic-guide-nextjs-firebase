export const STAFF_ROUTE = "/staff";
export const ATTENDEE_ROUTE = "/attendee";
export const ATTENDEE_AUTH_ROUTE = "/attendee/auth";
export const STAFF_AUTH_ROUTE = "/staff/auth";

export const APP_ROUTES = {
  staffProtectedRoutes: [
    `${STAFF_ROUTE}/announcements`,
    `${STAFF_ROUTE}/help`,
    `${STAFF_ROUTE}/rooms`,
    `${STAFF_ROUTE}/qrcodes`,
    `${STAFF_ROUTE}/resources`,
    `${STAFF_ROUTE}/people`,
    `${STAFF_ROUTE}/map`,
    `${STAFF_ROUTE}/schedules`,
    `${STAFF_ROUTE}/`,
  ],
  attendeeProtectedRoutes: [`${ATTENDEE_ROUTE}/`],
  publicRoutes: [
    `${ATTENDEE_AUTH_ROUTE}/login`,
    `${ATTENDEE_AUTH_ROUTE}/signup`,
    `${ATTENDEE_AUTH_ROUTE}/invite-request`,
    `${STAFF_AUTH_ROUTE}/login`,
    `${STAFF_AUTH_ROUTE}/signup`,
    `${STAFF_AUTH_ROUTE}/invite-request`,
  ],
};
