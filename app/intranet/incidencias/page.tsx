"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Eye, Loader2, Search, ShieldAlert, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import {
  actualizarEstadoIncidenciaMock,
  INCIDENCIAS_DEMO,
  INCIDENCIAS_EVENT,
  listarIncidenciasMock,
  type EstadoIncidencia,
  type IncidenciaMock,
} from "@/lib/mock/incidencias";

const ESTADO_LABEL: Record<EstadoIncidencia, string> = {
  ABIERTA: "Abierta",
  EN_REVISION: "En revisión",
  RESUELTA: "Resuelta",
};

const ESTADO_STYLE: Record<EstadoIncidencia, string> = {
  ABIERTA: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
  EN_REVISION: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  RESUELTA: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
};

function EstadoBadge({ estado }: { estado: EstadoIncidencia }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${ESTADO_STYLE[estado]}`}>{ESTADO_LABEL[estado]}</span>;
}

export default function IncidenciasPage() {
  const permitido = useRoleGuard(["admin", "recepcionista"]);
  const [incidencias, setIncidencias] = useState<IncidenciaMock[]>(INCIDENCIAS_DEMO);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoIncidencia | "TODAS">("TODAS");
  const [seleccionada, setSeleccionada] = useState<IncidenciaMock | null>(null);

  useEffect(() => {
    const cargar = () => setIncidencias(listarIncidenciasMock());
    cargar();
    window.addEventListener(INCIDENCIAS_EVENT, cargar);
    window.addEventListener("storage", cargar);
    return () => {
      window.removeEventListener(INCIDENCIAS_EVENT, cargar);
      window.removeEventListener("storage", cargar);
    };
  }, []);

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es-CL");
    return incidencias.filter((item) => (estado === "TODAS" || item.estado === estado)
      && (!termino || `${item.id} ${item.comandaId} ${item.cliente} ${item.motivo}`.toLocaleLowerCase("es-CL").includes(termino)));
  }, [busqueda, estado, incidencias]);

  const cambiarEstado = (nuevoEstado: EstadoIncidencia) => {
    if (!seleccionada) return;
    actualizarEstadoIncidenciaMock(seleccionada.id, nuevoEstado);
    setSeleccionada({ ...seleccionada, estado: nuevoEstado });
  };

  if (!permitido) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const abiertas = incidencias.filter((item) => item.estado === "ABIERTA").length;
  const revision = incidencias.filter((item) => item.estado === "EN_REVISION").length;
  const resueltas = incidencias.filter((item) => item.estado === "RESUELTA").length;

  return <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
    <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Control de producción · RF-SP11</p>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Incidencias de comandas</h1>
        <p className="mt-1 text-sm text-stone-500">Problemas reportados por operarios durante el proceso productivo.</p>
      </div>
      <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">Prototipo Sprint 4</span>
    </motion.header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Total registradas", value: incidencias.length, icon: ShieldAlert, tone: "text-brand-600 bg-brand-500/10" },
        { label: "Abiertas", value: abiertas, icon: AlertTriangle, tone: "text-red-600 bg-red-500/10" },
        { label: "En revisión", value: revision, icon: Clock3, tone: "text-amber-600 bg-amber-500/10" },
        { label: "Resueltas", value: resueltas, icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-500/10" },
      ].map((item, index) => <motion.article key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-stone-500">{item.label}</p><p className="mt-1 font-display text-2xl font-extrabold">{item.value}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl ${item.tone}`}><item.icon className="h-5 w-5" /></span></div>
      </motion.article>)}
    </section>

    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-stone-200/70 p-4 sm:flex-row dark:border-white/5">
        <label className="relative flex-1"><span className="sr-only">Buscar incidencia</span><Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" /><input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por comanda, cliente o motivo..." className="w-full rounded-xl border border-stone-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm focus:border-brand-500/50 focus:outline-none dark:border-white/10 dark:bg-white/5" /></label>
        <select value={estado} onChange={(event) => setEstado(event.target.value as EstadoIncidencia | "TODAS")} className="rounded-xl border border-stone-200 bg-white/70 px-3 py-2.5 text-sm font-semibold focus:border-brand-500/50 focus:outline-none dark:border-white/10 dark:bg-stone-900">
          <option value="TODAS">Todos los estados</option><option value="ABIERTA">Abiertas</option><option value="EN_REVISION">En revisión</option><option value="RESUELTA">Resueltas</option>
        </select>
      </div>

      <div className="hidden grid-cols-[0.65fr_1fr_1.4fr_1fr_0.8fr_44px] gap-4 border-b border-stone-200/70 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 lg:grid dark:border-white/5">
        <span>Incidencia</span><span>Comanda</span><span>Cliente / motivo</span><span>Registrada</span><span>Estado</span><span />
      </div>
      <div className="divide-y divide-stone-200/70 dark:divide-white/5">
        {visibles.map((item, index) => <motion.article key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="grid gap-3 p-4 transition-colors hover:bg-brand-50/40 lg:grid-cols-[0.65fr_1fr_1.4fr_1fr_0.8fr_44px] lg:items-center lg:gap-4 lg:px-5 dark:hover:bg-brand-500/5">
          <div><span className="text-[10px] font-bold uppercase text-stone-400 lg:hidden">Incidencia</span><p className="font-bold">{item.id}</p></div>
          <div><span className="text-[10px] font-bold uppercase text-stone-400 lg:hidden">Comanda</span><p className="font-semibold text-brand-600 dark:text-brand-400">{item.comandaId}</p></div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{item.cliente}</p><p className="truncate text-xs text-stone-500">{item.motivo}</p></div>
          <div><p className="text-xs font-semibold">{new Date(item.fecha).toLocaleDateString("es-CL")}</p><p className="text-xs text-stone-500">{new Date(item.fecha).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} · {item.registradaPor}</p></div>
          <div><EstadoBadge estado={item.estado} /></div>
          <button onClick={() => setSeleccionada(item)} aria-label={`Ver ${item.id}`} className="grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-brand-500 hover:text-white dark:bg-white/5"><Eye className="h-4 w-4" /></button>
        </motion.article>)}
        {!visibles.length && <div className="p-12 text-center"><ShieldAlert className="mx-auto mb-3 h-8 w-8 text-stone-300" /><p className="text-sm font-semibold">No hay incidencias que coincidan con el filtro.</p></div>}
      </div>
    </section>

    <AnimatePresence>
      {seleccionada && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="incidencia-titulo" className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-sm">
        <motion.section initial={{ opacity: 0, scale: 0.96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="glass-modal relative w-full max-w-lg rounded-3xl bg-white p-6 dark:bg-stone-900">
          <button onClick={() => setSeleccionada(null)} aria-label="Cerrar detalle" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 dark:bg-white/5"><X className="h-4 w-4" /></button>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">{seleccionada.id} · {seleccionada.comandaId}</p>
          <h2 id="incidencia-titulo" className="mt-1 pr-12 font-display text-2xl font-extrabold">{seleccionada.motivo}</h2>
          <div className="mt-5 grid gap-3 rounded-2xl bg-stone-50 p-4 text-sm sm:grid-cols-2 dark:bg-white/5"><div><p className="text-xs text-stone-400">Cliente</p><p className="font-semibold">{seleccionada.cliente}</p></div><div><p className="text-xs text-stone-400">Reportada por</p><p className="font-semibold">{seleccionada.registradaPor}</p></div></div>
          <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Descripción</p><p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{seleccionada.descripcion || "Sin descripción adicional."}</p></div>
          <div className="mt-6"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">Actualizar seguimiento</p><div className="grid gap-2 sm:grid-cols-3">{(["ABIERTA", "EN_REVISION", "RESUELTA"] as EstadoIncidencia[]).map((opcion) => <button key={opcion} onClick={() => cambiarEstado(opcion)} className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${seleccionada.estado === opcion ? ESTADO_STYLE[opcion] : "border-stone-200 text-stone-500 hover:border-brand-300 dark:border-white/10"}`}>{ESTADO_LABEL[opcion]}</button>)}</div></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
