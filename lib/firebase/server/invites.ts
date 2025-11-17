import { db } from "@/lib/firebase/server/config";
import { Timestamp } from "firebase-admin/firestore";
import { serialize } from "@/util/firebase";
import { AttendeeInvite, StaffInvite } from "@/types/types";

const INVITES_COLLECTION = "invites";

export async function createInvite(invite: AttendeeInvite | StaffInvite, type: "ATTENDEE" | "STAFF") {
  console.log("Creating invite in createInvite:", invite, type);
  const inviteDocRef = db.collection(INVITES_COLLECTION).doc();
  let newInvite: any;
  if (type === "ATTENDEE") {
    newInvite = {
      id: inviteDocRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      email: (invite as AttendeeInvite).email,
      fullName: invite.fullName,
      affiliation: (invite as AttendeeInvite).affiliation,
      notes: (invite as AttendeeInvite).notes,
      status: "PENDING" as const,
    };
  } else if (type === "STAFF") {
    newInvite = {
      id: inviteDocRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      princetonEmail: (invite as StaffInvite).princetonEmail,
      fullName: (invite as StaffInvite).fullName,
      team: (invite as StaffInvite).team,
      notes: (invite as StaffInvite).notes,
      status: "PENDING" as const,
    };
  }
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
