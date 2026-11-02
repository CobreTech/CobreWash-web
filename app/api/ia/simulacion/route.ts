import { randomInt, randomUUID } from "node:crypto";
import { prepararLoteSimulado, type DatosSimulacion, type ParametrosLote } from "@/lib/ia/lote-simulado";
import { autorizarAdminIa, ErrorIa, errorIa, leerJson, responder } from "@/lib/ia/servidor";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
const numero = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : NaN);

/** Genera un lote de datos simulados alrededor de las tasas vigentes. */
export async function POST(request: Request) {
  try {
    const { db, dbProduccion, uid } = await autorizarAdminIa(request);
    const cuerpo = (await leerJson(request, 2_000)) as Record<string, unknown> | null;
    const parametros: ParametrosLote = {
      semanas: numero(cuerpo?.semanas),
      kgSemanalMin: numero(cuerpo?.kgSemanalMin),
      kgSemanalMax: numero(cuerpo?.kgSemanalMax),
      ruido: numero(cuerpo?.ruido),
      desvioTasas: numero(cuerpo?.desvioTasas),
      semilla: cuerpo?.semilla === undefined || cuerpo?.semilla === null ? randomInt(1, 2 ** 31) : numero(cuerpo.semilla),
    };
    const { data } = await db.executeQuery<DatosSimulacion>("GetTasasSimulacionIa");
    let lote;
    try { lote = prepararLoteSimulado(data, parametros, { id: randomUUID(), usuarioId: uid, ahora: new Date(), crearId: randomUUID }); }
    catch (e) { throw new ErrorIa(400, e instanceof Error ? e.message : "Parámetros inválidos."); }
    await dbProduccion.executeMutation("GuardarSimulacionIa", { simulacion: lote.simulacion, produccion: lote.produccion, conteos: lote.conteos, compras: lote.compras });
    const final = lote.curva.at(-1)!;
    return responder({
      id: lote.simulacion.id,
      semilla: parametros.semilla,
      conteos: lote.conteos.length,
      compras: lote.compras.length,
      periodos: final.periodos,
      errorTasasInicial: lote.curva[0].errorTasas,
      errorTasasFinal: final.errorTasas,
      mapeFinal: final.mape,
    });
  } catch (e) {
    return errorIa(e);
  }
}

/** Borra un lote (con `id`) o todos los datos simulados. Nunca toca datos reales. */
export async function DELETE(request: Request) {
  try {
    const { db } = await autorizarAdminIa(request);
    const cuerpo = (await leerJson(request, 500)) as { id?: unknown } | null;
    if (cuerpo?.id === undefined) {
      await db.executeMutation("BorrarSimulacionesIa");
      return responder({ borrado: "todos" });
    }
    if (typeof cuerpo.id !== "string" || !UUID.test(cuerpo.id)) throw new ErrorIa(400, "Simulación inválida.");
    try { await db.executeMutation("BorrarSimulacionIa", { id: cuerpo.id }); }
    catch (e) {
      if (e instanceof Error && /ya no existe/.test(e.message)) throw new ErrorIa(404, "La simulación ya no existe.");
      throw e;
    }
    return responder({ borrado: cuerpo.id });
  } catch (e) {
    return errorIa(e);
  }
}
