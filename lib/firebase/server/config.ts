import { initializeApp, credential, ServiceAccount } from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getApps } from "firebase-admin/app";

const app =
  getApps()[0] ??
  initializeApp({
    credential: credential.cert(serviceAccount as ServiceAccount),
  });

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
