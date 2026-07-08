"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, X, Pin, Loader2, Clock } from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import GlassSelect from "@/components/ui/GlassSelect";

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  autor: string;
  destinatario: string; // "Todos" | "Operarios" | "Recepción"
  fecha: string;
  fijado?: boolean;
}

const AVISOS_INICIALES: Aviso[] = [
  {
    id: 1,
    titulo: "Nuevo protocolo de sanitizado para prendas clínicas",
    contenido:
      "Desde hoy, todas las prendas de clientes del rubro salud deben pasar por el ciclo de sanitizado a 90°C antes del secado. Registrar la etapa en el sistema.",
    autor: "Administración",
    destinatario: "Operarios",
    fecha: "01/06/2026 08:15",
    fijado: true,
  },
  {
    id: 2,
    titulo: "Mantención programada de secadora industrial #2",
    contenido:
      "La secadora #2 estará fuera de servicio el jueves 04/06 entre las 14:00 y 17:00. Planifiquen la carga de secado con anticipación.",
    autor: "Administración",
    destinatario: "Todos",
    fecha: "31/05/2026 17:40",
  },
  {
    id: 3,
    titulo: "Recordatorio: etiquetado de comandas de hotel",
    contenido:
      "Reforzar el etiquetado por bulto en comandas de hoteles para evitar mezclas en la entrega. Ante dudas, consultar con recepción.",
    autor: "Administración",
    destinatario: "Operarios",
    fecha: "30/05/2026 09:00",
  },
];

export default function ComunicacionPage() {
  const permitido = useRoleGuard(["admin", "operario"]);
  const usuario = useUsuarioActualContext();
  const esAdmin = usuario?.rol.nombre === "admin";

  const [avisos, setAvisos] = useState<Aviso[]>(AVISOS_INICIALES);
  const [nuevo, setNuevo] = useState(false);
  const [form, setForm] = useState({ titulo: "", contenido: "", destinatario: "Todos" });

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  const publicar = () => {
    if (!form.titulo.trim() || !form.contenido.trim()) return;
    setAvisos((prev) => [
      {
        id: Date.now(),
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        autor: usuario ? `${usuario.nombre}` : "Administración",
        destinatario: form.destinatario,
        fecha: new Date().toLocaleDateString("es-CL") + " " + new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
    setForm({ titulo: "", contenido: "", destinatario: "Todos" });
    setNuevo(false);
  };

  const ordenados = [...avisos].sort((a, b) => Number(!!b.fijado) - Number(!!a.fijado));

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">
            {esAdmin ? "Comunicación Interna" : "Avisos"}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {esAdmin ? "Publica y gestiona los avisos del equipo" : "Avisos publicados por administración · solo lectura"}
          </p>
        </div>
        {esAdmin && (
          <button
            onClick={() => setNuevo(true)}
            className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg hover:scale-[1.02] transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publicar aviso
          </button>
        )}
      </motion.div>

      {/* Avisos */}
      <div className="space-y-3">
        {ordenados.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white dark:bg-stone-900 border rounded-2xl p-5 shadow-sm dark:shadow-none ${
              a.fijado ? "border-brand-300 dark:border-brand-500/30" : "border-stone-200 dark:border-white/5"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-stone-900 dark:text-white font-bold text-sm">{a.titulo}</h3>
                  {a.fijado && (
                    <span className="text-[10px] font-bold flex items-center gap-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" /> Fijado
                    </span>
                  )}
                  <span className="text-[10px] font-bold bg-stone-100 dark:bg-white/5 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full">
                    {a.destinatario}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-sm mt-1.5 leading-relaxed">{a.contenido}</p>
                <p className="text-stone-400 dark:text-stone-600 text-[11px] mt-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {a.autor} · {a.fecha}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Publicar modal (solo admin) */}
      <AnimatePresence>
        {nuevo && esAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNuevo(false)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="glass-panel rounded-3xl p-6 w-full max-w-lg relative z-10">
              <button onClick={() => setNuevo(false)} className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display mb-5">Publicar aviso</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Título</label>
                  <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-brand-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Contenido</label>
                  <textarea value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-brand-500 resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Destinatario</label>
                  <GlassSelect
                    value={form.destinatario}
                    onChange={(v) => setForm({ ...form, destinatario: v })}
                    ariaLabel="Destinatario"
                    options={[
                      { value: "Todos", label: "Todos" },
                      { value: "Operarios", label: "Operarios" },
                      { value: "Recepción", label: "Recepción" },
                    ]}
                  />
                </div>
                <button onClick={publicar} className="w-full bg-gradient-brand text-white py-3 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all cursor-pointer">Publicar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
