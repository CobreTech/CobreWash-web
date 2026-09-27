"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Archive, ArrowDownToLine, ArrowUpFromLine, CheckCircle2,
  Download, History, Loader2, Pencil, Plus, Power, Radio, RotateCcw,
  Search, SlidersHorizontal, X, XCircle,
} from "lucide-react";
import { QueryFetchPolicy, subscribe } from "firebase/data-connect";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { dataConnect } from "@/lib/firebase/client";
import {
  crearCsvMovimientos, filtrarMovimientos, obtenerEstadoStock,
  type EstadoStock,
} from "@/lib/inventario/movimientos";
import {
  actualizarInsumo, crearInsumo, getInventario, getInventarioRef,
  registrarEntradaInventario, registrarSalidaInventario, TipoMovimiento,
  type GetInventarioData,
} from "@/src/dataconnect-generated";

type Insumo = GetInventarioData["insumos"][number];
type Movimiento = GetInventarioData["movimientoInventarios"][number];
type InsumoForm = {
  id?: string;
  nombre: string;
  unidadMedida: string;
  stockInicial: string;
  stockMinimo: string;
  activo: boolean;
};
type MovimientoForm = {
  tipo: TipoMovimiento;
  insumoId: string;
  cantidad: string;
  motivo: string;
};
type Notice = { text: string; tipo: "success" | "warning" | "error" };

const FORM_VACIO: InsumoForm = {
  nombre: "", unidadMedida: "unidad", stockInicial: "0", stockMinimo: "0", activo: true,
};
const UNIDADES = ["unidad", "kg", "g", "L", "ml", "rollo", "caja", "bolsa"];
const numero = (value: string) => Number(value.replace(",", "."));

const statusCfg: Record<EstadoStock, { style: string; icon: React.ElementType }> = {
  OK: { style: "bg-green-500/10 text-green-700 dark:text-green-400", icon: CheckCircle2 },
  Bajo: { style: "bg-amber-500/10 text-amber-700 dark:text-amber-400", icon: AlertTriangle },
  Crítico: { style: "bg-red-500/10 text-red-700 dark:text-red-400", icon: XCircle },
  Inactivo: { style: "bg-stone-500/10 text-stone-500", icon: Power },
};

const noticeStyle: Record<Notice["tipo"], string> = {
  success: "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-stone-900 dark:text-green-300",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-stone-900 dark:text-amber-300",
  error: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-stone-900 dark:text-red-300",
};

function mensajeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/unique constraint|already_exists/i.test(message)) return "Ya existe un insumo con ese nombre.";
  if (/no autorizado|solo administradores/i.test(message)) return "No tienes permisos para realizar esta acción.";
  if (/stock insuficiente/i.test(message)) return "No hay stock suficiente para registrar esa salida.";
  if (/inactivo/i.test(message)) return "El insumo está inactivo. Actívalo antes de registrar stock.";
  if (/cantidad/i.test(message)) return "La cantidad debe ser mayor que cero.";
  return "No fue posible guardar el cambio. Intenta nuevamente.";
}

