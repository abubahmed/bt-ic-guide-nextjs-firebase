/**
 * @file invite-actions.ts
 * @description Server-side invite actions for Firebase Firestore.
 * @module actions/server/invite-actions
 */

"use server";

import { createInvite } from "@/lib/firebase/server/invites";
import { AttendeeInvite, StaffInvite } from "@/types/types";

/*
Create an invite for an attendee or staff member. Creates invite in Firebase Firestore.

@param invite: AttendeeInvite | StaffInvite
@param type: "ATTENDEE" | "STAFF"
@returns { void }
*/

export const createInviteActionServer = async (invite: AttendeeInvite | StaffInvite, type: "ATTENDEE" | "STAFF") => {
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
    if (!(invite as StaffInvite).princetonEmail || !invite.fullName || !(invite as StaffInvite).team) {
      console.error("Princeton email, full name, and team must be provided.");
      return;
    }
  }

  return await createInvite(invite, type);
};
