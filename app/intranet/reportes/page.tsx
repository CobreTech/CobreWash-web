"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Layers, CalendarRange, Download, Loader2, TrendingUp } from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { BarChart, DonutChart, HBarChart } from "@/components/intranet/Charts";
import { COMANDAS, prendasTotales, valorTotal, type Comanda } from "@/lib/mock/comandas";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;
const facturables = COMANDAS.filter((c) => c.estado !== "Anulado");

type Vista = "cliente" | "servicio" | "volumen";
const VISTAS: { id: Vista; label: string; icon: typeof Users }[] = [
  { id: "cliente", label: "Por cliente / empresa", icon: Users },
  { id: "servicio", label: "Por tipo de servicio", icon: Layers },
  { id: "volumen", label: "Por volumen de prendas", icon: CalendarRange },
];

const SERVICIO_COLOR: Record<string, string> = {
  "Doméstica y Particular": "#f97316",
  "Industrial / Empresa": "#db541a",
  "Retiro a Domicilio": "#fed7aa",
};

function agrupar<T extends string>(items: Comanda[], key: (c: Comanda) => T) {
  const map = new Map<T, { facturado: number; prendas: number; comandas: number }>();
  for (const c of items) {
    const k = key(c);
    const cur = map.get(k) ?? { facturado: 0, prendas: 0, comandas: 0 };
    cur.facturado += valorTotal(c);
    cur.prendas += prendasTotales(c);
    cur.comandas += 1;
    map.set(k, cur);
  }
  return map;
}

export default function ReportesPage() {
  const permitido = useRoleGuard(["admin"]);
  const [vista, setVista] = useState<Vista>("cliente");

  const porCliente = useMemo(() => {
    const map = agrupar(facturables, (c) => c.cliente);
    return [...map.entries()]
      .map(([cliente, v]) => ({ label: cliente, ...v }))
      .sort((a, b) => b.facturado - a.facturado);
  }, []);

  const porServicio = useMemo(() => {
    const map = agrupar(facturables, (c) => c.servicio);
    return [...map.entries()].map(([servicio, v]) => ({ label: servicio, ...v }));
  }, []);

  // Volumen por mes (derivado de la fecha dd/mm/aaaa de recepción).
  const porMes = useMemo(() => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const acc = new Map<number, number>();
    for (const c of facturables) {
      const m = parseInt(c.fechaRecepcion.split("/")[1] ?? "0", 10) - 1;
      acc.set(m, (acc.get(m) ?? 0) + prendasTotales(c));
    }
    // Muestra los últimos 6 meses hasta junio (mes actual del prototipo).
    const orden = [0, 1, 2, 3, 4, 5];
    return { labels: orden.map((m) => meses[m]), data: orden.map((m) => acc.get(m) ?? 0) };
  }, []);

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  const totalFacturado = facturables.reduce((s, c) => s + valorTotal(c), 0);
  const totalPrendas = facturables.reduce((s, c) => s + prendasTotales(c), 0);

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">Reportes</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Análisis del periodo · {facturables.length} comandas facturadas
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition-all self-start sm:self-auto shadow-sm dark:shadow-none cursor-pointer">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </motion.div>

      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Total facturado", value: clp(totalFacturado) },
          { label: "Prendas procesadas", value: totalPrendas.toLocaleString("es-CL") },
          { label: "Ticket promedio", value: clp(Math.round(totalFacturado / facturables.length)) },
        ].map((k) => (
          <div key={k.label} className="glass-panel rounded-2xl p-4 shadow-sm dark:shadow-none">
            <p className="text-xl font-display font-extrabold text-brand-600 dark:text-brand-400">{k.value}</p>
            <p className="text-stone-500 dark:text-stone-500 text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Vista selector */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="flex flex-wrap gap-2">
        {VISTAS.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setVista(v.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                vista === v.id
                  ? "bg-brand-500 text-white shadow-md"
                  : "glass-panel text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {v.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <motion.div key={vista} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {vista === "cliente" && (
          <>
            <div className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none">
              <h3 className="text-stone-900 dark:text-white font-bold text-sm mb-4">Facturación por cliente / empresa</h3>
              <HBarChart items={porCliente.map((c) => ({ label: c.label, value: c.facturado, hint: "CLP" }))} formatValue={(v) => `$${v.toLocaleString("es-CL")}`} />
            </div>
            <div className="glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none overflow-hidden">
              <h3 className="text-stone-900 dark:text-white font-bold text-sm mb-4">Ranking</h3>
              <div className="space-y-2">
                {porCliente.slice(0, 6).map((c, i) => (
                  <div key={c.label} className="flex items-center justify-between text-xs border-b border-stone-100 dark:border-white/5 pb-2 last:border-0">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="truncate text-stone-700 dark:text-stone-200 font-semibold">{c.label}</span>
                    </span>
                    <span className="text-stone-400 dark:text-stone-600 shrink-0">{c.prendas} pz</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {vista === "servicio" && (
          <>
            <div className="glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none">
              <h3 className="text-stone-900 dark:text-white font-bold text-sm mb-4">Distribución por servicio</h3>
              <DonutChart
                segments={porServicio.map((s) => ({ label: s.label, value: s.facturado, color: SERVICIO_COLOR[s.label] ?? "#a8a29e" }))}
                centerValue={facturables.length}
                centerLabel="comandas"
              />
            </div>
            <div className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none overflow-x-auto">
              <h3 className="text-stone-900 dark:text-white font-bold text-sm mb-4">Detalle por tipo de servicio</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-stone-400 dark:text-stone-600 border-b border-stone-200 dark:border-white/5">
                    <th className="text-left font-bold py-2">Servicio</th>
                    <th className="text-right font-bold py-2">Comandas</th>
                    <th className="text-right font-bold py-2">Prendas</th>
                    <th className="text-right font-bold py-2">Facturado</th>
                  </tr>
                </thead>
                <tbody>
                  {porServicio.map((s) => (
                    <tr key={s.label} className="border-b border-stone-100 dark:border-white/5 last:border-0">
                      <td className="py-2.5 font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SERVICIO_COLOR[s.label] ?? "#a8a29e" }} />
                        {s.label}
                      </td>
                      <td className="py-2.5 text-right text-stone-500 dark:text-stone-400">{s.comandas}</td>
                      <td className="py-2.5 text-right text-stone-500 dark:text-stone-400">{s.prendas}</td>
                      <td className="py-2.5 text-right font-bold text-stone-700 dark:text-stone-200">{clp(s.facturado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {vista === "volumen" && (
          <>
            <div className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-stone-900 dark:text-white font-bold text-sm">Volumen de prendas por periodo</h3>
                  <p className="text-stone-500 dark:text-stone-500 text-xs mt-0.5">Prendas procesadas por mes</p>
                </div>
                <span className="text-brand-600 dark:text-brand-400 font-bold text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> {totalPrendas} pz
                </span>
              </div>
              <BarChart data={porMes.data} labels={porMes.labels} height={180} />
            </div>
            <div className="glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none">
              <h3 className="text-stone-900 dark:text-white font-bold text-sm mb-4">Prendas por cliente</h3>
              <HBarChart
                items={[...porCliente].sort((a, b) => b.prendas - a.prendas).slice(0, 6).map((c) => ({ label: c.label, value: c.prendas, hint: "pz" }))}
                color="#db541a"
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
