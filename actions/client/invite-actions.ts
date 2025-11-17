import { createInviteActionServer } from "@/actions/server/invite-actions";
import { AttendeeInvite, StaffInvite } from "@/types/types";

export const createInviteActionClient = async (invite: AttendeeInvite | StaffInvite, type: "ATTENDEE" | "STAFF") => {
  if (
    type === "ATTENDEE" &&
    (!invite.fullName || !(invite as AttendeeInvite).email || !(invite as AttendeeInvite).affiliation)
  ) {
    console.error("Full name, email, affiliation must be provided in createInviteActionClient.");
    return;
  }
  if (
    type === "STAFF" &&
    (!(invite as StaffInvite).princetonEmail || !invite.fullName || !(invite as StaffInvite).team)
  ) {
    console.error("Princeton email, full name, and team must be provided in createInviteActionClient.");
    return;
  }
  try {
    console.log("Creating invite in createInviteActionClient:", invite, type);
    const createdInvite = await createInviteActionServer(invite, type);
    return createdInvite;
  } catch (error) {
    console.error("Failed to create invite in createInviteActionClient:", error);
    return null;
  }
};
