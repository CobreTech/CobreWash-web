"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { etapaActualProduccion, progresoProduccion, type EtapaVisible } from "@/lib/produccion/modelo";

type Props = {
  etapas: EtapaVisible[];
  puedeCompletar?: boolean;
  completando?: boolean;
  onCompletar?: (etapa: EtapaVisible) => void;
};

export default function FlujoProduccion({ etapas, puedeCompletar = false, completando = false, onCompletar }: Props) {
  if (!etapas.length) return <p className="text-sm text-stone-500">Esta comanda no tiene un flujo de producción asociado.</p>;
  const porcentaje = progresoProduccion(etapas);
  const actual = etapaActualProduccion(etapas);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-stone-200/80 bg-stone-50/80 p-4 sm:p-5 dark:border-white/10 dark:bg-black/20"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">Estado global de producción</p>
        <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400">{porcentaje}%</span>
      </div>
      <div role="progressbar" aria-label="Etapas completadas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={porcentaje} className="sr-only" />
      <ol className="flex snap-x items-stretch gap-1 overflow-x-auto pb-2 sm:gap-2">
        {etapas.map((etapa, index) => {
          const completada = etapa.estado === "COMPLETADA";
          const activa = actual?.id === etapa.id;
          return (
            <li key={etapa.id} className="contents">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2, transition: { duration: 0.18 } }}
                className={`relative min-w-[96px] flex-1 snap-start rounded-2xl border px-2 py-4 text-center transition-all sm:px-3 ${
                  completada
                    ? "border-green-500/20 bg-green-500/10"
                    : activa
                      ? "border-brand-500/40 bg-brand-500/10 shadow-[0_0_24px_rgba(249,115,22,0.10)]"
                      : "border-transparent bg-white dark:bg-white/5"
                }`}
              >
                <div className={`mx-auto grid h-7 w-7 place-items-center rounded-full text-sm font-extrabold ${
                  completada ? "bg-green-500 text-white" : activa ? "bg-brand-500 text-white" : "bg-stone-200 text-stone-500 dark:bg-white/10 dark:text-stone-400"
                }`}>
                  {completada ? <Check className="h-4 w-4" aria-hidden="true" /> : etapa.orden}
                </div>
                <p className={`mt-2 text-[11px] font-semibold ${activa ? "text-brand-600 dark:text-brand-400" : completada ? "text-green-700 dark:text-green-400" : "text-stone-500"}`}>{etapa.nombre}</p>
                <span className="mt-1 block text-[9px] font-medium uppercase tracking-wide text-stone-400">
                  {completada ? "Completada" : activa ? "Etapa actual" : "Pendiente"}
                </span>
                {activa && <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute inset-x-5 bottom-0 h-0.5 rounded-full bg-brand-500" />}
              </motion.div>
              {index < etapas.length - 1 && <ArrowRight aria-hidden="true" className="mt-9 h-4 w-4 shrink-0 text-stone-300 dark:text-stone-700" />}
            </li>
          );
        })}
      </ol>
      {puedeCompletar && actual && onCompletar && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/70 pt-4 dark:border-white/10">
          <div>
            <p className="text-xs text-stone-500">Etapa actual</p>
            <p className="text-sm font-bold text-stone-900 dark:text-white">{actual.orden}. {actual.nombre}</p>
          </div>
          <motion.button
            type="button"
            whileHover={completando ? undefined : { y: -2 }}
            whileTap={completando ? undefined : { scale: 0.97 }}
            disabled={completando}
            onClick={() => onCompletar(actual)}
            className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {completando ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {completando ? "Completando..." : "Completar etapa"}
          </motion.button>
        </div>
      )}
    </motion.section>
  );
}
