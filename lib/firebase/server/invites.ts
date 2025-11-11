import { db } from "@/lib/firebase/server/config";
import { Timestamp } from "firebase-admin/firestore";
import { serialize } from "@/util/firebase";
import { Invite } from "@/types/types";

const INVITES_COLLECTION = "invites";

export async function createInvite(invite: Invite) {
  const inviteDocRef = db.collection(INVITES_COLLECTION).doc();
  const newInvite = {
    id: inviteDocRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    email: invite.email,
    fullName: invite.fullName,
    affiliation: invite.affiliation,
    notes: invite.notes,
    status: "PENDING" as const,
  };
  await inviteDocRef.set(newInvite);
  const createdInvite = await inviteDocRef.get().then((doc) => doc.data());
  return serialize(createdInvite);
}

export async function getInvite(id: string) {
  const inviteDoc = db.collection(INVITES_COLLECTION).doc(id);
  const inviteSnap = await inviteDoc.get();
  if (inviteSnap.exists) {
    return serialize(inviteSnap.data());
  }
}

export async function deleteInvite(id: string) {
  const inviteDoc = db.collection(INVITES_COLLECTION).doc(id);
  await inviteDoc.delete();
}

export async function getInvites() {
  const inviteDocs = await db.collection(INVITES_COLLECTION).get();
  return inviteDocs.docs.map((doc) => serialize(doc.data()));
}
