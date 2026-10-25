"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, History, Loader2, SlidersHorizontal } from "lucide-react";
import { getHistorialInventario, TipoMovimiento, type GetHistorialInventarioData } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";
import { limitesFechasConsulta } from "@/lib/reportes/fechas";
import { crearCsvMovimientos } from "@/lib/inventario/movimientos";
import { leerHistorialCompleto } from "@/lib/inventario/historial";
import { registrarError } from "@/lib/registro-seguro";

const TAMANO = 20;
export default function HistorialInventario({ insumos, revision }: {
  insumos: { id: string; nombre: string }[]; revision: string;
}) {
  const [insumoId, setInsumoId] = useState("");
  const [tipo, setTipo] = useState<"" | TipoMovimiento>("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [pagina, setPagina] = useState(0);
  const [datos, setDatos] = useState<GetHistorialInventarioData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState("");
  const [reintento, setReintento] = useState(0);
  const solicitud = useRef(0);
  const filtros = useCallback(() => ({
    insumoId: insumoId || undefined, tipo: tipo || undefined,
    ...limitesFechasConsulta(desde, hasta),
  }), [insumoId, tipo, desde, hasta]);
  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      const version = ++solicitud.current;
      setCargando(true); setError("");
      try {
        const resultado = await getHistorialInventario(dataConnect, { ...filtros(), limit: TAMANO, offset: pagina * TAMANO }, { fetchPolicy: "SERVER_ONLY" });
        if (activo && version === solicitud.current) {
          const total = resultado.data.total[0]?._count ?? 0;
          if (pagina > 0 && pagina * TAMANO >= total) { setPagina(Math.max(0, Math.ceil(total / TAMANO) - 1)); return; }
          setDatos(resultado.data);
        }
      } catch (e) {
        registrarError("No se pudo cargar el historial de inventario", e);
        if (activo && version === solicitud.current) { setDatos(null); setError("No se pudo cargar el historial. Intenta nuevamente."); }
      } finally { if (activo && version === solicitud.current) setCargando(false); }
    };
    void cargar();
    const volver = () => { if (document.visibilityState === "visible") void cargar(); };
    window.addEventListener("focus", volver);
    return () => { activo = false; window.removeEventListener("focus", volver); };
  }, [filtros, pagina, revision, reintento]);

  async function exportar() {
    if (exportando) return;
    setExportando(true); setError("");
    try {
      const condiciones = filtros();
      // Congela el extremo superior para que las nuevas entradas no desplacen las páginas.
      const ahora = new Date().toISOString();
      if (!condiciones.fechaHastaExclusiva || condiciones.fechaHastaExclusiva > ahora) condiciones.fechaHastaExclusiva = ahora;
      const filas = await leerHistorialCompleto(async (offset, limit) => {
        const resultado = await getHistorialInventario(dataConnect, { ...condiciones, offset, limit }, { fetchPolicy: "SERVER_ONLY" });
        return { movimientos: resultado.data.movimientoInventarios, total: resultado.data.total[0]?._count ?? 0 };
      });
      const url = URL.createObjectURL(new Blob([crearCsvMovimientos(filas)], { type: "text/csv;charset=utf-8" }));
      const enlace = document.createElement("a");
      enlace.href = url; enlace.download = `movimientos-inventario-${ahora.slice(0, 10)}.csv`;
      document.body.appendChild(enlace); enlace.click(); enlace.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { registrarError("No se pudo exportar el historial", e); setError("No se pudo descargar el historial completo. Intenta nuevamente."); }
    finally { setExportando(false); }
  }
  const total = datos?.total[0]?._count ?? 0;
  const paginas = Math.max(1, Math.ceil(total / TAMANO));
  const clase = "mt-1 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2 text-sm dark:border-white/10";
  return <section className="glass-panel overflow-hidden rounded-2xl" aria-label="Historial de inventario">
    <div className="space-y-4 border-b border-stone-100 px-5 py-4 dark:border-white/5">
      <div className="flex items-center gap-2"><History className="h-5 w-5 text-brand-500" /><div><h2 className="text-sm font-extrabold">Historial de movimientos</h2><p className="text-xs text-stone-400">Consulta y descarga todas las entradas y salidas.</p></div></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <label className="text-xs font-semibold text-stone-500">Insumo<select value={insumoId} onChange={e => { setInsumoId(e.target.value); setPagina(0); }} className={clase}><option value="">Todos</option>{insumos.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}</select></label>
        <label className="text-xs font-semibold text-stone-500">Tipo<select value={tipo} onChange={e => { setTipo(e.target.value as "" | TipoMovimiento); setPagina(0); }} className={clase}><option value="">Todos</option><option value="ENTRADA">Entradas</option><option value="SALIDA">Salidas</option></select></label>
        <label className="text-xs font-semibold text-stone-500">Desde<input type="date" value={desde} max={hasta || undefined} onChange={e => { setDesde(e.target.value); setPagina(0); }} className={clase} /></label>
        <label className="text-xs font-semibold text-stone-500">Hasta<input type="date" value={hasta} min={desde || undefined} onChange={e => { setHasta(e.target.value); setPagina(0); }} className={clase} /></label>
        <div className="flex items-end gap-2"><button title="Limpiar filtros" onClick={() => { setInsumoId(""); setTipo(""); setDesde(""); setHasta(""); setPagina(0); }} className="rounded-xl border border-stone-200 p-2.5 text-stone-500 dark:border-white/10"><SlidersHorizontal className="h-4 w-4" /></button><button onClick={() => void exportar()} disabled={exportando || cargando || !total} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40">{exportando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}{exportando ? "Descargando…" : "CSV completo"}</button></div>
      </div>
    </div>
    {error && <div role="alert" className="flex items-center justify-between gap-3 bg-red-50 px-5 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}<button className="font-bold underline" onClick={() => setReintento(v => v + 1)}>Reintentar</button></div>}
    <div aria-busy={cargando} className="max-h-[520px] divide-y divide-stone-100 overflow-y-auto dark:divide-white/5">
      {cargando ? <p role="status" className="flex justify-center gap-2 p-8 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin" />Cargando movimientos…</p> : datos?.movimientoInventarios.map(m => <div key={m.id} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-bold">{m.insumo.nombre}</p><p className="text-xs text-stone-400">{m.motivo || "Sin observación"} · {m.usuario ? `${m.usuario.nombre} ${m.usuario.apellido ?? ""}`.trim() : "Sistema"}</p></div><p className={`font-extrabold ${m.tipoMovimiento === "ENTRADA" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{m.tipoMovimiento === "ENTRADA" ? "+" : "−"}{m.cantidad.toLocaleString("es-CL")} {m.insumo.unidadMedida}</p><time className="text-xs text-stone-400">{new Date(m.fecha).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" })}</time></div>)}
      {!cargando && !error && !total && <p className="p-8 text-center text-sm text-stone-400">No hay movimientos para los filtros seleccionados.</p>}
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-5 py-4 text-xs text-stone-500 dark:border-white/5"><span>{total.toLocaleString("es-CL")} movimientos · Página {pagina + 1} de {paginas}</span><div className="flex gap-2"><button disabled={cargando || pagina === 0} onClick={() => setPagina(p => p - 1)} className="rounded-xl border border-stone-200 px-3 py-2 font-bold disabled:opacity-40 dark:border-white/10">Anterior</button><button disabled={cargando || pagina + 1 >= paginas} onClick={() => setPagina(p => p + 1)} className="rounded-xl border border-stone-200 px-3 py-2 font-bold disabled:opacity-40 dark:border-white/10">Siguiente</button></div></div>
  </section>;
}
