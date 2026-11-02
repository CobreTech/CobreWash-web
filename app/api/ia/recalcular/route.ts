import { randomUUID } from "node:crypto";
import { prepararRecalculo, type DatosRecalculo } from "@/lib/ia/recalculo";
import { autorizarAdminIa, ErrorIa, errorIa, responder } from "@/lib/ia/servidor";

export const runtime = "nodejs";

/**
 * Recalcula las tasas con todos los conteos aprobados. Solo un administrador
 * activo puede ejecutarlo (verificado en el servidor). Guarda un ajuste nuevo
 * en el historial y actualiza la tasa actual de cada servicio; nunca modifica
 * el stock. Por ahora se ejecuta solo a pedido, sin programación automática.
 */
export async function POST(request: Request) {
  try {
    const { db, dbProduccion, uid } = await autorizarAdminIa(request);
    const { data } = await db.executeQuery<DatosRecalculo>("GetDatosEntrenamientoIa");
    let preparado;
    try { preparado = prepararRecalculo(data, { id: randomUUID(), usuarioId: uid, ahora: new Date() }); }
    catch (e) { throw new ErrorIa(400, e instanceof Error ? e.message : "No se pudo preparar el recálculo."); }
    await dbProduccion.executeMutation("GuardarAjusteIa", { modelo: preparado.modelo, tasas: preparado.tasas });
    const { modelo, detalle } = preparado;
    return responder({
      version: modelo.version,
      observaciones: modelo.observaciones,
      mae: modelo.mae,
      mape: modelo.mape,
      insumos: detalle.insumos.length,
      descartados: detalle.totalDescartados,
    });
  } catch (e) {
    return errorIa(e);
  }
}
