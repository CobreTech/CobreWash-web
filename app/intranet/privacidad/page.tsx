"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { auth } from "@/lib/firebase/client";
import { ShieldCheck, RefreshCw, AlertCircle, Clock3, FileText, Save, Inbox, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import GlassSelect from "@/components/ui/GlassSelect";
import { ETIQUETAS_DERECHOS, type Derecho } from "@/lib/privacidad/modelo";
type Actuacion = { id: string; estado: string; nota: string; evidenciaIdentidad: string; evidenciaEnvio: string; creadoEn: string; actor: { nombre: string } };
type Solicitud = { id: string; nombre: string; email: string; derecho: Derecho; detalle: string; estado: string; revision: number; creadoEn: string; objetivoAtencion: string; actuacionDerechos_on_solicitud: Actuacion[] };
type Bandeja = { solicitudDerechos: Solicitud[]; total: { _count: number }[] };
const campoInterno = "mt-2 block w-full rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-sm font-medium normal-case tracking-normal text-stone-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-stone-100";
const etiquetaInterna = "block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400";
const estados: Record<string, string> = { RECIBIDA: "Recibida", VERIFICACION: "Verificando identidad", EN_GESTION: "En gestión", RESPONDIDA: "Respondida" };
export default function GestionPrivacidadPage() {
  const permitido = useRoleGuard(["admin"]); const [pagina, setPagina] = useState(0);
  const usuarioId = useUsuarioActualContext()?.id;
  const [respondidas, setRespondidas] = useState(false);
  const [datos, setDatos] = useState<Bandeja | null>(null); const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false); const generacion = useRef(0);
  const cargar = useCallback(async () => {
    if (!permitido || !usuarioId) return; const g = ++generacion.current; const user = auth.currentUser;
    setOcupado(true); setError("");
    try {
      if (!user) throw new Error("Inicia sesión.");
      const r = await fetch(`/api/privacidad/gestion?pagina=${pagina}&respondidas=${respondidas ? 1 : 0}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: "no-store" });
      const d = await r.json(); if (!r.ok) throw new Error(d.error);
      if (g === generacion.current && auth.currentUser?.uid === user.uid) setDatos(d);
    } catch (e) { if (g === generacion.current) setError((e as Error).message); }
    finally { if (g === generacion.current) setOcupado(false); }
  }, [pagina, permitido, usuarioId, respondidas]);
  const invalidar = useCallback(() => { generacion.current++; }, []);
  useEffect(() => { const timer = setTimeout(() => { setDatos(null); void cargar(); }, 0); return () => { clearTimeout(timer); invalidar(); }; }, [cargar, invalidar]);
  if (!permitido) return <p className="flex items-center gap-2 p-6 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin" />Cargando…</p>;
  return <main className="space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
    <header className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="rounded-2xl bg-gradient-brand p-3 text-white shadow-premium"><ShieldCheck className="h-6 w-6" /></span><div><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Administración · Privacidad</p><h1 className="font-display text-2xl font-extrabold">Solicitudes de datos personales</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">Acceso reservado a administración. Verifica identidad y representación con medios proporcionales. No solicites copias de cédulas por defecto.</p></div></div><button disabled={ocupado} onClick={() => void cargar()} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-brand-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"><RefreshCw className={ocupado ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Actualizar</button></header>
    <div className="flex items-start gap-3 rounded-2xl border border-copper-200 bg-copper-50/80 p-4 text-xs leading-relaxed text-copper-900 dark:border-copper-500/20 dark:bg-copper-500/10 dark:text-copper-200"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><p>Bloqueo: atención urgente y suspensión del tratamiento afectado cuando corresponda. Esta bandeja registra la gestión; no ejecuta por sí sola bloqueos, exportaciones ni borrados. Los objetivos de 24/48 horas son internos y no amplían los plazos legales.</p></div>
    <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4"><label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-stone-600 dark:text-stone-300"><input type="checkbox" className="h-4 w-4 accent-brand-600" checked={respondidas} onChange={e => { setRespondidas(e.target.checked); setPagina(0); }} />Ver respondidas</label><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">{datos?.total[0]?._count ?? 0} solicitudes</span></div>
    {error && <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
    {ocupado && !datos && <p role="status" className="flex items-center gap-2 p-4 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin" />Cargando solicitudes…</p>}
    {datos?.solicitudDerechos.map(s => <article key={`${s.id}-${s.revision}`} className="glass-panel space-y-5 rounded-2xl p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-display text-lg font-extrabold"><FileText className="h-5 w-5 text-brand-500" />{ETIQUETAS_DERECHOS[s.derecho]}</h2><span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400">{estados[s.estado] || s.estado}</span></div><p className="break-words text-sm font-semibold">{s.nombre} <span className="font-normal text-stone-500 dark:text-stone-400">· {s.email}</span></p><p className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400"><Clock3 className="h-4 w-4" />Ingreso: {new Date(s.creadoEn).toLocaleString("es-CL")} · Objetivo interno: {new Date(s.objetivoAtencion).toLocaleString("es-CL")}</p><p className="whitespace-pre-wrap break-words rounded-xl bg-stone-50/80 p-4 text-sm leading-relaxed text-stone-600 dark:bg-white/5 dark:text-stone-300">{s.detalle || "Sin detalle adicional."}</p>
      <details className="rounded-xl border border-stone-200 p-4 dark:border-white/10"><summary className="cursor-pointer text-xs font-bold text-brand-700 dark:text-brand-400">Historial de actuaciones ({s.actuacionDerechos_on_solicitud.length})</summary>{s.actuacionDerechos_on_solicitud.map(a => <div key={a.id} className="mt-4 space-y-2 border-l-2 border-brand-200 pl-4 text-xs leading-relaxed text-stone-600 dark:border-brand-500/20 dark:text-stone-400"><p>{new Date(a.creadoEn).toLocaleString("es-CL")} · {a.actor.nombre} · {estados[a.estado] || a.estado}</p><p className="whitespace-pre-wrap">{a.nota}</p><p>Verificación: {a.evidenciaIdentidad || "Pendiente"}</p><p>Envío: {a.evidenciaEnvio || "Pendiente"}</p></div>)}</details>
      {s.estado !== "RESPONDIDA" && <FormularioActuacion ocupado={ocupado} onSubmit={async e => {
        e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); const user = auth.currentUser; setOcupado(true); setError("");
        try {
          if (!user) throw new Error("Inicia sesión.");
          const r = await fetch(`/api/privacidad/gestion/${s.id}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify({ estado: f.get("estado"), nota: f.get("nota"), evidenciaIdentidad: f.get("identidad"), evidenciaEnvio: f.get("envio"), revision: s.revision }) });
          const d = await r.json(); if (!r.ok) throw new Error(d.error); await cargar();
        } catch (e) { setError((e as Error).message); } finally { setOcupado(false); }
      }} />}
    </article>)}
    {datos?.solicitudDerechos.length === 0 && <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl px-6 py-12 text-center"><span className="rounded-2xl bg-brand-50 p-4 text-brand-500 dark:bg-brand-500/10"><Inbox className="h-7 w-7" /></span><p className="font-display text-lg font-bold">No hay solicitudes {respondidas ? "respondidas" : "pendientes"}</p><p className="text-sm text-stone-500">Las solicitudes recibidas aparecerán aquí.</p></div>}
    <nav aria-label="Páginas de solicitudes de datos" className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-500 dark:text-stone-400"><button className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 transition-colors hover:bg-brand-50 disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5" disabled={ocupado || pagina === 0} onClick={() => setPagina(p => p - 1)}><ChevronLeft className="h-4 w-4" />Anterior</button><span>Página {pagina + 1}</span><button className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 transition-colors hover:bg-brand-50 disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5" disabled={ocupado || !datos || (pagina + 1) * 20 >= (datos.total[0]?._count || 0)} onClick={() => setPagina(p => p + 1)}>Siguiente<ChevronRight className="h-4 w-4" /></button></nav>
  </main>;
}

