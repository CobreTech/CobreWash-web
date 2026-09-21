"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Archive, ArrowDownToLine, CheckCircle2, History, Loader2,
  Pencil, Plus, Power, RotateCcw, Search, X, XCircle,
} from "lucide-react";
import { QueryFetchPolicy } from "firebase/data-connect";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { dataConnect } from "@/lib/firebase/client";
import {
  actualizarInsumo,
  crearInsumo,
  getInventario,
  registrarEntradaInventario,
  TipoMovimiento,
  type GetInventarioData,
} from "@/src/dataconnect-generated";

type StockStatus = "OK" | "Bajo" | "Crítico" | "Inactivo";
type Insumo = GetInventarioData["insumos"][number];
type Movimiento = GetInventarioData["movimientoInventarios"][number];
type InsumoForm = {
  id?: string; nombre: string; unidadMedida: string; stockInicial: string;
  stockMinimo: string; activo: boolean;
};
type EntradaForm = { insumoId: string; cantidad: string; motivo: string };

const FORM_VACIO: InsumoForm = {
  nombre: "", unidadMedida: "unidad", stockInicial: "0", stockMinimo: "0", activo: true,
};
const UNIDADES = ["unidad", "kg", "g", "L", "ml", "rollo", "caja", "bolsa"];
const numero = (value: string) => Number(value.replace(",", "."));

function getStatus(item: Insumo): StockStatus {
  if (!item.activo) return "Inactivo";
  if (item.stockMinimo > 0 && item.stockActual <= item.stockMinimo * 0.5) return "Crítico";
  if (item.stockMinimo > 0 && item.stockActual < item.stockMinimo) return "Bajo";
  return "OK";
}

const statusCfg: Record<StockStatus, { style: string; icon: React.ElementType }> = {
  OK: { style: "bg-green-500/10 text-green-700 dark:text-green-400", icon: CheckCircle2 },
  Bajo: { style: "bg-amber-500/10 text-amber-700 dark:text-amber-400", icon: AlertTriangle },
  Crítico: { style: "bg-red-500/10 text-red-700 dark:text-red-400", icon: XCircle },
  Inactivo: { style: "bg-stone-500/10 text-stone-500", icon: Power },
};

function mensajeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/unique constraint|already_exists/i.test(message)) return "Ya existe un insumo con ese nombre.";
  if (/no autorizado|solo administradores/i.test(message)) return "No tienes permisos para realizar esta acción.";
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
  const [filtro, setFiltro] = useState<"Todos" | StockStatus>("Todos");
  const [form, setForm] = useState<InsumoForm | null>(null);
  const [entrada, setEntrada] = useState<EntradaForm | null>(null);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const solicitudActual = useRef(0);

  const cargarInventario = useCallback(async (silencioso = false) => {
    const solicitud = ++solicitudActual.current;
    if (!silencioso) setLoading(true);
    try {
      const result = await getInventario(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
      if (solicitud === solicitudActual.current) {
        setInsumos(result.data.insumos);
        setMovimientos(result.data.movimientoInventarios);
      }
    } catch (error) {
      console.error("No se pudo cargar el inventario:", error);
      if (!silencioso) setNotice({ text: "No se pudo cargar el inventario.", error: true });
    } finally {
      if (solicitud === solicitudActual.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!permitido) return;
    void Promise.resolve().then(() => cargarInventario());
    const refrescar = () => void cargarInventario(true);
    const alVolver = () => document.visibilityState === "visible" && refrescar();
    const intervalo = window.setInterval(refrescar, 10_000);
    window.addEventListener("focus", refrescar);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener("focus", refrescar);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [cargarInventario, permitido]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const enriquecidos = useMemo(() => insumos.map((item) => ({ ...item, status: getStatus(item) })), [insumos]);
  const visibles = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es-CL");
    return enriquecidos.filter((item) =>
      (filtro === "Todos" || item.status === filtro)
      && (!term || item.nombre.toLocaleLowerCase("es-CL").includes(term)
        || item.unidadMedida.toLocaleLowerCase("es-CL").includes(term)),
    );
  }, [enriquecidos, filtro, search]);

  const activos = enriquecidos.filter((item) => item.activo);
  const ok = activos.filter((item) => item.status === "OK").length;
  const bajo = activos.filter((item) => item.status === "Bajo").length;
  const critico = activos.filter((item) => item.status === "Crítico").length;

  const guardarInsumo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    const stockInicial = numero(form.stockInicial);
    const stockMinimo = numero(form.stockMinimo);
    if (!form.nombre.trim() || !form.unidadMedida.trim()) {
      setNotice({ text: "Nombre y unidad de medida son obligatorios.", error: true });
      return;
    }
    if (!Number.isFinite(stockMinimo) || stockMinimo < 0
      || (!form.id && (!Number.isFinite(stockInicial) || stockInicial < 0))) {
      setNotice({ text: "Los valores de stock deben ser números iguales o mayores que cero.", error: true });
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
      setNotice({ text: form.id ? "Insumo actualizado correctamente." : "Insumo registrado correctamente." });
      setForm(null);
    } catch (error) {
      console.error("No se pudo guardar el insumo:", error);
      setNotice({ text: mensajeError(error), error: true });
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
      setNotice({ text: item.activo ? "Insumo desactivado." : "Insumo reactivado." });
    } catch (error) {
      setNotice({ text: mensajeError(error), error: true });
    } finally { setSaving(false); }
  };

  const registrarEntrada = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!entrada) return;
    const cantidad = numero(entrada.cantidad);
    if (!entrada.insumoId || !Number.isFinite(cantidad) || cantidad <= 0) {
      setNotice({ text: "Selecciona un insumo e ingresa una cantidad mayor que cero.", error: true });
      return;
    }
    setSaving(true);
    try {
      await registrarEntradaInventario(dataConnect, {
        insumoId: entrada.insumoId, cantidad, motivo: entrada.motivo.trim() || "Compra o reposición",
      });
      await cargarInventario(true);
      setNotice({ text: "Entrada registrada y stock actualizado automáticamente." });
      setEntrada(null);
    } catch (error) {
      console.error("No se pudo registrar la entrada:", error);
      setNotice({ text: mensajeError(error), error: true });
    } finally { setSaving(false); }
  };

  if (!permitido || loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
      <AnimatePresence>{notice && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`fixed right-5 top-5 z-[70] max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl ${notice.error ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-stone-900 dark:text-red-300" : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-stone-900 dark:text-green-300"}`}>{notice.text}</motion.div>}</AnimatePresence>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Sprint 05 · RF25–RF26</p><h1 className="font-display text-2xl font-extrabold dark:text-white">Gestión de Inventario</h1><p className="mt-1 text-sm text-stone-500">Catálogo real de insumos y movimientos de entrada.</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEntrada({ insumoId: activos[0]?.id ?? "", cantidad: "", motivo: "" })} disabled={!activos.length} className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 disabled:opacity-40 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300"><ArrowDownToLine className="h-4 w-4" />Registrar entrada</button>
          <button onClick={() => setForm(FORM_VACIO)} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-bold text-white shadow-premium"><Plus className="h-4 w-4" />Nuevo insumo</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Insumos activos", value: activos.length, cls: "text-stone-800 dark:text-white" },
          { label: "Stock saludable", value: ok, cls: "text-green-600 dark:text-green-400" },
          { label: "Stock bajo", value: bajo, cls: "text-amber-600 dark:text-amber-400" },
          { label: "Stock crítico", value: critico, cls: "text-red-600 dark:text-red-400" },
        ].map((card) => <div key={card.label} className="glass-panel rounded-2xl p-4"><p className={`text-3xl font-extrabold ${card.cls}`}>{card.value}</p><p className="mt-1 text-xs text-stone-500">{card.label}</p></div>)}
      </div>

      {critico > 0 && <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"><AlertTriangle className="h-5 w-5 shrink-0" />{critico} insumo{critico === 1 ? "" : "s"} requiere{critico === 1 ? "" : "n"} reposición urgente.</div>}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative max-w-md flex-1"><span className="sr-only">Buscar insumo</span><Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o unidad..." className="glass-panel w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500/50" /></label>
        <div className="flex flex-wrap gap-2">{(["Todos", "OK", "Bajo", "Crítico", "Inactivo"] as const).map((opcion) => <button key={opcion} onClick={() => setFiltro(opcion)} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${filtro === opcion ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400"}`}>{opcion}</button>)}</div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-stone-200 bg-stone-50/70 text-left text-[10px] uppercase tracking-wider text-stone-500 dark:border-white/5 dark:bg-white/3">{["Insumo", "Unidad", "Stock actual", "Stock mínimo", "Estado", "Código QR", ""].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>)}</tr></thead><tbody>
          {visibles.map((item) => { const cfg = statusCfg[item.status]; const Icon = cfg.icon; return <tr key={item.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/60 dark:border-white/5 dark:hover:bg-white/3"><td className="px-4 py-3"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"><Archive className="h-4 w-4" /></span><span className="font-bold">{item.nombre}</span></div></td><td className="px-4 py-3 text-stone-500">{item.unidadMedida}</td><td className="px-4 py-3 text-base font-extrabold">{item.stockActual.toLocaleString("es-CL")} <span className="text-xs font-normal text-stone-400">{item.unidadMedida}</span></td><td className="px-4 py-3 text-stone-500">{item.stockMinimo.toLocaleString("es-CL")} {item.unidadMedida}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${cfg.style}`}><Icon className="h-3 w-3" />{item.status}</span></td><td className="px-4 py-3 font-mono text-[10px] text-stone-400">{item.codigoQr.slice(0, 8)}…</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="Editar insumo" onClick={() => setForm({ id: item.id, nombre: item.nombre, unidadMedida: item.unidadMedida, stockInicial: String(item.stockActual), stockMinimo: String(item.stockMinimo), activo: item.activo })} className="rounded-lg p-2 text-stone-400 hover:bg-brand-500/10 hover:text-brand-600"><Pencil className="h-4 w-4" /></button><button disabled={saving} title={item.activo ? "Desactivar" : "Reactivar"} onClick={() => void cambiarEstado(item)} className={`rounded-lg p-2 ${item.activo ? "text-stone-400 hover:bg-red-500/10 hover:text-red-600" : "text-green-600 hover:bg-green-500/10"}`}>{item.activo ? <Power className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}</button></div></td></tr>; })}
        </tbody></table></div>
        {!visibles.length && <div className="p-12 text-center text-sm text-stone-500">No hay insumos que coincidan con el filtro.</div>}
        <div className="border-t border-stone-100 px-4 py-3 text-xs text-stone-400 dark:border-white/5">{visibles.length} de {insumos.length} insumos</div>
      </div>

      <section className="glass-panel overflow-hidden rounded-2xl"><div className="flex items-center gap-2 border-b border-stone-100 px-5 py-4 dark:border-white/5"><History className="h-4 w-4 text-brand-500" /><div><h2 className="text-sm font-extrabold">Últimos movimientos</h2><p className="text-xs text-stone-400">Trazabilidad de stock inicial y reposiciones</p></div></div><div className="divide-y divide-stone-100 dark:divide-white/5">{movimientos.slice(0, 10).map((mov) => <div key={mov.id} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-bold">{mov.insumo.nombre}</p><p className="text-xs text-stone-400">{mov.motivo || "Sin observación"} · {mov.usuario ? `${mov.usuario.nombre} ${mov.usuario.apellido ?? ""}`.trim() : "Sistema"}</p></div><p className={`font-extrabold ${mov.tipoMovimiento === TipoMovimiento.ENTRADA ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{mov.tipoMovimiento === TipoMovimiento.ENTRADA ? "+" : "−"}{mov.cantidad.toLocaleString("es-CL")} {mov.insumo.unidadMedida}</p><time className="text-xs text-stone-400">{new Date(mov.fecha).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}</time></div>)}{!movimientos.length && <p className="p-8 text-center text-sm text-stone-400">Aún no hay movimientos registrados.</p>}</div></section>

      <AnimatePresence>{form && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-sm"><motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onSubmit={guardarInsumo} className="glass-modal relative w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 dark:bg-stone-900"><button type="button" onClick={() => setForm(null)} className="absolute right-5 top-5 rounded-xl bg-stone-100 p-2 text-stone-500 dark:bg-white/5"><X className="h-4 w-4" /></button><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">RF25 · Catálogo</p><h2 className="font-display text-xl font-extrabold">{form.id ? "Editar insumo" : "Registrar insumo"}</h2></div><label className="block text-sm font-semibold">Nombre<input autoFocus required maxLength={80} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Unidad de medida<input required list="unidades-inventario" maxLength={20} value={form.unidadMedida} onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /><datalist id="unidades-inventario">{UNIDADES.map((u) => <option key={u} value={u} />)}</datalist></label>{!form.id && <label className="block text-sm font-semibold">Stock inicial<input required min="0" step="0.01" inputMode="decimal" value={form.stockInicial} onChange={(e) => setForm({ ...form, stockInicial: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label>}<label className="block text-sm font-semibold">Stock mínimo<input required min="0" step="0.01" inputMode="decimal" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label></div>{form.id && <label className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 text-sm font-semibold dark:bg-white/5"><input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 accent-brand-500" />Insumo activo</label>}<div className="flex justify-end gap-2"><button type="button" onClick={() => setForm(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500">Cancelar</button><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{form.id ? "Guardar cambios" : "Registrar insumo"}</button></div></motion.form></div>}</AnimatePresence>

      <AnimatePresence>{entrada && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-sm"><motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onSubmit={registrarEntrada} className="glass-modal relative w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 dark:bg-stone-900"><button type="button" onClick={() => setEntrada(null)} className="absolute right-5 top-5 rounded-xl bg-stone-100 p-2 text-stone-500 dark:bg-white/5"><X className="h-4 w-4" /></button><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">RF26 · Reposición</p><h2 className="font-display text-xl font-extrabold">Registrar entrada de stock</h2><p className="mt-1 text-sm text-stone-500">El stock se actualizará de forma automática.</p></div><label className="block text-sm font-semibold">Insumo<select required value={entrada.insumoId} onChange={(e) => setEntrada({ ...entrada, insumoId: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-950">{activos.map((item) => <option key={item.id} value={item.id}>{item.nombre} · {item.stockActual.toLocaleString("es-CL")} {item.unidadMedida}</option>)}</select></label><label className="block text-sm font-semibold">Cantidad<input autoFocus required min="0.01" step="0.01" inputMode="decimal" value={entrada.cantidad} onChange={(e) => setEntrada({ ...entrada, cantidad: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label><label className="block text-sm font-semibold">Motivo / referencia<textarea maxLength={200} rows={3} value={entrada.motivo} onChange={(e) => setEntrada({ ...entrada, motivo: e.target.value })} placeholder="Ej: Compra proveedor, factura 123…" className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setEntrada(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500">Cancelar</button><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Registrar entrada</button></div></motion.form></div>}</AnimatePresence>
    </div>
  );
}
