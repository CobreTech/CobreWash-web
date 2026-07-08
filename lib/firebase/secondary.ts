import { initializeApp, deleteApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@/src/dataconnect-generated";
import { firebaseConfig } from "@/lib/firebase/client";

/**
 * Crea una instancia de Firebase totalmente separada de la sesión principal.
 * Permite que un admin cree cuentas de otros usuarios (createUserWithEmailAndPassword
 * inicia sesión como el usuario nuevo) sin cerrar su propia sesión.
 */
export function createSecondaryFirebaseContext() {
  const app = initializeApp(firebaseConfig, `secondary-${crypto.randomUUID()}`);
  const auth = getAuth(app);
  const dataConnect = getDataConnect(app, connectorConfig);

  return {
    auth,
    dataConnect,
    cleanup: () => deleteApp(app),
  };
}