function FormularioActuacion({ ocupado, onSubmit }: { ocupado: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  const [estado, setEstado] = useState("VERIFICACION");
  return <form className="space-y-4 border-t border-stone-200 pt-5 dark:border-white/10" onSubmit={onSubmit}>
    <input type="hidden" name="estado" value={estado} />
    <div className="max-w-sm space-y-2"><p className={etiquetaInterna}>Nueva actuación</p><GlassSelect ariaLabel="Nueva actuación" value={estado} onChange={setEstado} disabled={ocupado} options={[{ value: "VERIFICACION", label: "Verificando identidad" }, { value: "EN_GESTION", label: "En gestión" }, { value: "RESPONDIDA", label: "Respuesta enviada" }]} /></div>
    <label className={etiquetaInterna}>Actuación o respuesta fundada<textarea name="nota" required maxLength={4000} rows={3} className={campoInterno} /></label>
    <div className="grid gap-4 lg:grid-cols-2"><label className={etiquetaInterna}>Cómo se verificó identidad y representación<input name="identidad" maxLength={500} className={campoInterno} /></label><label className={etiquetaInterna}>Evidencia de envío, fecha y referencia del canal<input name="envio" maxLength={500} className={campoInterno} /></label></div>
    <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">Para cerrar, documenta la verificación y el envío real de la respuesta. No pegues contraseñas, tokens ni documentos de identidad. Si rechazas total o parcialmente, indica fundamento y vía de reclamación aplicable.</p>
    <button disabled={ocupado} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-bold text-white shadow-premium transition-shadow hover:shadow-lg disabled:opacity-50"><Save className="h-4 w-4" />Guardar actuación</button>
  </form>;
}
