import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDataConnect } from "firebase-admin/data-connect";
import { getStorage } from "firebase-admin/storage";

// Solo importar desde rutas de servidor. Nunca exponer estas credenciales al cliente.
export function serviciosAdmin() {
  const existente = getApps().find(app => app.name === "cobre-server");
  const app = existente ?? initializeApp({
    credential: process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON
      ? cert(JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON))
      : applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  }, "cobre-server");
  return {
    auth: getAuth(app),
    db: getDataConnect({ location: "southamerica-west1", serviceId: "lavanderia-el-cobre", connector: "example" }, app),
    bucket: getStorage(app).bucket(),
  };
}
