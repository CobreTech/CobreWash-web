"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Layers, CalendarRange, Download, Loader2, RefreshCw } from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { HBarChart, DonutChart } from "@/components/intranet/Charts";
import GlassSelect from "@/components/ui/GlassSelect";
import { useReportes } from "@/lib/reportes/useReportes";
import { fechaChile, periodoInicial } from "@/lib/reportes/fechas";
import type { FiltrosReporte, VistaReporte } from "@/lib/reportes/modelo";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;
const VISTAS = [
  { id: "cliente" as const, label: "Por cliente / empresa", icon: Users },
  { id: "servicio" as const, label: "Por tipo de servicio", icon: Layers },
  { id: "volumen" as const, label: "Por volumen de prendas", icon: CalendarRange },
];
const panel = "glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none";
const boton = "flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700";
const input = "w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm dark:border-white/10 dark:bg-stone-800";

export default function ReportesPage() {
  const permitido = useRoleGuard(["admin"]);
  const usuario = useUsuarioActualContext();
  const [vista, setVista] = useState<VistaReporte>("cliente");
  const [filtros, setFiltros] = useState<FiltrosReporte>(() => ({ ...periodoInicial(), clienteId: "", empresa: "" }));
  const { datos, catalogos, cargando, error, recargar } = useReportes(usuario?.id, permitido, vista, filtros);
  const [pagina, setPagina] = useState({ clave: "", numero: 1 });
  const clave = JSON.stringify([vista, filtros]);
  const numeroPagina = pagina.clave === clave ? pagina.numero : 1;
  const actualizar = (campo: keyof FiltrosReporte, valor: string) => setFiltros((f) => ({ ...f, [campo]: valor }));

  if (!permitido) return <div className="flex justify-center py-24"><Loader2 aria-label="Verificando acceso" className="h-6 w-6 animate-spin text-brand-500" /></div>;

  return (
    <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="font-display text-2xl font-extrabold dark:text-white">Reportes</h1><p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Análisis del periodo · {datos?.comandas ?? 0} comandas · Montos en CLP</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={recargar} disabled={cargando} className={boton}><RefreshCw className="h-4 w-4" />Actualizar</button><button disabled className={boton}><Download className="h-4 w-4" />Exportar</button></div>
      </motion.div>

      <div className={`${panel} grid gap-4 sm:grid-cols-2 lg:grid-cols-5`}>
        <label className="space-y-1 text-xs font-bold">Desde<input aria-label="Desde" type="date" value={filtros.desde} onChange={(e) => actualizar("desde", e.target.value)} className={input} /></label>
        <label className="space-y-1 text-xs font-bold">Hasta<input aria-label="Hasta" type="date" value={filtros.hasta} onChange={(e) => actualizar("hasta", e.target.value)} className={input} /></label>
        <div className="space-y-1"><p className="text-xs font-bold">Cliente</p><GlassSelect ariaLabel="Cliente" searchable value={filtros.clienteId} onChange={(v) => actualizar("clienteId", v)} options={[{ value: "", label: "Todos los clientes" }, ...(catalogos?.clientes ?? []).map((c) => ({ value: c.id, label: c.nombre }))]} /></div>
        <div className="space-y-1"><p className="text-xs font-bold">Empresa</p><GlassSelect ariaLabel="Empresa" searchable value={filtros.empresa} onChange={(v) => actualizar("empresa", v)} options={[{ value: "", label: "Todas las empresas" }, ...(catalogos?.empresas ?? []).map((e) => ({ value: e, label: e }))]} /></div>
        {vista === "servicio" && <div className="space-y-1"><p className="text-xs font-bold">Servicio</p><GlassSelect ariaLabel="Servicio" searchable value={filtros.servicioId ?? ""} onChange={(v) => actualizar("servicioId", v)} options={[{ value: "", label: "Todos los servicios" }, ...(catalogos?.servicios ?? []).map((s) => ({ value: s.id, label: s.nombre }))]} /></div>}
        <p className="text-xs text-stone-500 sm:col-span-2 lg:col-span-5">Periodo según recepción en horario de Chile. Se excluyen las comandas anuladas. Los montos corresponden al valor de las comandas.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
        {VISTAS.map((v) => <button key={v.id} disabled={v.id === "volumen"} aria-pressed={vista === v.id} onClick={() => setVista(v.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-40 ${vista === v.id ? "bg-brand-500 text-white shadow-md" : "glass-panel text-stone-500 dark:text-stone-400"}`}><v.icon className="h-4 w-4" />{v.label}</button>)}
      </motion.div>

      {error && <div role="alert" className={`${panel} text-sm text-red-600 dark:text-red-400`}>{error}<button onClick={recargar} className="ml-3 font-bold underline">Reintentar</button></div>}
      {cargando && <div role="status" className={`${panel} flex items-center justify-center gap-2 py-16 text-sm text-stone-500`}><Loader2 className="h-5 w-5 animate-spin text-brand-500" />Generando reporte…</div>}
      {!cargando && !error && datos && <>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[{ label: "Total facturado", value: clp(datos.facturado) }, { label: "Prendas recibidas", value: datos.prendas.toLocaleString("es-CL") }, { label: "Ticket promedio", value: clp(datos.comandas ? Math.round(datos.facturado / datos.comandas) : 0) }].map((k) => <div key={k.label} className="glass-panel rounded-2xl p-4 shadow-sm"><p className="font-display text-xl font-extrabold text-brand-600 dark:text-brand-400">{k.value}</p><p className="mt-1 text-xs text-stone-500">{k.label}</p></div>)}
        </motion.div>
        {!datos.comandas ? <div role="status" className={`${panel} py-12 text-center text-sm text-stone-500`}>No hay comandas para los filtros seleccionados.</div> : <>
          <motion.div key={vista} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-3">
            {vista === "cliente" && <><div className={`${panel} lg:col-span-2`}><h3 className="mb-4 text-sm font-bold">Facturación por cliente / empresa</h3><HBarChart items={datos.resumen.slice(0, 12).map((r) => ({ label: r.label, value: r.facturado }))} formatValue={clp} /><p className="mt-4 text-xs text-stone-500">Se muestran las 12 cuentas con mayor facturación. El detalle incluye todas.</p></div>
            <div className={panel}><h3 className="mb-4 text-sm font-bold">Ranking</h3><div className="space-y-2">{datos.resumen.slice(0, 6).map((r, i) => <div key={r.id} className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2 text-xs last:border-0 dark:border-white/5"><span className="flex min-w-0 items-center gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-500/10 font-bold text-brand-600">{i + 1}</span><span className="truncate font-semibold" title={r.label}>{r.label}</span></span><span className="shrink-0 text-stone-500">{r.prendas} pz</span></div>)}</div></div>
            </>}
            {vista === "servicio" && <><div className={panel}><h3 className="mb-4 text-sm font-bold">Distribución por servicio</h3><DonutChart segments={datos.resumen.map((r, i) => ({ label: r.label, value: r.prendas, color: ["#f97316", "#db541a", "#fed7aa", "#a8a29e", "#fb923c"][i % 5] }))} centerValue={datos.prendas} centerLabel="prendas" /></div><div className={`${panel} lg:col-span-2`}><h3 className="mb-4 text-sm font-bold">Demanda por tipo de servicio</h3><HBarChart items={datos.resumen.map((r) => ({ label: r.label, value: r.prendas, hint: "pz" }))} /><p className="mt-4 text-xs text-stone-500">Cada comanda se cuenta una vez por servicio utilizado. El total muestra comandas únicas. Los montos son los subtotales de los servicios seleccionados.</p></div></>}
          </motion.div>
          <div className={`${panel} overflow-x-auto`}><h3 className="mb-4 text-sm font-bold">{vista === "servicio" ? "Totales por tipo de servicio" : "Totales por cuenta"}</h3><table className="w-full text-xs"><thead><tr className="border-b border-stone-200 text-stone-500 dark:border-white/10"><th className="py-2 text-left">{vista === "servicio" ? "Servicio" : "Cliente / empresa"}</th><th className="text-right">Comandas</th><th className="text-right">Prendas</th><th className="text-right">Facturado</th></tr></thead><tbody>{datos.resumen.map((r) => <tr key={r.id} className="border-b border-stone-100 dark:border-white/5"><td className="py-3 font-semibold">{r.label}</td><td className="text-right">{r.comandas}</td><td className="text-right">{r.prendas}</td><td className="text-right font-bold">{clp(r.facturado)}</td></tr>)}</tbody><tfoot><tr className="font-bold"><td className="pt-3">Total</td><td className="pt-3 text-right">{datos.comandas}</td><td className="pt-3 text-right">{datos.prendas}</td><td className="pt-3 text-right">{clp(datos.facturado)}</td></tr></tfoot></table></div>
          <div className={`${panel} overflow-x-auto`}><h3 className="mb-4 text-sm font-bold">Detalle de comandas</h3><table className="w-full text-xs"><thead><tr className="border-b border-stone-200 text-left text-stone-500 dark:border-white/10">{["Comanda", "Recepción", "Cliente", "Empresa", "Estado", ...(vista === "servicio" ? ["Servicio", "Prenda", "Peso (kg)"] : []), "Prendas", "Valor"].map((t) => <th key={t} className="px-2 py-2">{t}</th>)}</tr></thead><tbody>{datos.detalle.slice((numeroPagina - 1) * 20, numeroPagina * 20).map((r) => <tr key={r.id} className="border-b border-stone-100 dark:border-white/5"><td className="px-2 py-3 font-semibold">{r.numero}</td><td className="px-2">{fechaChile(r.fecha)}</td><td className="px-2">{r.cliente}</td><td className="px-2">{r.empresa || "—"}</td><td className="px-2">{r.estado.replaceAll("_", " ")}</td>{vista === "servicio" && <><td className="px-2">{r.servicio}</td><td className="px-2">{r.prenda}</td><td className="px-2">{r.pesoKg ?? "—"}</td></>}<td className="px-2">{r.prendas}</td><td className="px-2 font-bold">{clp(r.facturado)}</td></tr>)}</tbody></table><div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-xs"><span>Página {numeroPagina} de {Math.max(1, Math.ceil(datos.detalle.length / 20))} · {datos.detalle.length} resultados</span><button className={boton} disabled={numeroPagina <= 1} onClick={() => setPagina({ clave, numero: numeroPagina - 1 })}>Anterior</button><button className={boton} disabled={numeroPagina * 20 >= datos.detalle.length} onClick={() => setPagina({ clave, numero: numeroPagina + 1 })}>Siguiente</button></div></div>
        </>}
      </>}
    </div>
  );
}
