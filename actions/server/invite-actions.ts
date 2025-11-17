"use server";

import { createInvite } from "@/lib/firebase/server/invites";
import { AttendeeInvite, StaffInvite } from "@/types/types";

export const createInviteActionServer = async (invite: AttendeeInvite | StaffInvite, type: "ATTENDEE" | "STAFF") => {
  console.log("Creating invite in createInviteActionServer:", invite, type);
  if (type === "ATTENDEE" && (!invite.fullName || !(invite as AttendeeInvite).email || !(invite as AttendeeInvite).affiliation)) {
    console.error("Full name, email, affiliation must be provided in createInviteActionServer.");
    return;
  }
  if (
    type === "STAFF" &&
    (!(invite as StaffInvite).princetonEmail || !invite.fullName || !(invite as StaffInvite).team)
  ) {
    console.error("Princeton email, full name, and team must be provided in createInviteActionServer.");
    return;
  }
  const createdInvite = await createInvite(invite, type);
  return createdInvite;
};
