"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock3, Loader2, Package, RefreshCw, Search, ShieldAlert, Users } from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { dataConnect } from "@/lib/firebase/client";
import { ComandaEstado, getPanelProduccion, type GetPanelProduccionData } from "@/src/dataconnect-generated";
import { estaEtapaAtrasada, minutosExcedidos } from "@/lib/produccion/alertas";

type ComandaPanel = GetPanelProduccionData["comandas"][number];
type EstadoFiltro = "TODAS" | ComandaEstado;

const ESTADO_LABEL: Record<ComandaEstado, string> = {
  PENDIENTE: "Pendiente", EN_PROCESO: "En proceso", FINALIZADA: "Lista",
  ENTREGADA: "Entregada", ANULADA: "Anulada",
};

function etapaActual(comanda: ComandaPanel) {
  return comanda.comandaEtapas_on_comanda.find((etapa) => etapa.estado !== "COMPLETADA") ?? null;
}

function estaAtrasada(comanda: ComandaPanel, ahora: number) {
  const etapa = etapaActual(comanda);
  if (!etapa) return false;
  return estaEtapaAtrasada({
    estado: etapa.estado, orden: etapa.ordenEtapa ?? etapa.etapa.orden,
    fechaInicio: etapa.fechaInicio, fechaRecepcion: comanda.fechaRecepcion,
    tiempoEstimadoMin: etapa.tiempoEstimadoMin ?? etapa.etapa.tiempoEstimadoMin,
  }, ahora);
}

function tiempoExcedido(comanda: ComandaPanel, ahora: number) {
  const etapa = etapaActual(comanda);
  if (!etapa) return 0;
  return minutosExcedidos({
    estado: etapa.estado, orden: etapa.ordenEtapa ?? etapa.etapa.orden,
    fechaInicio: etapa.fechaInicio, fechaRecepcion: comanda.fechaRecepcion,
    tiempoEstimadoMin: etapa.tiempoEstimadoMin ?? etapa.etapa.tiempoEstimadoMin,
  }, ahora);
}

