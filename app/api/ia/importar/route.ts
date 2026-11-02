import { randomUUID } from "node:crypto";
import { leerCsv, type TipoCsv } from "@/lib/ia/csv";
import { rangoFilas, registrosParaGuardar, separarRepetidas, type RegistrosExistentes } from "@/lib/ia/importacion";
import { autorizarAdminIa, ErrorIa, errorIa, leerJson, responder } from "@/lib/ia/servidor";

export const runtime = "nodejs";

/** Un CSV de 2.000 filas ocupa bastante menos que esto. */
const LIMITE_BYTES = 400_000;

/**
 * Importa conteos o compras históricos desde un CSV. El servidor vuelve a
 * validar el archivo completo (no confía en la vista previa del navegador) y
 * guarda todo o nada.
 */
export async function POST(request: Request) {
  try {
    const { db, dbProduccion, uid } = await autorizarAdminIa(request);
    const cuerpo = (await leerJson(request, LIMITE_BYTES)) as { tipo?: unknown; texto?: unknown };
    const tipo = cuerpo?.tipo;
    if (tipo !== "conteos" && tipo !== "compras") throw new ErrorIa(400, "Indica si el archivo trae conteos o compras.");
    if (typeof cuerpo.texto !== "string" || !cuerpo.texto.trim()) throw new ErrorIa(400, "El archivo está vacío.");

    const { data: catalogo } = await db.executeQuery<{ insumos: { id: string; nombre: string }[] }>("GetInsumosImportacionIa");
    const { filas, errores } = leerCsv(cuerpo.texto, tipo as TipoCsv, catalogo.insumos);
    if (errores.length) throw new ErrorIa(400, "El archivo tiene filas con errores. Corrígelas y vuelve a cargarlo.", errores);
    if (!filas.length) throw new ErrorIa(400, "El archivo no trae filas para importar.");

    const { data: existentes } = await db.executeQuery<RegistrosExistentes, { desde: string; hasta: string }>("GetRegistrosExistentesIa", rangoFilas(filas));
    const { nuevas, repetidas } = separarRepetidas(filas, tipo, existentes);
    if (repetidas.length) throw new ErrorIa(409, "Algunas filas ya estaban registradas. Quítalas del archivo para no duplicarlas.", repetidas);

    const registros = registrosParaGuardar(nuevas, tipo, uid, new Date(), randomUUID);
    if (tipo === "conteos") await dbProduccion.executeMutation("ImportarConteosIa", { conteos: registros });
    else await dbProduccion.executeMutation("ImportarComprasIa", { compras: registros });
    return responder({ guardadas: registros.length });
  } catch (e) {
    return errorIa(e);
  }
}
