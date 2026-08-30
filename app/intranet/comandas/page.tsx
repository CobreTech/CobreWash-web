"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Ban,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import ComandaDetalle from "@/components/intranet/ComandaDetalle";
import GlassSelect from "@/components/ui/GlassSelect";
import {
  estadoConfig,
  type EstadoComanda,
  type PrendaLinea,
} from "@/lib/mock/comandas";
import { dataConnect } from "@/lib/firebase/client";
import { 
  TipoCliente, 
  ComandaEstado,
  getComandas,
  getCatalogosComanda,
  crearComanda,
  agregarComandaDetalle,
  anularComanda,
  entregarComanda,
  type GetComandasData,
  type GetCatalogosComandaData
} from "@/src/dataconnect-generated";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;
const ESTADOS: EstadoComanda[] = ["Pendiente", "En proceso", "Listo", "Entregado", "Anulado"];
const TABS: ("Todas" | EstadoComanda)[] = ["Todas", ...ESTADOS];

const servicios = ["Doméstica y Particular", "Industrial / Empresa", "Retiro a Domicilio"];

const prendasTotales = (c: Comanda) => c.detalle.reduce((s, d) => s + d.cantidad, 0);
const valorTotal = (c: Comanda) => c.detalle.reduce((s, d) => s + d.cantidad * d.precioUnitario, 0);

// Map de tipos DB a UI
export interface Comanda {
  id: string; // numeroComanda publico, ej. "COBRE-2848"
  cliente: string;
  tipoCliente: TipoCliente;
  telefono: string;
  email: string;
  direccion?: string;
  servicio: string;
  detalle: PrendaLinea[];
  fechaRecepcion: string;
  fechaEntregaEstimada?: string;
  etapaActual: number | null;
  estado: EstadoComanda;
  operario?: string;
  recepcionista?: string;
  observaciones?: string;
  horasEnEtapa?: number;
  motivoAnulacion?: string;
}

type FormLinea = PrendaLinea;
type FormState = {
  cliente: string;
  tipoCliente: TipoCliente;
  telefono: string;
  email: string;
  direccion: string;
  servicio: string;
  detalle: FormLinea[];
};

const emptyForm: FormState = {
  cliente: "",
  tipoCliente: TipoCliente.PARTICULAR,
  telefono: "",
  email: "",
  direccion: "",
  servicio: servicios[0],
  detalle: [{ tipoPrenda: "", servicio: "Lavado", cantidad: 1, precioUnitario: 1000 }],
};

