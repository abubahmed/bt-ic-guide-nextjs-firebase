import { createInviteActionServer } from "@/actions/server/invite-actions";
import { Invite } from "@/types/types";

export const createInviteActionClient = async (invite: Invite) => {
  if (!invite.fullName || !invite.email || !invite.affiliation || !invite.notes) {
    console.error("Full name, email, affiliation, and notes must be provided in createInviteActionClient.");
    return;
  }
  try {
    const createdInvite = await createInviteActionServer(invite);
    return createdInvite;
  } catch (error) {
    console.error("Failed to create invite in createInviteAction:", error);
    return null;
  }
};
