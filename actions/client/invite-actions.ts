"use client";

import { createInvite as createInviteServer } from "@/actions/server/invite-actions";
import { AttendeeInvite, StaffInvite } from "@/types/types";

export const createInvite = async (invite: AttendeeInvite | StaffInvite, type: "ATTENDEE" | "STAFF") => {
  if (!invite || !type) {
    console.error("Invite and type must be provided.");
    return;
  }
  if (type === "ATTENDEE") {
    if (!invite.fullName || !(invite as AttendeeInvite).email || !(invite as AttendeeInvite).affiliation) {
      console.error("Full name, email, affiliation must be provided.");
      return;
    }
  } else if (type === "STAFF") {
    if (!invite.fullName || !(invite as StaffInvite).princetonEmail || !(invite as StaffInvite).team) {
      console.error("Full name, Princeton email, and team must be provided.");
      return;
    }
  }

  console.log("Creating invite:", invite, type);
  return await createInviteServer(invite, type);
};
