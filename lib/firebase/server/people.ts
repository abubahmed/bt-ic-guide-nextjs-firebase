import { db } from "@/lib/firebase/server/config";
import { Timestamp } from "firebase-admin/firestore";
import { serialize } from "@/lib/firebase/server/utils";

const PERSONS_COLLECTION = "people";
const BATCH_SIZE = 100;

export async function getPerson(email: string) {
  const personDocs = await db.collection(PERSONS_COLLECTION).where("email", "==", email).limit(1).get();

  if (personDocs.empty) {
    return null;
  }
  return serialize(personDocs.docs[0].data());
}

export async function createPerson(person: any) {
  const existing = await getPerson(person.email);
  if (existing) {
    return existing;
  }

  const personDocRef = db.collection(PERSONS_COLLECTION).doc();
  const newPerson = {
    email: person.email || "",
    phone: person.phone || "",
    fullName: person.fullName || "",
    role: person.role || null,
    subteam: person.subteam || null,
    school: person.school || null,
    grade: person.grade || null,
    company: person.company || null,

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await personDocRef.set(newPerson);
  const createdPerson = await personDocRef.get().then((doc) => doc.data());
  return serialize(createdPerson);
}

export async function updatePerson(email: string, updates: any) {
  const personDocs = await db.collection(PERSONS_COLLECTION).where("email", "==", email).limit(1).get();

  if (personDocs.empty) {
    return null;
  }
  const personDoc = personDocs.docs[0];
  updates.updatedAt = Timestamp.now();
  await personDoc.ref.update(updates);
  const updatedPerson = await personDoc.ref.get().then((doc) => doc.data());
  return serialize(updatedPerson);
}

export async function deletePerson(email: string) {
  const personDocs = await db.collection(PERSONS_COLLECTION).where("email", "==", email).limit(1).get();

  if (personDocs.empty) {
    return null;
  }
  const personDoc = personDocs.docs[0].ref;
  await personDoc.delete();
  return true;
}

async function deleteAllPersons() {
  const collectionRef = db.collection(PERSONS_COLLECTION);
  let snapshot;

  do {
    snapshot = await collectionRef.limit(BATCH_SIZE).get();
    if (snapshot.empty) {
      break;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } while (!snapshot.empty);
}

export async function createPersons(persons: any[]) {
  await deleteAllPersons();

  let batch = db.batch();
  let operationCount = 0;

  for (const person of persons) {
    const docRef = db.collection(PERSONS_COLLECTION).doc();

    const newPersonData = {
      email: person.email || "",
      phone: person.phone || "",
      fullName: person.fullName || "",
      role: person.role || null,
      subteam: person.subteam || null,
      school: person.school || null,
      grade: person.grade || null,
      company: person.company || null,

      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    batch.set(docRef, newPersonData);
    operationCount++;
    if (operationCount === BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  return true;
}
