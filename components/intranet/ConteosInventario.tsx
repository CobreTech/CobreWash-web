"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ClipboardCheck, Loader2, XCircle } from "lucide-react";
import { aprobarConteoInventario, rechazarConteoInventario, getConteosInventario, EstadoConteoInventario, type GetConteosInventarioData } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";
import { registrarError } from "@/lib/registro-seguro";

export default function ConteosInventario({ revision, alGuardar }: { revision: string; alGuardar: () => void }) {
  const [estado, setEstado] = useState<EstadoConteoInventario>(EstadoConteoInventario.PENDIENTE);
  const [pagina, setPagina] = useState(0);
  const [datos, setDatos] = useState<GetConteosInventarioData | null>(null);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const solicitud = useRef(0);
  const montado = useRef(true);
  const cargar = useCallback(async () => {
    const version = ++solicitud.current;
    try {
      const respuesta = await getConteosInventario(dataConnect, { estado, limit: 10, offset: pagina * 10 }, { fetchPolicy: "SERVER_ONLY" });
      if (montado.current && version === solicitud.current) {
        const total = respuesta.data.total[0]?._count ?? 0;
        if (pagina > 0 && pagina * 10 >= total) { setPagina(Math.max(0, Math.ceil(total / 10) - 1)); return; }
        setDatos(respuesta.data);
      }
    } catch (e) { registrarError("No se pudieron cargar los conteos", e); if (montado.current && version === solicitud.current) setError("No se pudieron cargar los conteos. Intenta nuevamente."); }
    finally { if (montado.current && version === solicitud.current) setCargando(false); }
  }, [estado, pagina]);
  useEffect(() => {
    montado.current = true;
    const peticiones = solicitud;
    void Promise.resolve().then(cargar);
    const refrescar = () => { if (document.visibilityState === "visible") void cargar(); };
    const timer = window.setInterval(refrescar, 30000);
    window.addEventListener("focus", refrescar);
    return () => { montado.current = false; ++peticiones.current; window.clearInterval(timer); window.removeEventListener("focus", refrescar); };
  }, [cargar, revision]);
  async function resolver(aprobar: boolean) {
    if (!seleccionado || !motivo.trim() || guardando) return;
    setGuardando(true); setError(""); setMensaje("");
    try {
      const variables = { id: seleccionado, motivo: motivo.trim() };
      if (aprobar) await aprobarConteoInventario(dataConnect, variables);
      else await rechazarConteoInventario(dataConnect, variables);
      setMensaje(aprobar ? "Conteo aprobado. El saldo y el historial se actualizaron." : "Conteo rechazado. El saldo se conserva.");
      setSeleccionado(null); setMotivo(""); alGuardar(); await cargar();
    } catch (e) {
      registrarError("No se pudo resolver el conteo", e);
      setError("No se pudo guardar la revisión. Si el stock cambió desde el conteo, solicita uno nuevo. Actualiza la lista antes de reintentar.");
      await cargar();
    } finally { setGuardando(false); }
  }
  const total = datos?.total[0]?._count ?? 0;
  return <section className="glass-panel overflow-hidden rounded-2xl" aria-label="Aprobación de conteos físicos">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 dark:border-white/5"><div className="flex items-center gap-3"><span className="rounded-xl bg-brand-500/10 p-2 text-brand-600"><ClipboardCheck className="h-5 w-5" /></span><div><h2 className="text-sm font-extrabold">Conteos físicos</h2><p className="mt-1 text-xs text-stone-500">Revisa las cantidades enviadas desde la app antes de ajustar el stock.</p></div></div><label className="text-xs font-semibold text-stone-500">Estado<select disabled={guardando} value={estado} onChange={e => { setEstado(e.target.value as EstadoConteoInventario); setPagina(0); setSeleccionado(null); setMotivo(""); setDatos(null); setCargando(true); setError(""); }} className="ml-2 rounded-xl border border-stone-200 bg-transparent px-3 py-2 dark:border-white/10">{Object.values(EstadoConteoInventario).map(e => <option key={e} value={e}>{e === "PENDIENTE" ? "Pendientes" : e === "APROBADO" ? "Aprobados" : "Rechazados"}</option>)}</select></label></div>
    {error && <p role="alert" className="px-5 py-3 text-sm text-red-600 dark:text-red-300">{error} <button onClick={() => { setError(""); void cargar(); }} className="font-bold underline">Actualizar lista</button></p>}
    {mensaje && <p role="status" className="px-5 py-3 text-sm text-green-700 dark:text-green-300">{mensaje}</p>}
    {cargando ? <p role="status" className="flex justify-center gap-2 p-8 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin" />Cargando conteos…</p> : <div className="divide-y divide-stone-100 dark:divide-white/5">{datos?.conteoInventarios.map(c => {
      const obsoleto = c.revisionStock !== c.insumo.revisionStock || !c.insumo.activo;
      const diferencia = c.cantidadContada - c.stockSistema;
      return <article key={c.id} className="space-y-3 px-5 py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-bold">{c.insumo.nombre}</h3><p className="mt-1 text-xs text-stone-500">{c.registradoPor.nombre} {c.registradoPor.apellido} · {new Date(c.creadoEn).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</p></div><span className="rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-bold text-brand-700 dark:text-brand-300">{c.estado}</span></div><div className="grid grid-cols-3 gap-3 rounded-xl bg-stone-100/70 p-3 text-xs dark:bg-white/5">{[["Stock al contar", c.stockSistema], ["Cantidad física", c.cantidadContada], ["Diferencia", diferencia]].map(([nombre, valor]) => <div key={nombre}><p className="text-stone-500">{nombre}</p><p className="mt-1 font-bold">{Number(valor).toLocaleString("es-CL")} {c.insumo.unidadMedida}</p></div>)}</div>
        {c.estado === "PENDIENTE" && obsoleto && <p className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">El insumo cambió después de este conteo o fue desactivado. Rechaza este registro y solicita un nuevo conteo; no se puede aprobar sobre un saldo distinto.</p>}
        {c.estado === "PENDIENTE" && (seleccionado === c.id ? <div className="space-y-3"><label className="block text-xs font-semibold text-stone-500">Motivo de la revisión<textarea value={motivo} disabled={guardando} maxLength={160} rows={2} onChange={e => setMotivo(e.target.value)} className="mt-2 block w-full resize-none rounded-xl border border-stone-200 bg-transparent p-3 text-sm dark:border-white/10" /></label><p className="text-xs text-stone-500">Al aprobar, el stock quedará en {c.cantidadContada.toLocaleString("es-CL")} {c.insumo.unidadMedida}. La decisión conservará tu identificación y la fecha.</p><div className="flex flex-wrap gap-2"><button disabled={guardando || !motivo.trim() || obsoleto} onClick={() => void resolver(true)} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"><CheckCircle2 className="h-4 w-4" />Aprobar y ajustar</button><button disabled={guardando || !motivo.trim()} onClick={() => void resolver(false)} className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-700 disabled:opacity-40 dark:border-red-500/20 dark:text-red-300"><XCircle className="h-4 w-4" />Rechazar</button><button disabled={guardando} onClick={() => { setSeleccionado(null); setMotivo(""); }} className="px-3 py-2 text-xs font-bold text-stone-500">Cancelar</button></div></div> : <button disabled={guardando} onClick={() => { setSeleccionado(c.id); setMotivo(""); }} className="rounded-xl border border-brand-200 bg-brand-500/5 px-4 py-2 text-xs font-bold text-brand-700 dark:border-brand-500/20 dark:text-brand-300">Revisar conteo</button>)}
        {c.motivoResolucion && <p className="text-xs text-stone-500">{c.motivoResolucion} · {c.resueltoPor?.nombre} {c.resueltoPor?.apellido}</p>}
      </article>;
    })}{!total && !error && <p className="p-8 text-center text-sm text-stone-500">No hay conteos en este estado.</p>}</div>}
    <div className="flex items-center justify-between gap-2 border-t border-stone-100 px-5 py-4 text-xs text-stone-500 dark:border-white/5"><span>{total} conteos · Página {pagina + 1} de {Math.max(1, Math.ceil(total / 10))}</span><div className="flex gap-2"><button disabled={guardando || cargando || pagina === 0} onClick={() => { setPagina(p => p - 1); setSeleccionado(null); setCargando(true); }} className="rounded-xl border border-stone-200 px-3 py-2 font-bold disabled:opacity-40 dark:border-white/10">Anterior</button><button disabled={guardando || cargando || (pagina + 1) * 10 >= total} onClick={() => { setPagina(p => p + 1); setSeleccionado(null); setCargando(true); }} className="rounded-xl border border-stone-200 px-3 py-2 font-bold disabled:opacity-40 dark:border-white/10">Siguiente</button></div></div>
  </section>;
}