export default function ComandasPage() {
  const permitido = useRoleGuard(["admin", "recepcionista"]);

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Todas");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<GetComandasData | null>(null);
  const [catData, setCatData] = useState<GetCatalogosComandaData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resComandas, resCatalogos] = await Promise.all([
        getComandas(dataConnect),
        getCatalogosComanda(dataConnect)
      ]);
      setData(resComandas.data);
      setCatData(resCatalogos.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = fetchData;

  const comandas: Comanda[] = useMemo(() => {
    return (data?.comandas || []).map((c) => ({
      id: c.numeroComanda,
      cliente: c.cliente.nombre,
      tipoCliente: c.cliente.tipoCliente as TipoCliente,
      telefono: c.cliente.telefono || "",
      email: c.cliente.email || "",
      direccion: c.cliente.direccion || "",
      servicio: c.comandaDetalles_on_comanda[0]?.tipoServicio.nombre || "Lavado",
      detalle: c.comandaDetalles_on_comanda.map((d) => ({
        tipoPrenda: d.tipoPrenda.nombre,
        servicio: d.tipoServicio.nombre,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      })),
      fechaRecepcion: new Date(c.fechaRecepcion).toLocaleDateString("es-CL"),
      fechaEntregaEstimada: c.fechaEntregaEstimada ? new Date(c.fechaEntregaEstimada).toLocaleDateString("es-CL") : undefined,
      etapaActual: c.estado === ComandaEstado.EN_PROCESO ? 1 : null,
      estado: (c.estado === ComandaEstado.PENDIENTE ? "Pendiente" :
               c.estado === ComandaEstado.EN_PROCESO ? "En proceso" :
               c.estado === ComandaEstado.FINALIZADA ? "Listo" :
               c.estado === ComandaEstado.ENTREGADA ? "Entregado" : "Anulado") as EstadoComanda,
      motivoAnulacion: c.motivoAnulacion || undefined,
      observaciones: c.observaciones || undefined,
    }));
  }, [data]);

  const [detalle, setDetalle] = useState<Comanda | null>(null);
  const [form, setForm] = useState<{ mode: "crear" } | { mode: "editar"; id: string } | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [anular, setAnular] = useState<Comanda | null>(null);
  const [motivo, setMotivo] = useState("");

  const filtered = useMemo(
    () =>
      comandas.filter((c) => {
        const matchTab = activeTab === "Todas" || c.estado === activeTab;
        const term = search.toLowerCase();
        const matchSearch =
          c.id.toLowerCase().includes(term) || c.cliente.toLowerCase().includes(term);
        return matchTab && matchSearch;
      }),
    [comandas, activeTab, search],
  );

  const tabCount = (tab: (typeof TABS)[number]) =>
    tab === "Todas" ? comandas.length : comandas.filter((c) => c.estado === tab).length;

  const totalFiltrado = filtered.reduce((s, c) => s + valorTotal(c), 0);

  if (!permitido || loading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  /* ── form helpers ── */
  const openCrear = () => {
    setFormData(emptyForm);
    setForm({ mode: "crear" });
  };
  const openEditar = (c: Comanda) => {
    setDetalle(null);
    setFormData({
      cliente: c.cliente,
      tipoCliente: c.tipoCliente,
      telefono: c.telefono,
      email: c.email,
      direccion: c.direccion ?? "",
      servicio: c.servicio,
      detalle: c.detalle.map((d) => ({ ...d })),
    });
    setForm({ mode: "editar", id: c.id });
  };

  const guardar = async () => {
    const detalleLimpio = formData.detalle.filter((d) => d.tipoPrenda.trim());
    if (!formData.cliente.trim() || detalleLimpio.length === 0) return;

    setIsSubmitting(true);
    try {
      if (form?.mode === "crear") {
        const formTotal = detalleLimpio.reduce((s, d) => s + d.cantidad * d.precioUnitario, 0);
        const numero = `COBRE-${Math.floor(2849 + Math.random() * 9000)}`;
        
        const clienteId = catData?.clientes.find(c => c.nombre === formData.cliente)?.id || catData?.clientes[0]?.id;
        
        if (clienteId) {
          const res = await crearComanda(dataConnect, {
            numeroComanda: numero,
            clienteId,
            valorTotal: formTotal,
            observaciones: "Ingresado via web"
          });
          
          const newComandaId = res.data.comanda_insert.id;
          
          for (const d of detalleLimpio) {
            const tpId = catData?.tipoPrendas.find(tp => tp.nombre.toLowerCase() === d.tipoPrenda.toLowerCase())?.id || catData?.tipoPrendas[0]?.id;
            const tsId = catData?.tipoServicios.find(ts => ts.nombre === d.servicio)?.id || catData?.tipoServicios[0]?.id;
            
            if (tpId && tsId) {
              await agregarComandaDetalle(dataConnect, {
                comandaId: newComandaId,
                tipoPrendaId: tpId,
                tipoServicioId: tsId,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario,
                subtotal: d.cantidad * d.precioUnitario
              });
            }
          }
        }
      }
      // TODO: Modo Editar (Requiere mutacion EditarComanda)
      
      await refetch();
      setForm(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar la comanda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmarAnular = async () => {
    if (!anular) return;
    setIsSubmitting(true);
    try {
      const comandaOriginal = data?.comandas.find(c => c.numeroComanda === anular.id);
      if (comandaOriginal) {
        await anularComanda(dataConnect, {
          id: comandaOriginal.id,
          motivoAnulacion: motivo.trim() || "Anulación sin motivo"
        });
        await refetch();
      }
    } catch (err) {
      console.error(err);
      alert("Error al anular la comanda.");
    } finally {
      setIsSubmitting(false);
      setAnular(null);
      setMotivo("");
      setDetalle(null);
    }
  };

  const updateLinea = (i: number, patch: Partial<FormLinea>) =>
    setFormData((f) => ({
      ...f,
      detalle: f.detalle.map((d, idx) => (idx === i ? { ...d, ...patch } : d)),
    }));

  const formTotal = formData.detalle.reduce((s, d) => s + d.cantidad * d.precioUnitario, 0);

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">Comandas</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {comandas.length} órdenes · {clp(comandas.reduce((s, c) => s + valorTotal(c), 0))} CLP
          </p>
        </div>
        <button
          onClick={openCrear}
          className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg hover:scale-[1.02] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Comanda
        </button>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {ESTADOS.map((e, i) => {
          const sc = estadoConfig[e];
          return (
            <motion.div
              key={e}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-panel rounded-2xl p-4 shadow-sm dark:shadow-none"
            >
              <p className={`text-2xl font-display font-extrabold ${sc.text}`}>
                {comandas.filter((c) => c.estado === e).length}
              </p>
              <p className="text-stone-500 dark:text-stone-500 text-xs mt-1">{e}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-4 space-y-3 shadow-sm dark:shadow-none"
      >
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-brand-500 text-white shadow-md"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              {tab}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab ? "bg-white/20" : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-500"
                }`}
              >
                {tabCount(tab)}
              </span>
            </button>
          ))}
        </div>
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Buscar por comanda o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/50 transition-colors"
          />
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-panel rounded-2xl overflow-hidden shadow-sm dark:shadow-none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-stone-800/50">
                {["Comanda", "Cliente", "Servicio", "Prendas", "Fecha", "Estado", "Monto", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((c) => {
                  const sc = estadoConfig[c.estado];
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.18 }}
                      className="border-b border-stone-100 dark:border-white/5 last:border-0 hover:bg-stone-50 dark:hover:bg-white/2 transition-colors group cursor-pointer"
                      onClick={() => setDetalle(c)}
                    >
                      <td className="px-4 py-3 font-bold text-stone-700 dark:text-stone-200">{c.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-stone-700 dark:text-stone-200 font-semibold">{c.cliente}</p>
                        <p className="text-stone-400 dark:text-stone-600 text-[10px]">{c.telefono}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-500 dark:text-stone-400">{c.servicio}</td>
                      <td className="px-4 py-3 text-stone-500 dark:text-stone-400 text-center">{prendasTotales(c)}</td>
                      <td className="px-4 py-3 text-stone-400 dark:text-stone-500 whitespace-nowrap">{c.fechaRecepcion}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-stone-700 dark:text-stone-200">{clp(valorTotal(c))}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setDetalle(c)} className="p-1.5 rounded-lg text-stone-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/10 transition-colors" title="Ver detalle">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {c.estado !== "Anulado" && (
                            <button onClick={() => openEditar(c)} className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 transition-colors" title="Editar">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {c.estado !== "Anulado" && c.estado !== "Entregado" && (
                            <button onClick={() => setAnular(c)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Anular">
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-400 dark:text-stone-600 text-sm">
                    No se encontraron comandas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
          <p className="text-stone-400 dark:text-stone-600 text-xs">{filtered.length} resultados</p>
          <p className="text-stone-500 dark:text-stone-400 text-xs font-bold">
            Total: <span className="text-brand-600 dark:text-brand-400">{clp(totalFiltrado)} CLP</span>
          </p>
        </div>
      </motion.div>

      {/* Detalle modal (QR + comprobante) */}
      <AnimatePresence>
        {detalle && (
          <ComandaDetalle
            comanda={detalle as any}
            onClose={() => setDetalle(null)}
            onEditar={(c) => openEditar(c as any)}
            onAnular={(c) => {
              setDetalle(null);
              setAnular(c as any);
            }}
          />
        )}
      </AnimatePresence>

      {/* Crear / Editar modal */}
      <AnimatePresence>
        {form && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setForm(null)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-6 sm:p-8 w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setForm(null)} className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display mb-6">
                {form.mode === "crear" ? "Nueva Comanda" : "Editar Comanda"}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Cliente</label>
                    <GlassSelect
                      value={formData.cliente}
                      onChange={(v) => {
                        const c = catData?.clientes.find(cli => cli.nombre === v);
                        setFormData({ 
                          ...formData, 
                          cliente: v,
                          telefono: c?.telefono || formData.telefono,
                          email: c?.email || formData.email,
                          direccion: c?.direccion || formData.direccion
                        });
                      }}
                      ariaLabel="Seleccionar cliente"
                      options={(catData?.clientes || []).map((c) => ({ value: c.nombre, label: c.nombre }))}
                    />
                  </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Tipo</label>
                      <GlassSelect
                        value={formData.tipoCliente}
                        onChange={(v) => setFormData({ ...formData, tipoCliente: v as TipoCliente })}
                        ariaLabel="Tipo de cliente"
                        options={[
                          { value: TipoCliente.PARTICULAR, label: "Particular" },
                          { value: TipoCliente.HOTEL, label: "Hotel/Empresa" },
                        ]}
                      />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldInput label="Teléfono" value={formData.telefono} onChange={(v) => setFormData({ ...formData, telefono: v })} placeholder="+56 9 ..." />
                  <FieldInput label="Correo" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="correo@ejemplo.com" />
                </div>
                <FieldInput label="Dirección" value={formData.direccion} onChange={(v) => setFormData({ ...formData, direccion: v })} placeholder="Dirección de retiro / entrega" />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Servicio</label>
                  <GlassSelect
                    value={formData.servicio}
                    onChange={(v) => setFormData({ ...formData, servicio: v })}
                    ariaLabel="Servicio"
                    options={servicios.map((s) => ({ value: s, label: s }))}
                  />
                </div>

                {/* Detalle lines */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Prendas</label>
                    <button
                      onClick={() => setFormData({ ...formData, detalle: [...formData.detalle, { tipoPrenda: "", servicio: "Lavado", cantidad: 1, precioUnitario: 1000 }] })}
                      className="text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>
                  {formData.detalle.map((d, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={d.tipoPrenda} onChange={(e) => updateLinea(i, { tipoPrenda: e.target.value })} placeholder="Prenda" className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-brand-500" />
                      <input type="number" min={1} value={d.cantidad} onChange={(e) => updateLinea(i, { cantidad: Math.max(1, +e.target.value) })} className="w-14 px-2 py-2 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs text-center focus:outline-none focus:border-brand-500" />
                      <input type="number" min={0} step={100} value={d.precioUnitario} onChange={(e) => updateLinea(i, { precioUnitario: Math.max(0, +e.target.value) })} className="w-20 px-2 py-2 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs text-center focus:outline-none focus:border-brand-500" />
                      {formData.detalle.length > 1 && (
                        <button onClick={() => setFormData({ ...formData, detalle: formData.detalle.filter((_, idx) => idx !== i) })} className="p-1.5 text-stone-400 hover:text-red-500 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-right text-xs font-bold text-stone-500 dark:text-stone-400">
                    Total: <span className="text-brand-600 dark:text-brand-400">{clp(formTotal)}</span>
                  </p>
                </div>

                <button onClick={guardar} className="w-full bg-gradient-brand text-white py-3 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all cursor-pointer">
                  {form.mode === "crear" ? "Crear Comanda" : "Guardar Cambios"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Anular modal */}
      <AnimatePresence>
        {anular && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAnular(null)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-6 w-full max-w-md relative z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 dark:text-white">Anular {anular.id}</h3>
                  <p className="text-xs text-stone-500">Esta acción marca la comanda como anulada.</p>
                </div>
              </div>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Motivo de la anulación..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-red-400 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setAnular(null)} className="flex-1 bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-200 py-2.5 rounded-xl font-bold text-sm cursor-pointer">Cancelar</button>
                <button onClick={confirmarAnular} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors cursor-pointer">Anular comanda</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500 text-sm font-medium"
      />
    </div>
  );
}
