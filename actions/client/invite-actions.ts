/**
 * @file invite-actions.ts
 * @description Client-side invite actions for Firebase Firestore.
 * @module actions/client/invite-actions
 */

"use client";

import { createInviteActionServer } from "@/actions/server/invite-actions";
import { AttendeeInvite, StaffInvite } from "@/types/types";

/*
Create an invite for an attendee or staff member. Requests backend to create invite.

@param invite: AttendeeInvite | StaffInvite
@param type: "ATTENDEE" | "STAFF"
@returns { void }
*/
export const createInviteActionClient = async (invite: AttendeeInvite | StaffInvite, type: "ATTENDEE" | "STAFF") => {
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

  return await createInviteActionServer(invite, type);
};