export default function InventarioPage() {
  const permitido = useRoleGuard(["admin"]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | EstadoStock>("Todos");
  const [form, setForm] = useState<InsumoForm | null>(null);
  const [movimiento, setMovimiento] = useState<MovimientoForm | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [historialInsumo, setHistorialInsumo] = useState("");
  const [historialTipo, setHistorialTipo] = useState<"TODOS" | TipoMovimiento>("TODOS");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const alertasPrevias = useRef<Set<string> | null>(null);
  const solicitudActual = useRef(0);

  const aplicarDatos = useCallback((data: GetInventarioData) => {
    const alertasActuales = new Set(
      data.insumos
        .filter((item) => {
          const estado = obtenerEstadoStock(item);
          return estado === "Bajo" || estado === "Crítico";
        })
        .map((item) => item.id),
    );
    const anteriores = alertasPrevias.current;
    if (anteriores) {
      const nuevas = data.insumos.filter((item) => alertasActuales.has(item.id) && !anteriores.has(item.id));
      if (nuevas.length) {
        setNotice({
          text: `${nuevas.map((item) => item.nombre).join(", ")} alcanzó el nivel mínimo de stock.`,
          tipo: "warning",
        });
      }
    }
    alertasPrevias.current = alertasActuales;
    setInsumos(data.insumos);
    setMovimientos(data.movimientoInventarios);
    setLoading(false);
  }, []);

  const cargarInventario = useCallback(async (silencioso = false) => {
    const solicitud = ++solicitudActual.current;
    if (!silencioso) setLoading(true);
    try {
      const result = await getInventario(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
      if (solicitud === solicitudActual.current) aplicarDatos(result.data);
    } catch (error) {
      console.error("No se pudo cargar el inventario:", error);
      if (!silencioso) setNotice({ text: "No se pudo cargar el inventario.", tipo: "error" });
    } finally {
      if (solicitud === solicitudActual.current) setLoading(false);
    }
  }, [aplicarDatos]);

  useEffect(() => {
    if (!permitido) return;
    const query = getInventarioRef(dataConnect);
    const cancelar = subscribe(
      query,
      (result) => aplicarDatos(result.data),
      (error) => {
        console.error("Se interrumpió la actualización del inventario:", error);
        setNotice({ text: "Se perdió la actualización en tiempo real. Reintentando…", tipo: "warning" });
        void cargarInventario(true);
      },
    );
    const refrescar = () => void cargarInventario(true);
    const alVolver = () => document.visibilityState === "visible" && refrescar();
    window.addEventListener("focus", refrescar);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      cancelar();
      window.removeEventListener("focus", refrescar);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [aplicarDatos, cargarInventario, permitido]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const enriquecidos = useMemo(
    () => insumos.map((item) => ({ ...item, status: obtenerEstadoStock(item) })),
    [insumos],
  );
  const visibles = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es-CL");
    return enriquecidos.filter((item) =>
      (filtro === "Todos" || item.status === filtro)
      && (!term || item.nombre.toLocaleLowerCase("es-CL").includes(term)
        || item.unidadMedida.toLocaleLowerCase("es-CL").includes(term)),
    );
  }, [enriquecidos, filtro, search]);
  const movimientosFiltrados = useMemo(() => filtrarMovimientos(movimientos, {
    insumoId: historialInsumo || undefined,
    tipo: historialTipo,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  }), [fechaDesde, fechaHasta, historialInsumo, historialTipo, movimientos]);

  const activos = enriquecidos.filter((item) => item.activo);
  const conStock = activos.filter((item) => item.stockActual > 0);
  const ok = activos.filter((item) => item.status === "OK").length;
  const bajo = activos.filter((item) => item.status === "Bajo").length;
  const critico = activos.filter((item) => item.status === "Crítico").length;
  const alertas = enriquecidos.filter((item) => item.status === "Bajo" || item.status === "Crítico");

  const guardarInsumo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    const stockInicial = numero(form.stockInicial);
    const stockMinimo = numero(form.stockMinimo);
    if (!form.nombre.trim() || !form.unidadMedida.trim()) {
      setNotice({ text: "Nombre y unidad de medida son obligatorios.", tipo: "error" });
      return;
    }
    if (!Number.isFinite(stockMinimo) || stockMinimo < 0
      || (!form.id && (!Number.isFinite(stockInicial) || stockInicial < 0))) {
      setNotice({ text: "Los valores de stock deben ser números iguales o mayores que cero.", tipo: "error" });
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        await actualizarInsumo(dataConnect, {
          id: form.id, nombre: form.nombre.trim(), unidadMedida: form.unidadMedida.trim(),
          stockMinimo, activo: form.activo,
        });
      } else {
        await crearInsumo(dataConnect, {
          nombre: form.nombre.trim(), unidadMedida: form.unidadMedida.trim(), stockInicial, stockMinimo,
        });
      }
      await cargarInventario(true);
      setNotice({ text: form.id ? "Insumo actualizado correctamente." : "Insumo registrado correctamente.", tipo: "success" });
      setForm(null);
    } catch (error) {
      console.error("No se pudo guardar el insumo:", error);
      setNotice({ text: mensajeError(error), tipo: "error" });
    } finally { setSaving(false); }
  };

  const cambiarEstado = async (item: Insumo) => {
    setSaving(true);
    try {
      await actualizarInsumo(dataConnect, {
        id: item.id, nombre: item.nombre, unidadMedida: item.unidadMedida,
        stockMinimo: item.stockMinimo, activo: !item.activo,
      });
      await cargarInventario(true);
      setNotice({ text: item.activo ? "Insumo desactivado." : "Insumo reactivado.", tipo: "success" });
    } catch (error) {
      setNotice({ text: mensajeError(error), tipo: "error" });
    } finally { setSaving(false); }
  };

  const registrarMovimiento = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!movimiento) return;
    const cantidad = numero(movimiento.cantidad);
    const seleccionado = activos.find((item) => item.id === movimiento.insumoId);
    if (!seleccionado || !Number.isFinite(cantidad) || cantidad <= 0) {
      setNotice({ text: "Selecciona un insumo e ingresa una cantidad mayor que cero.", tipo: "error" });
      return;
    }
    if (movimiento.tipo === TipoMovimiento.SALIDA && cantidad > seleccionado.stockActual) {
      setNotice({ text: `El stock disponible es ${seleccionado.stockActual} ${seleccionado.unidadMedida}.`, tipo: "error" });
      return;
    }
    setSaving(true);
    try {
      const variables = {
        insumoId: movimiento.insumoId,
        cantidad,
        motivo: movimiento.motivo.trim()
          || (movimiento.tipo === TipoMovimiento.ENTRADA ? "Compra o reposición" : "Consumo interno"),
      };
      if (movimiento.tipo === TipoMovimiento.ENTRADA) {
        await registrarEntradaInventario(dataConnect, variables);
      } else {
        await registrarSalidaInventario(dataConnect, variables);
      }
      await cargarInventario(true);
      setNotice({ text: `${movimiento.tipo === TipoMovimiento.ENTRADA ? "Entrada" : "Salida"} registrada y stock actualizado.`, tipo: "success" });
      setMovimiento(null);
    } catch (error) {
      console.error("No se pudo registrar el movimiento:", error);
      setNotice({ text: mensajeError(error), tipo: "error" });
      await cargarInventario(true);
    } finally { setSaving(false); }
  };

  const exportarHistorial = () => {
    if (!movimientosFiltrados.length) return;
    const blob = new Blob([crearCsvMovimientos(movimientosFiltrados)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `movimientos-inventario-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  };

  const abrirMovimiento = (tipo: TipoMovimiento) => {
    const opciones = tipo === TipoMovimiento.SALIDA ? conStock : activos;
    setMovimiento({ tipo, insumoId: opciones[0]?.id ?? "", cantidad: "", motivo: "" });
  };

  if (!permitido || loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
      <AnimatePresence>{notice && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role={notice.tipo === "error" ? "alert" : "status"} aria-live="polite" className={`fixed right-5 top-5 z-[70] max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl ${noticeStyle[notice.tipo]}`}>{notice.text}</motion.div>}</AnimatePresence>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400"><Radio className="h-3 w-3 animate-pulse" />Inventario conectado</div><h1 className="font-display text-2xl font-extrabold dark:text-white">Gestión de Inventario</h1><p className="mt-1 text-sm text-stone-500">Stock y movimientos sincronizados automáticamente.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={() => abrirMovimiento(TipoMovimiento.SALIDA)} disabled={!conStock.length} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"><ArrowUpFromLine className="h-4 w-4" />Registrar salida</button><button onClick={() => abrirMovimiento(TipoMovimiento.ENTRADA)} disabled={!activos.length} className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 disabled:opacity-40 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300"><ArrowDownToLine className="h-4 w-4" />Registrar entrada</button><button onClick={() => setForm(FORM_VACIO)} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-bold text-white shadow-premium"><Plus className="h-4 w-4" />Nuevo insumo</button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[
        { label: "Insumos activos", value: activos.length, cls: "text-stone-800 dark:text-white" },
        { label: "Stock saludable", value: ok, cls: "text-green-600 dark:text-green-400" },
        { label: "Stock bajo", value: bajo, cls: "text-amber-600 dark:text-amber-400" },
        { label: "Stock crítico", value: critico, cls: "text-red-600 dark:text-red-400" },
      ].map((kpi) => <div key={kpi.label} className="glass-panel rounded-2xl p-4"><p className="text-xs font-semibold text-stone-400">{kpi.label}</p><p className={`mt-1 text-2xl font-extrabold ${kpi.cls}`}>{kpi.value}</p></div>)}</div>

      {alertas.length > 0 && <section role="alert" className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><div><h2 className="font-bold text-amber-900 dark:text-amber-200">Atención de inventario requerida</h2><p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{alertas.map((item) => `${item.nombre}: ${item.stockActual.toLocaleString("es-CL")} ${item.unidadMedida} (mínimo ${item.stockMinimo.toLocaleString("es-CL")})`).join(" · ")}</p></div></div></section>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="relative max-w-md flex-1"><span className="sr-only">Buscar insumo</span><Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o unidad..." className="glass-panel w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500/50" /></label><div className="flex flex-wrap gap-2">{(["Todos", "OK", "Bajo", "Crítico", "Inactivo"] as const).map((opcion) => <button key={opcion} onClick={() => setFiltro(opcion)} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${filtro === opcion ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400"}`}>{opcion}</button>)}</div></div>

      <section className="glass-panel overflow-hidden rounded-2xl"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-stone-50/80 text-xs uppercase text-stone-400 dark:bg-white/5"><tr><th className="px-4 py-3">Insumo</th><th className="px-4 py-3">Unidad</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Mínimo</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Código</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead><tbody>
        {visibles.map((item) => { const cfg = statusCfg[item.status]; const Icon = cfg.icon; return <tr key={item.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/60 dark:border-white/5 dark:hover:bg-white/3"><td className="px-4 py-3"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"><Archive className="h-4 w-4" /></span><span className="font-bold">{item.nombre}</span></div></td><td className="px-4 py-3 text-stone-500">{item.unidadMedida}</td><td className="px-4 py-3 text-base font-extrabold">{item.stockActual.toLocaleString("es-CL")} <span className="text-xs font-normal text-stone-400">{item.unidadMedida}</span></td><td className="px-4 py-3 text-stone-500">{item.stockMinimo.toLocaleString("es-CL")} {item.unidadMedida}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${cfg.style}`}><Icon className="h-3 w-3" />{item.status}</span></td><td className="px-4 py-3 font-mono text-[10px] text-stone-400">{item.codigoQr.slice(0, 8)}…</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="Editar insumo" onClick={() => setForm({ id: item.id, nombre: item.nombre, unidadMedida: item.unidadMedida, stockInicial: String(item.stockActual), stockMinimo: String(item.stockMinimo), activo: item.activo })} className="rounded-lg p-2 text-stone-400 hover:bg-brand-500/10 hover:text-brand-600"><Pencil className="h-4 w-4" /></button><button disabled={saving} title={item.activo ? "Desactivar" : "Reactivar"} onClick={() => void cambiarEstado(item)} className={`rounded-lg p-2 ${item.activo ? "text-stone-400 hover:bg-red-500/10 hover:text-red-600" : "text-green-600 hover:bg-green-500/10"}`}>{item.activo ? <Power className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}</button></div></td></tr>; })}
        {!visibles.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-stone-400">No hay insumos que coincidan con los filtros.</td></tr>}
      </tbody></table></div></section>

      <section className="glass-panel overflow-hidden rounded-2xl"><div className="flex flex-col gap-4 border-b border-stone-100 px-5 py-4 dark:border-white/5 lg:flex-row lg:items-end lg:justify-between"><div className="flex items-center gap-2"><History className="h-4 w-4 text-brand-500" /><div><h2 className="text-sm font-extrabold">Historial de movimientos</h2><p className="text-xs text-stone-400">Entradas y salidas con trazabilidad completa</p></div></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-semibold text-stone-500">Insumo<select value={historialInsumo} onChange={(event) => setHistorialInsumo(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 bg-transparent px-2 py-2 text-sm dark:border-white/10"><option value="">Todos</option>{insumos.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label><label className="text-xs font-semibold text-stone-500">Tipo<select value={historialTipo} onChange={(event) => setHistorialTipo(event.target.value as "TODOS" | TipoMovimiento)} className="mt-1 w-full rounded-lg border border-stone-200 bg-transparent px-2 py-2 text-sm dark:border-white/10"><option value="TODOS">Todos</option><option value={TipoMovimiento.ENTRADA}>Entradas</option><option value={TipoMovimiento.SALIDA}>Salidas</option></select></label><label className="text-xs font-semibold text-stone-500">Desde<input type="date" value={fechaDesde} max={fechaHasta || undefined} onChange={(event) => setFechaDesde(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 bg-transparent px-2 py-2 text-sm dark:border-white/10" /></label><label className="text-xs font-semibold text-stone-500">Hasta<input type="date" value={fechaHasta} min={fechaDesde || undefined} onChange={(event) => setFechaHasta(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 bg-transparent px-2 py-2 text-sm dark:border-white/10" /></label><div className="flex items-end gap-1"><button title="Limpiar filtros" onClick={() => { setHistorialInsumo(""); setHistorialTipo("TODOS"); setFechaDesde(""); setFechaHasta(""); }} className="rounded-lg border border-stone-200 p-2.5 text-stone-500 dark:border-white/10"><SlidersHorizontal className="h-4 w-4" /></button><button onClick={exportarHistorial} disabled={!movimientosFiltrados.length} className="flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-40"><Download className="h-4 w-4" />CSV</button></div></div></div><div className="max-h-[520px] divide-y divide-stone-100 overflow-y-auto dark:divide-white/5">{movimientosFiltrados.map((mov) => <div key={mov.id} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-bold">{mov.insumo.nombre}</p><p className="text-xs text-stone-400">{mov.motivo || "Sin observación"} · {mov.usuario ? `${mov.usuario.nombre} ${mov.usuario.apellido ?? ""}`.trim() : "Sistema"}</p></div><p className={`font-extrabold ${mov.tipoMovimiento === TipoMovimiento.ENTRADA ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{mov.tipoMovimiento === TipoMovimiento.ENTRADA ? "+" : "−"}{mov.cantidad.toLocaleString("es-CL")} {mov.insumo.unidadMedida}</p><time className="text-xs text-stone-400">{new Date(mov.fecha).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}</time></div>)}{!movimientosFiltrados.length && <p className="p-8 text-center text-sm text-stone-400">No hay movimientos para los filtros seleccionados.</p>}</div></section>

      <AnimatePresence>{form && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-sm"><motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onSubmit={guardarInsumo} className="glass-modal relative w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 dark:bg-stone-900"><button type="button" onClick={() => setForm(null)} className="absolute right-5 top-5 rounded-xl bg-stone-100 p-2 text-stone-500 dark:bg-white/5"><X className="h-4 w-4" /></button><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">Catálogo de inventario</p><h2 className="font-display text-xl font-extrabold">{form.id ? "Editar insumo" : "Registrar insumo"}</h2></div><label className="block text-sm font-semibold">Nombre<input autoFocus required maxLength={80} value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Unidad de medida<input required list="unidades-inventario" maxLength={20} value={form.unidadMedida} onChange={(event) => setForm({ ...form, unidadMedida: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /><datalist id="unidades-inventario">{UNIDADES.map((unidad) => <option key={unidad} value={unidad} />)}</datalist></label>{!form.id && <label className="block text-sm font-semibold">Stock inicial<input required min="0" step="0.01" inputMode="decimal" value={form.stockInicial} onChange={(event) => setForm({ ...form, stockInicial: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label>}<label className="block text-sm font-semibold">Stock mínimo<input required min="0" step="0.01" inputMode="decimal" value={form.stockMinimo} onChange={(event) => setForm({ ...form, stockMinimo: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label></div>{form.id && <label className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 text-sm font-semibold dark:bg-white/5"><input type="checkbox" checked={form.activo} onChange={(event) => setForm({ ...form, activo: event.target.checked })} className="h-4 w-4 accent-brand-500" />Insumo activo</label>}<div className="flex justify-end gap-2"><button type="button" onClick={() => setForm(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500">Cancelar</button><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{form.id ? "Guardar cambios" : "Registrar insumo"}</button></div></motion.form></div>}</AnimatePresence>

      <AnimatePresence>{movimiento && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-sm"><motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onSubmit={registrarMovimiento} className="glass-modal relative w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 dark:bg-stone-900"><button type="button" onClick={() => setMovimiento(null)} className="absolute right-5 top-5 rounded-xl bg-stone-100 p-2 text-stone-500 dark:bg-white/5"><X className="h-4 w-4" /></button><div><p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${movimiento.tipo === TipoMovimiento.ENTRADA ? "text-brand-600" : "text-red-600"}`}>Movimiento de inventario</p><h2 className="font-display text-xl font-extrabold">Registrar {movimiento.tipo === TipoMovimiento.ENTRADA ? "entrada" : "salida"} de stock</h2><p className="mt-1 text-sm text-stone-500">El stock y el historial se actualizarán automáticamente.</p></div><label className="block text-sm font-semibold">Insumo<select required value={movimiento.insumoId} onChange={(event) => setMovimiento({ ...movimiento, insumoId: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-950">{(movimiento.tipo === TipoMovimiento.SALIDA ? conStock : activos).map((item) => <option key={item.id} value={item.id}>{item.nombre} · {item.stockActual.toLocaleString("es-CL")} {item.unidadMedida}</option>)}</select></label><label className="block text-sm font-semibold">Cantidad<input autoFocus required min="0.01" max={movimiento.tipo === TipoMovimiento.SALIDA ? activos.find((item) => item.id === movimiento.insumoId)?.stockActual : undefined} step="0.01" inputMode="decimal" value={movimiento.cantidad} onChange={(event) => setMovimiento({ ...movimiento, cantidad: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label><label className="block text-sm font-semibold">Motivo / referencia<textarea maxLength={200} rows={3} value={movimiento.motivo} onChange={(event) => setMovimiento({ ...movimiento, motivo: event.target.value })} placeholder={movimiento.tipo === TipoMovimiento.ENTRADA ? "Ej: Compra proveedor, factura 123…" : "Ej: Consumo semanal en producción…"} className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setMovimiento(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500">Cancelar</button><button disabled={saving || !movimiento.insumoId} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${movimiento.tipo === TipoMovimiento.ENTRADA ? "bg-gradient-brand" : "bg-red-600"}`}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Registrar {movimiento.tipo === TipoMovimiento.ENTRADA ? "entrada" : "salida"}</button></div></motion.form></div>}</AnimatePresence>
    </div>
  );
}
