"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  UserCog,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import {
  COMANDAS,
  ETAPAS,
  progreso,
  estaEstancada,
  UMBRAL_ESTANCADA,
  OPERARIO_DEMO,
  type Comanda,
} from "@/lib/mock/comandas";

const OPERARIOS = ["Carlos Herrera", "Diego Rojas", "Fernanda Muñoz", "Sin asignar"];

const activa = (c: Comanda) => c.estado === "En proceso" || c.estado === "Pendiente";

export default function SeguimientoPage() {
  const permitido = useRoleGuard(["admin", "recepcionista", "operario"]);
  const usuario = useUsuarioActualContext();
  const esOperario = usuario?.rol.nombre === "operario";

  const [comandas, setComandas] = useState<Comanda[]>(COMANDAS);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reasignar, setReasignar] = useState<Comanda | null>(null);

  // Operario: solo sus comandas asignadas y activas. Admin: todas las activas.
  const visibles = useMemo(() => {
    const base = comandas.filter(activa);
    const scoped = esOperario ? base.filter((c) => c.operario === OPERARIO_DEMO) : base;
    const term = search.toLowerCase();
    return scoped.filter(
      (c) => c.id.toLowerCase().includes(term) || c.cliente.toLowerCase().includes(term),
    );
  }, [comandas, esOperario, search]);

  const estancadas = useMemo(
    () => comandas.filter((c) => activa(c) && estaEstancada(c) && (!esOperario || c.operario === OPERARIO_DEMO)),
    [comandas, esOperario],
  );

  // Panel de estado global (solo admin): conteo por etapa.
  const porEtapa = useMemo(
    () =>
      ETAPAS.map((etapa, i) => ({
        etapa,
        count: comandas.filter((c) => c.estado === "En proceso" && c.etapaActual === i).length,
      })),
    [comandas],
  );

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  const avanzarEtapa = (c: Comanda) => {
    setComandas((prev) =>
      prev.map((x) => {
        if (x.id !== c.id) return x;
        if (x.estado === "Pendiente") return { ...x, estado: "En proceso", etapaActual: 0, horasEnEtapa: 0 };
        const idx = x.etapaActual ?? 0;
        if (idx >= ETAPAS.length - 1) return { ...x, estado: "Entregado", etapaActual: 5, horasEnEtapa: 0 };
        return { ...x, etapaActual: idx + 1, horasEnEtapa: 0 };
      }),
    );
  };

  const aplicarReasignacion = (nuevo: string) => {
    if (!reasignar) return;
    setComandas((prev) =>
      prev.map((x) => (x.id === reasignar.id ? { ...x, operario: nuevo === "Sin asignar" ? undefined : nuevo } : x)),
    );
    setReasignar(null);
  };

  const labelAvance = (c: Comanda) => {
    if (c.estado === "Pendiente") return `Iniciar ${ETAPAS[0]}`;
    const idx = c.etapaActual ?? 0;
    if (idx >= ETAPAS.length - 1) return "Marcar entregado";
    return `Avanzar a ${ETAPAS[idx + 1]}`;
  };

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">
            {esOperario ? "Mis Tareas" : "Seguimiento de Producción"}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {esOperario
              ? `${visibles.length} comandas asignadas a ti`
              : `${visibles.length} comandas activas en producción`}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition-all self-start sm:self-auto shadow-sm dark:shadow-none cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </motion.div>

      {/* Panel de estado global (solo admin) */}
      {!esOperario && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 mb-4">
            Estado global de producción
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            {porEtapa.map((e, i) => (
              <div key={e.etapa} className="flex items-center gap-1 sm:gap-2 flex-1">
                <div className="flex-1 bg-stone-50 dark:bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-display font-extrabold text-brand-600 dark:text-brand-400">{e.count}</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-500 mt-0.5">{e.etapa}</p>
                </div>
                {i < porEtapa.length - 1 && <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-700 shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Alertas por etapa estancada */}
      {estancadas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-amber-800 dark:text-amber-300 text-sm font-bold">
                {estancadas.length} comanda{estancadas.length > 1 ? "s" : ""} estancada{estancadas.length > 1 ? "s" : ""} (más de {UMBRAL_ESTANCADA}h en la misma etapa)
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {estancadas.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setExpanded(c.id)}
                    className="text-[11px] font-bold bg-white dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 px-2.5 py-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-500/25 transition-colors cursor-pointer"
                  >
                    {c.id} · {ETAPAS[c.etapaActual ?? 0]} · {c.horasEnEtapa}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative max-w-sm">
        <input
          type="text"
          placeholder="Buscar comanda o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 glass-panel rounded-xl text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/50 transition-colors shadow-sm dark:shadow-none"
        />
        <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </motion.div>

      {/* Orders */}
      <div className="space-y-3">
        <AnimatePresence>
          {visibles.map((c, i) => {
            const pct = progreso(c);
            const isOpen = expanded === c.id;
            const etapaActualNombre = c.estado === "Pendiente" ? "En espera" : ETAPAS[c.etapaActual ?? 0];
            const stuck = estaEstancada(c);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white dark:bg-stone-900 border rounded-2xl overflow-hidden transition-colors shadow-sm dark:shadow-none ${
                  stuck ? "border-amber-300 dark:border-amber-500/30" : "border-stone-200 dark:border-white/5 hover:border-brand-300 dark:hover:border-brand-500/15"
                }`}
              >
                <button onClick={() => setExpanded(isOpen ? null : c.id)} className="w-full flex items-center gap-4 p-5 text-left cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-stone-900 dark:text-white font-bold text-sm">{c.id}</span>
                      <span className="text-stone-400 dark:text-stone-600 text-xs">·</span>
                      <span className="text-stone-500 dark:text-stone-400 text-xs">{c.servicio}</span>
                      <span className="text-[10px] bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-300 dark:border-brand-500/20 px-2 py-0.5 rounded-full font-bold">
                        {etapaActualNombre}
                      </span>
                      {stuck && (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {c.horasEnEtapa}h
                        </span>
                      )}
                    </div>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-0.5">{c.cliente} · {c.detalle.reduce((s, d) => s + d.cantidad, 0)} prendas{!esOperario && c.operario ? ` · ${c.operario}` : ""}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">{pct}%</span>
                    <div className="w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-brand rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }} />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-stone-100 dark:border-white/5">
                        {/* 5-stage timeline */}
                        <div className="space-y-4 relative pl-6 py-4 before:absolute before:left-2.5 before:top-6 before:bottom-6 before:w-px before:bg-stone-200 dark:before:bg-stone-700">
                          {ETAPAS.map((etapa, si) => {
                            const idx = c.etapaActual ?? -1;
                            const done = c.estado === "Entregado" || idx > si;
                            const active = c.estado === "En proceso" && idx === si;
                            return (
                              <div key={etapa} className="relative flex justify-between items-center">
                                <div className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "bg-brand-500 border-brand-500 scale-110" : done ? "bg-green-500 border-green-500" : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-600"}`}>
                                  {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  {active && <div className="w-2 h-2 rounded-full bg-white animate-ping absolute" />}
                                </div>
                                <p className={`text-sm font-semibold ${active ? "text-brand-600 dark:text-brand-400" : done ? "text-stone-700 dark:text-stone-200" : "text-stone-400 dark:text-stone-600"}`}>
                                  {etapa}
                                </p>
                                {active && <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full">En curso</span>}
                                {done && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-100 dark:border-white/5">
                          {esOperario ? (
                            /* Operario: marcar avance de etapa */
                            <button
                              onClick={() => avanzarEtapa(c)}
                              className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all cursor-pointer"
                            >
                              <ArrowRight className="w-4 h-4" />
                              {labelAvance(c)}
                            </button>
                          ) : (
                            /* Admin: reasignar comanda */
                            <button
                              onClick={() => setReasignar(c)}
                              className="flex items-center gap-2 bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-white/10 transition-all cursor-pointer"
                            >
                              <UserCog className="w-4 h-4" />
                              Reasignar {c.operario ? `(${c.operario})` : ""}
                            </button>
                          )}
                          <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-600 px-2">
                            <Clock className="w-3.5 h-3.5" /> Ingreso: {c.fechaRecepcion}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibles.length === 0 && (
          <div className="text-center py-16 text-stone-400 dark:text-stone-600 text-sm">
            {esOperario ? "No tienes comandas asignadas por ahora." : "No hay comandas activas."}
          </div>
        )}
      </div>

      {/* Reasignar modal (admin) */}
      <AnimatePresence>
        {reasignar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReasignar(null)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="glass-panel rounded-3xl p-6 w-full max-w-sm relative z-10">
              <button onClick={() => setReasignar(null)} className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="font-extrabold text-stone-900 dark:text-white mb-1">Reasignar {reasignar.id}</h3>
              <p className="text-xs text-stone-500 mb-4">Selecciona el operario responsable de esta comanda.</p>
              <div className="space-y-2">
                {OPERARIOS.map((op) => (
                  <button
                    key={op}
                    onClick={() => aplicarReasignacion(op)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      (reasignar.operario ?? "Sin asignar") === op
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30"
                        : "bg-stone-50 dark:bg-white/5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {op}
                    {(reasignar.operario ?? "Sin asignar") === op && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
