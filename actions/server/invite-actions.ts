"use server";

import { createInvite } from "@/lib/firebase/server/invites";
import { Invite } from "@/types/types";

export const createInviteActionServer = async (invite: Invite) => {
  if (!invite.fullName || !invite.email || !invite.affiliation || !invite.notes) {
    console.error("Full name, email, affiliation, and notes must be provided in createInviteActionServer.");
    return;
  }
  const createdInvite = await createInvite(invite);
  return createdInvite;
};
