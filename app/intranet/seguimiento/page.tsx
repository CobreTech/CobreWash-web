"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Search, Settings, X } from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import FlujoProduccion from "@/components/intranet/FlujoProduccion";
import { dataConnect } from "@/lib/firebase/client";
import { normalizarEtapas, estadoEtapa } from "@/lib/produccion/modelo";
import { getSeguimientoProduccion, getEtapasProduccion, configurarEtapaProduccion, asociarFlujoComandaPendiente, type GetSeguimientoProduccionData, type GetEtapasProduccionData } from "@/src/dataconnect-generated";

const PAGE_SIZE = 20;
type EtapaCatalogo = GetEtapasProduccionData["etapaProduccions"][number];
const inputStyle = "mt-1 w-full rounded-lg border border-stone-300 bg-transparent p-2 dark:border-white/20";
export default function SeguimientoPage() {
  const permitido = useRoleGuard(["admin", "recepcionista", "operario"]);
  const usuario = useUsuarioActualContext();
  const admin = usuario?.rol.nombre === "admin";
  const puedeAsociar = admin || usuario?.rol.nombre === "recepcionista";
  const [data, setData] = useState<GetSeguimientoProduccionData | null>(null);
  const [catalogo, setCatalogo] = useState<EtapaCatalogo[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [configuracion, setConfiguracion] = useState(false);
  const [editar, setEditar] = useState<EtapaCatalogo | null>(null);
  const solicitud = useRef(0);
  const operacion = useRef(false);
  const cargar = useCallback(async (silencioso = false) => {
    if (!permitido) return;
    const id = ++solicitud.current;
    if (!silencioso) setLoading(true);
    try {
      const [res, etapas] = await Promise.all([
        getSeguimientoProduccion(dataConnect, { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, buscar: search.trim() }, { fetchPolicy: "SERVER_ONLY" }),
        getEtapasProduccion(dataConnect, { fetchPolicy: "SERVER_ONLY" }),
      ]);
      if (id !== solicitud.current) return;
      setData(res.data);
      setCatalogo(etapas.data.etapaProduccions);
      setError("");
      const paginas = Math.max(1, Math.ceil((res.data.total[0]?._count ?? 0) / PAGE_SIZE));
      if (page > paginas) setPage(paginas);
    } catch {
      if (id === solicitud.current) setError("No se pudo cargar producción. Intenta actualizar nuevamente.");
    } finally {
      if (id === solicitud.current) setLoading(false);
    }
  }, [permitido, page, search]);
  useEffect(() => {
    const contador = solicitud;
    const timer = window.setTimeout(() => void cargar(), 250);
    const refrescar = () => { if (document.visibilityState === "visible") void cargar(true); };
    const interval = window.setInterval(refrescar, 10000);
    window.addEventListener("focus", refrescar);
    return () => {
      ++contador.current;
      window.clearTimeout(timer); window.clearInterval(interval);
      window.removeEventListener("focus", refrescar);
    };
  }, [cargar]);
  async function asociar(id: string) {
    if (operacion.current) return;
    operacion.current = true; setBusy(id); setNotice("");
    try {
      await asociarFlujoComandaPendiente(dataConnect, { id });
      setNotice("Flujo asociado correctamente."); await cargar(true);
    } catch { setError("No se pudo asociar el flujo. Actualiza para comprobar si ya fue asociado."); }
    finally { operacion.current = false; setBusy(null); }
  }
  async function guardarEtapa(event: React.FormEvent) {
    event.preventDefault();
    if (!editar || operacion.current) return;
    operacion.current = true; setBusy(editar.id); setNotice("");
    try {
      await configurarEtapaProduccion(dataConnect, { id: editar.id, nombre: editar.nombre.trim(), descripcion: editar.descripcion?.trim() || null, tiempoEstimadoMin: editar.tiempoEstimadoMin ?? null });
      setEditar(null); setNotice("Configuración guardada. Se aplicará a los nuevos flujos."); await cargar(true);
    } catch { setError("No se pudo guardar la etapa. Revisa que el nombre no esté repetido y el tiempo sea positivo."); }
    finally { operacion.current = false; setBusy(null); }
  }
  if (!permitido) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const total = data?.total[0]?._count ?? 0;
  const paginas = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-extrabold">Seguimiento de Producción</h1><p className="mt-1 text-sm text-stone-500">{total} comandas pendientes, en proceso o listas para entregar</p></div>
      <div className="flex gap-2">
        {admin && <button onClick={() => setConfiguracion(!configuracion)} className="flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2 text-sm dark:border-white/10"><Settings className="h-4 w-4" />Configurar etapas</button>}
        <button onClick={() => void cargar()} disabled={loading} className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><RefreshCw className="h-4 w-4" />Actualizar</button>
      </div>
    </div>
    {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div>}
    {notice && <div role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-300">{notice}</div>}
    {!loading && catalogo.length !== 5 && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">Falta configurar el catálogo de las cinco etapas de producción. Contacta a administración.</p>}
    {admin && configuracion && <section className="space-y-3 rounded-2xl border border-stone-200 p-5 dark:border-white/10">
      <h2 className="font-bold">Etapas del flujo</h2>
      <p className="text-sm text-stone-500">La secuencia es Recepción, Lavado, Secado, Planchado y Entrega. Puedes ajustar sus nombres, descripciones y tiempos. Las comandas asociadas conservan su configuración.</p>
      {catalogo.map((etapa) => <div key={etapa.id} className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 p-3 dark:bg-white/5"><span className="text-sm">{etapa.orden}. {etapa.nombre}</span><button onClick={() => setEditar({ ...etapa })} className="text-sm font-bold text-brand-600 dark:text-brand-400">Editar</button></div>)}
    </section>}
    <label className="relative block max-w-md"><span className="sr-only">Buscar comanda o cliente</span><Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Buscar comanda o cliente..." className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm dark:border-white/10 dark:bg-stone-900" /></label>
    {loading ? <div role="status" className="flex justify-center gap-2 py-12"><Loader2 className="h-5 w-5 animate-spin" />Cargando producción...</div> : <div className="space-y-3">
      {data?.comandas.map((c) => {
        const etapas = normalizarEtapas(c.comandaEtapas_on_comanda);
        return <article key={c.id} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-stone-900">
          <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} aria-expanded={expanded === c.id} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
            <span><span className="block font-bold">{c.numeroComanda}</span><span className="text-sm text-stone-500">{c.cliente.nombre} · {c.comandaDetalles_on_comanda.reduce((s, d) => s + d.cantidad, 0)} prendas</span></span>
            <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400">{!etapas.length ? "Sin flujo asociado" : estadoEtapa(etapas)}</span>
          </button>
          {expanded === c.id && <div className="mt-5 space-y-4 border-t border-stone-100 pt-4 dark:border-white/5">
            <p className="text-xs text-stone-500">Ingreso: {new Date(c.fechaRecepcion).toLocaleString("es-CL")}</p>
            <FlujoProduccion etapas={etapas} />
            {!etapas.length && c.estado === "PENDIENTE" && puedeAsociar && <button disabled={busy != null || catalogo.length !== 5} onClick={() => void asociar(c.id)} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy === c.id ? "Asociando..." : "Asociar flujo de producción"}</button>}
            {!etapas.length && c.estado !== "PENDIENTE" && <p className="text-xs text-stone-500">Comanda anterior sin registro de etapas. Su estado se conserva.</p>}
          </div>}
        </article>;
      })}
      {data && data.comandas.length === 0 && <p className="py-12 text-center text-sm text-stone-500">No hay comandas de producción que coincidan con la búsqueda.</p>}
    </div>}
    <div className="flex items-center justify-between gap-4 text-sm"><span>{total} resultados · Página {page} de {paginas}</span><div className="flex gap-2"><button disabled={loading || page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Anterior</button><button disabled={loading || page >= paginas} onClick={() => setPage(page + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Siguiente</button></div></div>
    {editar && admin && <div role="dialog" aria-modal="true" aria-labelledby="titulo-etapa" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={guardarEtapa} className="relative w-full max-w-md space-y-4 rounded-2xl bg-white p-6 dark:bg-stone-900">
        <button type="button" disabled={busy != null} onClick={() => setEditar(null)} aria-label="Cerrar configuración" className="absolute right-4 top-4"><X className="h-5 w-5" /></button>
        <h2 id="titulo-etapa" className="pr-6 font-bold">Configurar etapa {editar.orden}</h2>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <label className="block text-sm">Nombre<input required maxLength={40} value={editar.nombre} onChange={(e) => setEditar({ ...editar, nombre: e.target.value })} className={inputStyle} /></label>
        <label className="block text-sm">Descripción<textarea maxLength={200} value={editar.descripcion ?? ""} onChange={(e) => setEditar({ ...editar, descripcion: e.target.value })} className={inputStyle} /></label>
        <label className="block text-sm">Tiempo estimado (minutos, opcional)<input type="number" min={1} step={1} value={editar.tiempoEstimadoMin ?? ""} onChange={(e) => setEditar({ ...editar, tiempoEstimadoMin: e.target.value === "" ? null : Number(e.target.value) })} className={inputStyle} /></label>
        <button disabled={busy != null || !editar.nombre.trim()} className="rounded-xl bg-brand-500 px-4 py-2 font-bold text-white disabled:opacity-50">{busy ? "Guardando..." : "Guardar configuración"}</button>
      </form>
    </div>}
  </div>;
}
