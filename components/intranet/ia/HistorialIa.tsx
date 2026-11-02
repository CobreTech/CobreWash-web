"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, History, Loader2 } from "lucide-react";
import { QueryFetchPolicy } from "firebase/data-connect";
import { dataConnect } from "@/lib/firebase/client";
import { registrarError } from "@/lib/registro-seguro";
import { leerDetalleAjuste } from "@/lib/ia/recalculo";
import { getHistorialAjustesIa, type GetHistorialAjustesIaData } from "@/src/dataconnect-generated";
import GraficoLineas, { COLORES_SERIE } from "./GraficoLineas";
import { claseBotonSecundario, formatoNumero, Tarjeta } from "./ui";

const POR_PAGINA = 20;
const fecha = (iso: string) => new Date(iso).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" });
const pct = (v?: number | null) => (v === null || v === undefined ? "—" : `${formatoNumero(v, 1)}%`);

/** `revision` cambia con cada recálculo para volver a cargar la lista. */
export default function HistorialIa({ revision }: { revision: string }) {
  const [pagina, setPagina] = useState(0);
  const [datos, setDatos] = useState<GetHistorialAjustesIaData | null>(null);
  const [error, setError] = useState(false);
  const [abierto, setAbierto] = useState<string | null>(null);
  const solicitud = useRef(0);

  const cargar = useCallback(async () => {
    const actual = ++solicitud.current;
    try {
      const { data } = await getHistorialAjustesIa(dataConnect, { limit: POR_PAGINA, offset: pagina * POR_PAGINA }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
      if (actual === solicitud.current) { setDatos(data); setError(false); }
    } catch (e) {
      registrarError("No se pudo cargar el historial IA", e);
      if (actual === solicitud.current) setError(true);
    }
  }, [pagina]);

  useEffect(() => { void Promise.resolve().then(cargar); }, [cargar, revision]);

  if (error) {
    return (
      <div role="alert" className="glass-panel rounded-2xl p-6 text-center text-sm text-stone-500">
        No se pudo cargar el historial.
        <button type="button" onClick={() => void cargar()} className="ml-2 font-bold text-brand-600 hover:underline">Reintentar</button>
      </div>
    );
  }
  if (!datos) return <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin text-brand-500" /></div>;

  const total = datos.total[0]?._count ?? 0;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const cronologico = [...datos.modeloIas].reverse();

  return (
    <div className="space-y-6">
      <Tarjeta icono={History} titulo="Historial de ajustes" descripcion={`${total} ${total === 1 ? "ajuste registrado" : "ajustes registrados"}. Cada recálculo agrega uno y deja vigente el último.`}>
        {!total ? (
          <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500 dark:bg-white/5">Aún no hay ajustes. Usa «Recalcular ahora» en Resumen.</p>
        ) : (
          <div className="space-y-6">
            {cronologico.some((m) => m.mape !== null && m.mape !== undefined) && (
              <GraficoLineas
                titulo="Error medio de cada ajuste"
                etiquetaX="Ajuste"
                puntos={cronologico.map((m) => ({ x: m.version, valores: [m.mape ?? null] }))}
                series={[{ nombre: "Error medio (MAPE)", color: COLORES_SERIE.naranja }]}
                formato={(v) => pct(v)}
              />
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase text-stone-400">
                  <tr><th className="py-2 pr-3">Ajuste</th><th className="py-2 pr-3">Fecha</th><th className="py-2 pr-3">Por</th><th className="py-2 pr-3">Períodos</th><th className="py-2 pr-3">MAPE</th><th className="py-2 pr-3">λ</th><th className="py-2 pr-3">Margen</th><th className="py-2 pr-3">Datos</th><th className="py-2"><span className="sr-only">Detalle</span></th></tr>
                </thead>
                <tbody>
                  {datos.modeloIas.map((m) => {
                    const detalle = abierto === m.id ? leerDetalleAjuste(m.tasasJson) : null;
                    return (
                      <Fragment key={m.id}>
                        <tr className="border-t border-stone-100 dark:border-white/5">
                          <td className="py-2.5 pr-3 font-bold">
                            {m.version}
                            {m.activo && <span className="ml-2 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">Vigente</span>}
                          </td>
                          <td className="py-2.5 pr-3">{fecha(m.fechaEntrenamiento)}</td>
                          <td className="py-2.5 pr-3">{m.ejecutadoPor ? `${m.ejecutadoPor.nombre} ${m.ejecutadoPor.apellido ?? ""}`.trim() : "—"}</td>
                          <td className="py-2.5 pr-3">{m.observaciones}</td>
                          <td className="py-2.5 pr-3 font-bold">{pct(m.mape)}</td>
                          <td className="py-2.5 pr-3">{m.lambda === null || m.lambda === undefined ? "—" : formatoNumero(m.lambda)}</td>
                          <td className="py-2.5 pr-3">{m.margenSeguridad === null || m.margenSeguridad === undefined ? "—" : pct(m.margenSeguridad * 100)}</td>
                          <td className="py-2.5 pr-3">{m.incluyeSimulado ? <span className="text-amber-700 dark:text-amber-400">Con simulados</span> : "Reales"}</td>
                          <td className="py-2.5 text-right">
                            <button type="button" aria-expanded={abierto === m.id} aria-label={`Ver tasas del ajuste ${m.version}`} onClick={() => setAbierto(abierto === m.id ? null : m.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5">
                              <ChevronDown className={`h-4 w-4 transition ${abierto === m.id ? "rotate-180" : ""}`} />
                            </button>
                          </td>
                        </tr>
                        {abierto === m.id && (
                          <tr>
                            <td colSpan={9} className="bg-stone-50/70 px-3 py-3 dark:bg-white/5">
                              {detalle?.insumos.length ? (
                                <ul className="space-y-1 text-xs">
                                  {detalle.insumos.flatMap((i) => i.tasas.map((t) => (
                                    <li key={`${i.insumoId}-${t.servicioId}`}>
                                      <strong>{i.nombre}</strong> · {t.servicio}: {formatoNumero(t.anterior, 4)} → <strong>{formatoNumero(t.resultado, 4)} {t.unidad}/kg</strong>
                                      <span className="text-stone-400"> (inicial {formatoNumero(t.inicial, 4)} · error {pct(i.mape)})</span>
                                    </li>
                                  )))}
                                </ul>
                              ) : <p className="text-xs text-stone-400">Este ajuste no tiene detalle de tasas.</p>}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {paginas > 1 && (
              <div className="flex items-center justify-end gap-2 text-xs">
                <button type="button" disabled={pagina === 0} onClick={() => setPagina(pagina - 1)} className={claseBotonSecundario}>Más recientes</button>
                <span className="text-stone-400">Página {pagina + 1} de {paginas}</span>
                <button type="button" disabled={pagina + 1 >= paginas} onClick={() => setPagina(pagina + 1)} className={claseBotonSecundario}>Anteriores</button>
              </div>
            )}
          </div>
        )}
      </Tarjeta>
    </div>
  );
}
