import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getDataConnect } from "firebase-admin/data-connect";

// Vista previa por defecto. No procesa pedidos, cuentas, fotografías ni solicitudes.
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId || process.argv.find(a => a.startsWith("--project=")) !== `--project=${projectId}`) throw new Error("Indica explícitamente --project=<proyecto> y configura NEXT_PUBLIC_FIREBASE_PROJECT_ID.");
const app = initializeApp({ credential: applicationDefault(), projectId });
const db = getDataConnect({ location: "southamerica-west1", serviceId: "lavanderia-el-cobre", connector: "example" }, app);
const antesDe = new Date(Date.now() - 48 * 3_600_000).toISOString();
const r = await db.executeQuery("ContarLimitesContactoVencidos", { antesDe });
console.log(JSON.stringify({ proyecto: projectId, antesDe, vistaPrevia: !process.argv.includes("--apply"), resultado: r.data }));
if (process.argv.includes("--apply")) {
  const resultado = await db.executeMutation("PurgarLimitesContacto", { antesDe });
  console.log(JSON.stringify({ resultado: resultado.data }));
}
