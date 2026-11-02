"use client";

import { useState } from "react";
import { AlertTriangle, BrainCircuit, Gauge, Loader2, RefreshCw, Scale } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { registrarError } from "@/lib/registro-seguro";
import { diasDeStock } from "@/lib/ia/prediccion";
import { leerDetalleAjuste, type DetalleAjuste } from "@/lib/ia/recalculo";
import type { GetPanelIaData } from "@/src/dataconnect-generated";
import { claseBotonPrincipal, formatoNumero, Tarjeta, type Avisar } from "./ui";

const uuid = (id: string) => id.replaceAll("-", "").toLowerCase();
const fecha = (iso: string) => new Date(iso).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "medium", timeStyle: "short" });
const porcentaje = (v: number | null | undefined, decimales = 1) => (v === null || v === undefined ? "—" : `${formatoNumero(v, decimales)}%`);

const METODO: Record<DetalleAjuste["insumos"][number]["metodoError"], string> = {
  "validacion-cruzada": "medido prediciendo cada período sin verlo",
  ajuste: "pocos conteos: medido sobre el mismo ajuste",
  "sin-datos": "aún sin conteos",
};

function Kpi({ etiqueta, valor, nota, clase = "" }: { etiqueta: string; valor: string; nota?: string; clase?: string }) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="text-xs font-semibold text-stone-400">{etiqueta}</p>
      <p className={`mt-1 text-2xl font-extrabold ${clase}`}>{valor}</p>
      {nota && <p className="mt-0.5 text-[11px] text-stone-400">{nota}</p>}
    </div>
  );
}

function claseDias(dias: number | null) {
  if (dias === null) return "text-stone-400";
  if (dias < 7) return "text-red-600 dark:text-red-400";
  if (dias < 14) return "text-amber-600 dark:text-amber-400";
  return "text-green-600 dark:text-green-400";
}

