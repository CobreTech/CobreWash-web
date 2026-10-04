"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, UserRoundPen, X } from "lucide-react";
import type { EtapaVisible } from "@/lib/produccion/modelo";
import GlassSelect from "@/components/ui/GlassSelect";

export type AsignacionOperario = { comandaId: string; numero: string; etapaId: string; etapas: EtapaVisible[]; operarioId: string; motivo: string };
type Props = {
  valor: AsignacionOperario;
  operarios: { id: string; nombre: string; apellido?: string | null }[];
  guardando: boolean; error: string;
  onChange: (valor: AsignacionOperario) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCerrar: () => void;
};
const inputStyle = "mt-1.5 w-full rounded-xl border border-stone-200/80 bg-stone-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500/50 focus:bg-white dark:border-white/10 dark:bg-stone-800/50 dark:focus:bg-stone-900";

export default function AsignarOperarioModal({ valor, operarios, guardando, error, onChange, onSubmit, onCerrar }: Props) {
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    form.current?.querySelector<HTMLElement>('[aria-haspopup="listbox"]')?.focus();
    return () => anterior?.focus();
  }, []);
  const actual = valor.etapas.find((e) => e.id === valor.etapaId);
  return createPortal(<div role="dialog" aria-modal="true" aria-labelledby="titulo-reasignacion" className="fixed inset-0 z-[70] flex items-center justify-center p-4 text-stone-900 dark:text-stone-100" onKeyDown={(e) => {
    if (e.key === "Escape" && !guardando && !form.current?.querySelector('[aria-haspopup="listbox"][aria-expanded="true"]')) { e.preventDefault(); onCerrar(); }
    if (e.key === "Tab") {
      const elementos = form.current?.querySelectorAll<HTMLElement>("button:not(:disabled), textarea:not(:disabled)");
      if (!elementos?.length) return;
      const primero = elementos[0], ultimo = elementos[elementos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  }}>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !guardando && onCerrar()} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
    <motion.form ref={form} initial={{ scale: 0.95, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 16 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} onSubmit={onSubmit} className="glass-panel relative z-10 max-h-[90dvh] w-full max-w-lg space-y-5 overflow-y-auto rounded-3xl p-6 sm:p-7">
      <button type="button" disabled={guardando} onClick={onCerrar} aria-label="Cerrar asignación" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 dark:bg-white/5 dark:text-stone-400 dark:hover:bg-white/10"><X className="h-4 w-4" /></button>
      <div className="flex items-start gap-3.5 pr-12"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400"><UserRoundPen className="h-6 w-6" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Producción</p><h2 id="titulo-reasignacion" className="font-display text-xl font-extrabold">Asignar operario</h2></div></div>
      <div className="grid gap-3 rounded-2xl bg-stone-50 p-4 text-sm sm:grid-cols-2 dark:bg-white/5"><div><p className="text-xs text-stone-400">Comanda</p><p className="font-bold text-brand-600 dark:text-brand-400">{valor.numero}</p></div><div><p className="text-xs text-stone-400">Operario actual</p><p className="font-semibold">{actual?.asignadoA ?? "Sin asignar"}</p></div></div>
      {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{error}</p>}
      <fieldset disabled={guardando} className="space-y-5">
        <div className="space-y-1.5"><p className="text-sm font-semibold">Etapa <span className="text-red-500">*</span></p><GlassSelect ariaLabel="Etapa" value={valor.etapaId} disabled={guardando} onChange={(v) => onChange({ ...valor, etapaId: v, operarioId: "" })} options={valor.etapas.filter((e) => e.estado !== "COMPLETADA").map((e) => ({ value: e.id, label: `${e.orden}. ${e.nombre}` }))} /></div>
        <div className="space-y-1.5"><p className="text-sm font-semibold">Operario <span className="text-red-500">*</span></p><GlassSelect ariaLabel="Operario" value={valor.operarioId} disabled={guardando} placeholder="Selecciona un operario" onChange={(v) => onChange({ ...valor, operarioId: v })} options={operarios.map((o) => ({ value: o.id, label: [o.nombre, o.apellido].filter(Boolean).join(" ") }))} /></div>
        {!operarios.length && <p className="text-xs text-amber-700 dark:text-amber-300">No hay operarios activos disponibles.</p>}
        <label className="block text-sm font-semibold">Motivo <span className="font-normal text-stone-400">(opcional)</span><textarea maxLength={200} rows={3} placeholder="Indica el motivo de la asignación…" value={valor.motivo} onChange={(e) => onChange({ ...valor, motivo: e.target.value })} className={`${inputStyle} resize-none`} /></label>
      </fieldset>
      <div className="rounded-xl border border-stone-200/70 bg-stone-50/70 p-3.5 text-xs text-stone-500 dark:border-white/5 dark:bg-white/5">La asignación quedará registrada con fecha y responsable en el historial de la comanda.</div>
      <div className="flex justify-end gap-2 pt-2"><button type="button" disabled={guardando} onClick={onCerrar} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-white/5">Cancelar</button><button disabled={guardando || !valor.operarioId || !actual || !operarios.length} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:opacity-50">{guardando && <Loader2 className="h-4 w-4 animate-spin" />}{guardando ? "Guardando…" : "Confirmar asignación"}</button></div>
    </motion.form>
  </div>, document.body);
}