export default function DashboardPage() {
  const permitido = useRoleGuard(["admin"]);
  const [data, setData] = useState<GetPanelProduccionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoFiltro>("TODAS");
  const [etapa, setEtapa] = useState("TODAS");
  const [ahora, setAhora] = useState(() => Date.now());

  const cargar = useCallback(async (silencioso = false) => {
    if (!permitido) return;
    if (!silencioso) setLoading(true);
    try {
      const result = await getPanelProduccion(dataConnect, { limit: 100 }, { fetchPolicy: "SERVER_ONLY" });
      setData(result.data); setAhora(Date.now()); setError("");
    } catch {
      if (!silencioso) setError("No se pudo cargar el panel de producción.");
    } finally { if (!silencioso) setLoading(false); }
  }, [permitido]);

  useEffect(() => {
    void Promise.resolve().then(() => cargar());
    const refrescar = () => { if (document.visibilityState === "visible") void cargar(true); };
    const interval = window.setInterval(refrescar, 10_000);
    window.addEventListener("focus", refrescar);
    return () => { window.clearInterval(interval); window.removeEventListener("focus", refrescar); };
  }, [cargar]);

  const comandas = useMemo(() => data?.comandas ?? [], [data]);
  const atrasadas = comandas.filter((comanda) => estaAtrasada(comanda, ahora));
  const incidencias = comandas.reduce((total, comanda) => total + comanda.incidenciaComandas_on_comanda.length, 0);
  const etapas = useMemo(() => Array.from(new Set(comandas.map((comanda) => etapaActual(comanda)?.nombreEtapa ?? etapaActual(comanda)?.etapa.nombre).filter(Boolean))) as string[], [comandas]);
  const visibles = useMemo(() => {
    const term = busqueda.trim().toLocaleLowerCase("es-CL");
    return comandas.filter((comanda) => {
      const actual = etapaActual(comanda);
      const nombreEtapa = actual?.nombreEtapa ?? actual?.etapa.nombre ?? "";
      return (estado === "TODAS" || comanda.estado === estado)
        && (etapa === "TODAS" || nombreEtapa === etapa)
        && (!term || `${comanda.numeroComanda} ${comanda.cliente.nombre}`.toLocaleLowerCase("es-CL").includes(term));
    });
  }, [busqueda, comandas, estado, etapa]);

  if (!permitido || loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-brand-500" /></div>;

  const pendientes = data?.pendientes[0]?._count ?? 0;
  const enProceso = data?.enProceso[0]?._count ?? 0;
  const listas = data?.listas[0]?._count ?? 0;
  const total = pendientes + enProceso + listas;

  return <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">RF20–RF22 · Datos reales</p><h1 className="font-display text-2xl font-extrabold sm:text-3xl">Panel de producción</h1><p className="mt-1 text-sm text-stone-500">Vista global actualizada automáticamente cada 10 segundos.</p></div><button onClick={() => void cargar()} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-bold text-white"><RefreshCw className="h-4 w-4" />Actualizar ahora</button></header>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</p>}

    <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">{[
      { label: "Producción activa", value: total, icon: Package, tone: "text-brand-600 bg-brand-500/10" },
      { label: "Pendientes", value: pendientes, icon: Clock3, tone: "text-amber-600 bg-amber-500/10" },
      { label: "En proceso", value: enProceso, icon: Users, tone: "text-sky-600 bg-sky-500/10" },
      { label: "Listas", value: listas, icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-500/10" },
      { label: "Con atraso", value: atrasadas.length, icon: AlertTriangle, tone: "text-red-600 bg-red-500/10" },
    ].map((card, index) => <motion.article key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="glass-panel rounded-2xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-stone-500">{card.label}</p><p className="mt-1 text-3xl font-extrabold">{card.value}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl ${card.tone}`}><card.icon className="h-5 w-5" /></span></div></motion.article>)}</section>

    {(atrasadas.length > 0 || incidencias > 0) && <section className="grid gap-3 lg:grid-cols-2">{atrasadas.length > 0 && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"><div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300"><AlertTriangle className="h-5 w-5" />Alertas de tiempo excedido</div><div className="mt-3 space-y-2">{atrasadas.slice(0, 5).map((comanda) => <p key={comanda.id} className="text-sm text-red-700/90 dark:text-red-200"><strong>{comanda.numeroComanda}</strong> · {etapaActual(comanda)?.nombreEtapa ?? etapaActual(comanda)?.etapa.nombre} · excedida por {tiempoExcedido(comanda, ahora)} min</p>)}</div></div>}{incidencias > 0 && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10"><div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300"><ShieldAlert className="h-5 w-5" />{incidencias} incidencia{incidencias === 1 ? "" : "s"} abierta{incidencias === 1 ? "" : "s"}</div><p className="mt-2 text-sm text-amber-700/80 dark:text-amber-200">Revisa el módulo de incidencias para realizar seguimiento.</p></div>}</section>}

    <section className="glass-panel rounded-2xl p-4"><h2 className="text-sm font-extrabold">Distribución por etapa actual</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{etapas.map((nombre) => { const cantidad = comandas.filter((comanda) => (etapaActual(comanda)?.nombreEtapa ?? etapaActual(comanda)?.etapa.nombre) === nombre).length; const porcentaje = total ? Math.round(cantidad / total * 100) : 0; return <div key={nombre} className="rounded-xl bg-stone-50 p-3 dark:bg-white/5"><div className="flex justify-between text-xs"><span className="font-bold">{nombre}</span><span>{cantidad}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"><div className="h-full rounded-full bg-brand-500" style={{ width: `${porcentaje}%` }} /></div></div>; })}</div></section>

    <section className="glass-panel overflow-hidden rounded-2xl"><div className="flex flex-col gap-3 border-b border-stone-200 p-4 lg:flex-row dark:border-white/5"><label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" /><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar comanda o cliente..." className="w-full rounded-xl border border-stone-200 bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 dark:border-white/10" /></label><select value={estado} onChange={(e) => setEstado(e.target.value as EstadoFiltro)} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-stone-900"><option value="TODAS">Todos los estados</option><option value={ComandaEstado.PENDIENTE}>Pendientes</option><option value={ComandaEstado.EN_PROCESO}>En proceso</option><option value={ComandaEstado.FINALIZADA}>Listas</option></select><select value={etapa} onChange={(e) => setEtapa(e.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-stone-900"><option value="TODAS">Todas las etapas</option>{etapas.map((nombre) => <option key={nombre}>{nombre}</option>)}</select></div>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-stone-200 text-left text-[10px] uppercase tracking-wider text-stone-400 dark:border-white/5">{["Comanda", "Cliente", "Prendas", "Estado", "Etapa actual", "Responsable", "Alertas", "Último cambio"].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>)}</tr></thead><tbody>{visibles.map((comanda) => { const actual = etapaActual(comanda); const atrasada = estaAtrasada(comanda, ahora); return <tr key={comanda.id} className="border-b border-stone-100 last:border-0 dark:border-white/5"><td className="px-4 py-3 font-bold text-brand-600 dark:text-brand-400">{comanda.numeroComanda}</td><td className="px-4 py-3 font-semibold">{comanda.cliente.nombre}</td><td className="px-4 py-3">{comanda.comandaDetalles_on_comanda.reduce((sum, detalle) => sum + detalle.cantidad, 0)}</td><td className="px-4 py-3">{ESTADO_LABEL[comanda.estado]}</td><td className="px-4 py-3">{actual?.nombreEtapa ?? actual?.etapa.nombre ?? "Flujo completado"}</td><td className="px-4 py-3 text-stone-500">{actual?.asignadoA ? `${actual.asignadoA.nombre} ${actual.asignadoA.apellido ?? ""}`.trim() : "Sin asignar"}</td><td className="px-4 py-3"><div className="flex gap-1">{atrasada && <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-600">Atrasada</span>}{comanda.incidenciaComandas_on_comanda.length > 0 && <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-600">{comanda.incidenciaComandas_on_comanda.length} incidencia(s)</span>}</div></td><td className="whitespace-nowrap px-4 py-3 text-xs text-stone-400">{new Date(comanda.actualizadoEn).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}</td></tr>; })}</tbody></table></div>{!visibles.length && <p className="p-10 text-center text-sm text-stone-500">No hay comandas que coincidan con los filtros.</p>}</section>
  </div>;
}