export default function ResumenIa({ panel, recargar, avisar }: { panel: GetPanelIaData; recargar: () => Promise<void>; avisar: Avisar }) {
  const [recalculando, setRecalculando] = useState(false);
  const modelo = panel.modeloVigente[0];
  const detalle = leerDetalleAjuste(modelo?.tasasJson);
  const stock = new Map(panel.insumos.map((i) => [uuid(i.id), i]));

  const recalcular = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;
    setRecalculando(true);
    try {
      const r = await fetch("/api/ia/recalcular", { method: "POST", cache: "no-store", headers: { Authorization: `Bearer ${await usuario.getIdToken()}` } });
      const datos = await r.json().catch(() => ({}));
      if (!r.ok) { avisar(datos.error ?? "No se pudo recalcular el modelo.", "error"); return; }
      await recargar();
      const error = datos.mape === null || datos.mape === undefined ? "aún sin error medible" : `error medio ${porcentaje(datos.mape)}`;
      avisar(`Ajuste ${datos.version} listo: ${datos.observaciones} períodos entre conteos, ${error}.${datos.descartados ? ` ${datos.descartados} períodos descartados.` : ""}`, datos.descartados ? "warning" : "success");
    } catch (e) {
      registrarError("No se pudo recalcular el modelo IA", e);
      avisar("No se pudo recalcular. Revisa tu conexión e intenta nuevamente.", "error");
    } finally { setRecalculando(false); }
  };

  return (
    <div className="space-y-6">
      <Tarjeta
        icono={BrainCircuit} titulo="Estado del modelo"
        descripcion={modelo ? `Ajuste ${modelo.version} del ${fecha(modelo.fechaEntrenamiento)}` : "Aún no hay ajustes. Define tasas, registra conteos y recalcula."}
        accion={
          <button type="button" onClick={recalcular} disabled={recalculando} className={claseBotonPrincipal}>
            {recalculando ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {recalculando ? "Recalculando…" : "Recalcular ahora"}
          </button>
        }
      >
        {modelo && (
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-600 dark:bg-white/5 dark:text-stone-300">λ = {formatoNumero(modelo.lambda ?? 0)}</span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-600 dark:bg-white/5 dark:text-stone-300">Margen {porcentaje((modelo.margenSeguridad ?? 0) * 100, 0)}</span>
            {modelo.incluyeSimulado && <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-700 dark:text-amber-400">Incluye datos simulados</span>}
          </div>
        )}
      </Tarjeta>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi etiqueta="Error medio (MAPE)" valor={porcentaje(modelo?.mape)} nota="Diferencia promedio entre lo estimado y lo contado" clase="text-brand-600 dark:text-brand-400" />
        <Kpi etiqueta="Períodos usados" valor={String(modelo?.observaciones ?? 0)} nota="Pares de conteos consecutivos" />
        <Kpi etiqueta="Conteos reales" valor={String(panel.conteosReales[0]?._count ?? 0)} nota="Conteos físicos aprobados" />
        <Kpi etiqueta="Rango de estimación" valor={modelo?.desviacionRelativa ? `±${porcentaje(modelo.desviacionRelativa * 100, 0)}` : "—"} nota="Se estrecha con más conteos" />
      </div>

      {detalle && detalle.insumos.length > 0 && (
        <Tarjeta icono={Gauge} titulo="Insumos" descripcion="Error del ajuste y días de stock al ritmo de consumo reciente.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-stone-400"><tr><th className="py-2 pr-3">Insumo</th><th className="py-2 pr-3">Períodos</th><th className="py-2 pr-3">Error</th><th className="py-2 pr-3">Consumo diario</th><th className="py-2">Días de stock</th></tr></thead>
              <tbody>
                {detalle.insumos.map((i) => {
                  const insumo = stock.get(uuid(i.insumoId));
                  const dias = insumo ? diasDeStock(insumo.stockActual, i.consumoDiario) : null;
                  return (
                    <tr key={i.insumoId} className="border-t border-stone-100 dark:border-white/5">
                      <td className="py-2.5 pr-3 font-bold">{i.nombre}</td>
                      <td className="py-2.5 pr-3">{i.observaciones}</td>
                      <td className="py-2.5 pr-3">
                        {porcentaje(i.mape)}{i.mae !== null && <span className="text-xs text-stone-400"> · ±{formatoNumero(i.mae)} {i.unidad}</span>}
                        <span className="block text-[11px] text-stone-400">{METODO[i.metodoError]}</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        {i.consumoDiario === null ? "—" : `${formatoNumero(i.consumoDiario)} ${i.unidad}/día`}
                        {i.fuenteConsumo === "kg-recientes" && <span className="block text-[11px] text-stone-400">estimado con kg recientes</span>}
                      </td>
                      <td className={`py-2.5 text-base font-extrabold ${claseDias(dias)}`}>{dias === null ? "—" : formatoNumero(Math.floor(dias), 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      <Tarjeta icono={Scale} titulo="Tasas actuales frente a iniciales" descripcion="Cuánto corrigió el modelo cada tasa con la evidencia de los conteos.">
        {panel.tasaConsumos.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-stone-400"><tr><th className="py-2 pr-3">Insumo</th><th className="py-2 pr-3">Servicio</th><th className="py-2 pr-3">Inicial</th><th className="py-2 pr-3">Actual</th><th className="py-2">Variación</th></tr></thead>
              <tbody>
                {panel.tasaConsumos.map((t) => {
                  const variacion = t.tasaInicial > 0 ? ((t.tasaActual - t.tasaInicial) / t.tasaInicial) * 100 : null;
                  return (
                    <tr key={`${t.tipoServicioId}-${t.insumoId}`} className="border-t border-stone-100 dark:border-white/5">
                      <td className="py-2.5 pr-3 font-bold">{t.insumo.nombre}</td>
                      <td className="py-2.5 pr-3">{t.tipoServicio.nombre}</td>
                      <td className="py-2.5 pr-3">{formatoNumero(t.tasaInicial, 4)} {t.unidad}/kg</td>
                      <td className="py-2.5 pr-3 font-bold">{formatoNumero(t.tasaActual, 4)} {t.unidad}/kg</td>
                      <td className={`py-2.5 font-bold ${variacion === null || Math.abs(variacion) < 0.05 ? "text-stone-400" : variacion > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}`}>
                        {variacion === null ? "—" : `${variacion > 0 ? "+" : ""}${formatoNumero(variacion, 1)}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500 dark:bg-white/5">Aún no hay tasas. Defínelas en la pestaña Tasas.</p>
        )}
      </Tarjeta>

      {detalle && detalle.totalDescartados > 0 && (
        <Tarjeta icono={AlertTriangle} titulo={`Períodos descartados (${detalle.totalDescartados})`} descripcion="No se usaron en el último ajuste. Revisa si falta registrar una compra o los kg de las comandas.">
          <ul className="space-y-1.5 text-sm">
            {detalle.descartados.map((d) => (
              <li key={`${d.insumo}-${d.desde}-${d.hasta}`} className="rounded-xl bg-amber-50/70 px-3 py-2 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                <strong>{d.insumo}</strong> · {fecha(d.desde)} → {fecha(d.hasta)}: {d.motivo}
              </li>
            ))}
          </ul>
          {detalle.totalDescartados > detalle.descartados.length && <p className="mt-2 text-xs text-stone-400">Se muestran {detalle.descartados.length} de {detalle.totalDescartados}.</p>}
        </Tarjeta>
      )}
    </div>
  );
}
