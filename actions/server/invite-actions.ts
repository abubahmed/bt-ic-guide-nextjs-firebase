"use server";

import { createInvite } from "@/lib/firebase/server/invites";
import { AttendeeInvite, StaffInvite } from "@/types/types";

export const createAttendeeInviteActionServer = async (
  invite: AttendeeInvite | StaffInvite,
  type: "ATTENDEE" | "STAFF"
) => {
  if (!invite.fullName || !(invite as AttendeeInvite).email || !(invite as AttendeeInvite).affiliation) {
    console.error("Full name, email, affiliation must be provided in createAttendeeInviteActionServer.");
    return;
  }
  if (
    type === "STAFF" &&
    (!(invite as StaffInvite).princetonEmail || !invite.fullName || !(invite as StaffInvite).team)
  ) {
    console.error("Princeton email, full name, and team must be provided in createStaffInviteActionServer.");
    return;
  }
  const createdInvite = await createInvite(invite, type);
  return createdInvite;
};
