"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { dataConnect } from "@/lib/firebase/client";
import { actualizarEstadoSolicitudContacto, getSolicitudesContacto, SolicitudContactoEstado, type GetSolicitudesContactoData } from "@/src/dataconnect-generated";
import { fechaSeguimiento } from "@/lib/seguimiento/publico";

const etiquetas: Record<SolicitudContactoEstado, string> = { RECIBIDA: "Recibida", EN_REVISION: "En revisión", ATENDIDA: "Atendida" };
export default function SolicitudesPage() {
  const permitido = useRoleGuard(["admin", "recepcionista"]);
  const [datos, setDatos] = useState<GetSolicitudesContactoData | null>(null);
  const [estado, setEstado] = useState<SolicitudContactoEstado | null>(null);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState<string | null>(null);
  const [error, setError] = useState("");
  const version = useRef(0);
  const cargar = useCallback(async () => {
    if (!permitido) return;
    const solicitud = ++version.current;
    setCargando(true); setError("");
    try {
      const result = await getSolicitudesContacto(dataConnect, { estado, offset: pagina * 20, limit: 20 }, { fetchPolicy: "SERVER_ONLY" });
      if (solicitud === version.current) setDatos(result.data);
    } catch { if (solicitud === version.current) setError("No se pudo cargar la bandeja. Intenta nuevamente."); }
    finally { if (solicitud === version.current) setCargando(false); }
  }, [estado, pagina, permitido]);
  const invalidar = useCallback(() => { version.current++; }, []);
  useEffect(() => { const timer = setTimeout(() => { setDatos(null); void cargar(); }, 0); return () => { clearTimeout(timer); invalidar(); }; }, [cargar, invalidar]);
  if (!permitido) return <p className="p-6">Cargando…</p>;
  const total = datos?.total[0]?._count ?? 0;
  return <main className="space-y-5 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
    <header><h1 className="font-display text-2xl font-extrabold">Solicitudes de cotización</h1><p className="mt-2 text-sm text-stone-500">Solicitudes recibidas desde el sitio web. El contacto se gestiona desde esta bandeja.</p></header>
    <div className="flex flex-wrap items-center gap-3"><label className="text-sm">Estado<select value={estado ?? ""} onChange={e => { setPagina(0); setEstado((e.target.value || null) as SolicitudContactoEstado | null); }} className="ml-2 rounded-xl border border-stone-300 bg-transparent p-2"><option value="">Todas</option>{Object.entries(etiquetas).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button disabled={cargando} onClick={() => void cargar()} className="text-sm font-bold text-brand-600 underline">Actualizar</button><span className="text-sm">{total} solicitudes</span></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
    {cargando && <p role="status">Cargando solicitudes…</p>}
    {!cargando && datos?.solicitudContactos.length === 0 && <p>No hay solicitudes en este estado.</p>}
    <div className="space-y-3">{datos?.solicitudContactos.map(s => <article key={s.id} className="glass-panel space-y-3 rounded-2xl p-5">
      <div className="flex flex-wrap justify-between gap-3"><h2 className="font-bold">{s.nombre}</h2><span className="text-xs text-stone-500">{fechaSeguimiento(s.creadoEn)}</span></div>
      <p className="text-sm">Servicio: {s.servicio}</p><p className="whitespace-pre-wrap break-words text-sm">{s.mensaje}</p>
      <div className="flex flex-wrap gap-4 text-sm"><a className="text-brand-600 underline" href={`mailto:${encodeURIComponent(s.email)}`}>{s.email}</a><a className="text-brand-600 underline" href={`tel:${s.telefono.replace(/[^+\d]/g, "")}`}>{s.telefono}</a></div>
      <label className="block text-sm">Seguimiento<select aria-label={`Estado de solicitud de ${s.nombre}`} disabled={guardando !== null} value={s.estado} className="ml-2 rounded-xl border border-stone-300 bg-transparent p-2" onChange={async e => {
        const nuevo = e.target.value as SolicitudContactoEstado; setGuardando(s.id); setError("");
        try { await actualizarEstadoSolicitudContacto(dataConnect, { id: s.id, estado: nuevo }); await cargar(); }
        catch { setError("No se pudo guardar el estado. Reintenta."); }
        finally { setGuardando(null); }
      }}>{Object.entries(etiquetas).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </article>)}</div>
    <nav aria-label="Páginas de solicitudes" className="flex gap-4 text-sm"><button disabled={cargando || pagina === 0} onClick={() => setPagina(p => p - 1)}>Anterior</button><span>Página {pagina + 1}</span><button disabled={cargando || (pagina + 1) * 20 >= total} onClick={() => setPagina(p => p + 1)}>Siguiente</button></nav>
  </main>;
}
