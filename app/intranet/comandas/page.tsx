"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
  Check,
} from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import ComandaDetalle from "@/components/intranet/ComandaDetalle";
import GlassSelect from "@/components/ui/GlassSelect";
import {
  estadoConfig,
  type EstadoComanda,
  type PrendaLinea,
  type Comanda as MockComanda,
} from "@/lib/mock/comandas";
import { dataConnect } from "@/lib/firebase/client";
import { executeMutation, executeQuery, mutationRef, queryRef } from "firebase/data-connect";
import { 
  TipoCliente, 
  ComandaEstado,
  getCatalogosComanda,
  crearComanda,
  agregarComandaDetalle,
  editarComanda,
  eliminarDetallesComanda,
  anularComanda,
  entregarComanda,
  crearTipoPrenda,
  crearTipoServicio,
  type GetComandasData,
  type GetComandasVariables,
  type GetCatalogosComandaData
} from "@/src/dataconnect-generated";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;
const ESTADOS: EstadoComanda[] = ["Pendiente", "En proceso", "Listo", "Entregado", "Anulado"];
const TABS: ("Todas" | EstadoComanda)[] = ["Todas", ...ESTADOS];
const PAGE_SIZE = 8;
const PRENDAS_FORMULARIO = [
  "CHAQUETA",
  "GEÓLOGO",
  "GORRO/CAPUCHÓN",
  "CAMISA",
  "PANTALÓN",
  "POLERA",
  "TOALLA",
  "CALCETA",
  "BOLSO",
  "BOXER",
  "POLERÓN",
  "PIJAMA",
] as const;
const PRENDAS_HOTEL = [
  "TOALLA BAÑO", "TOALLA MANO", "TOALLA PISO", "TOALLA FACIAL",
  "SÁBANAS KING / MATRIMONIO", "FUNDAS KING",
  "SÁBANAS 1 1/2 PLAZA / TWIN / SOLTERO", "FUNDAS 1 1/2 PLAZA / QUEEN",
  "FUNDAS CON CIERRE", "DUVET KING / MATRIMONIO",
  "DUVET 1 1/2 PLAZA / SOLTERO", "ALMOHADA", "CORTINA", "VISILLO",
  "PLUMÓN / COBERTOR", "FRAZADAS", "CUBRE COLCHÓN", "MANTEL", "CARPETA",
  "FUNDA SILLA", "FUNDA MESA", "SERVILLETA", "AVIÓN",
] as const;

const normalizarCatalogo = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("es-CL");

const generarNumeroComanda = () => {
  const alfabeto = "0123456789abcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const sufijo = Array.from(bytes, (byte) => alfabeto[byte % alfabeto.length]).join("");
  return `ELCOBRE-${sufijo}`;
};

const leerDetalleHotel = (value?: string | null) => {
  const match = value?.match(/^Entregado: \d+ · Recibido: (\d+) · Pendiente: \d+(?: · (.*))?$/);
  return { recibido: match ? Number(match[1]) : 0, observacion: match?.[2] || value || "" };
};

type CrearClienteComandaData = { cliente_insert: { id: string } };
type CrearClienteComandaVariables = {
  nombre: string;
  tipoCliente: TipoCliente;
  telefono?: string;
  email?: string;
  direccion?: string;
};

const prendasTotales = (c: Comanda) => c.detalle.reduce((s, d) => s + d.cantidad, 0);
const valorTotal = (c: Comanda) => c.valorTotal;

// Map de tipos DB a UI
export interface Comanda {
  id: string; // numeroComanda público, ej. "ELCOBRE-14r3"
  dbId: string; // UUID interno; nunca se muestra al usuario
  cliente: string;
  empresa?: string;
  proyecto?: string;
  tipoCliente: TipoCliente;
  telefono: string;
  email: string;
  direccion?: string;
  servicio: string;
  detalle: PrendaLinea[];
  valorTotal: number;
  fechaRecepcion: string;
  fechaRecepcionIso: string;
  fechaEntregaEstimada?: string;
  etapaActual: number | null;
  estado: EstadoComanda;
  operario?: string;
  recepcionista?: string;
  observaciones?: string;
  horasEnEtapa?: number;
  motivoAnulacion?: string;
}

type FormLinea = PrendaLinea & { detalle: string; recibido: number };
type FormState = {
  clienteId: string;
  cliente: string;
  empresa: string;
  proyecto: string;
  tipoCliente: TipoCliente;
  telefono: string;
  email: string;
  direccion: string;
  servicio: string;
  detalle: FormLinea[];
  observaciones: string;
};

const emptyForm: FormState = {
  clienteId: "",
  cliente: "",
  empresa: "",
  proyecto: "",
  tipoCliente: TipoCliente.PARTICULAR,
  telefono: "",
  email: "",
  direccion: "",
  servicio: "",
  detalle: [{ tipoPrenda: "", servicio: "Lavado", cantidad: 1, precioUnitario: 1000, detalle: "", recibido: 0 }],
  observaciones: "",
};

export default function ComandasPage() {
  const permitido = useRoleGuard(["admin", "recepcionista"]);

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Todas");
  const [search, setSearch] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<GetComandasData | null>(null);
  const [catData, setCatData] = useState<GetCatalogosComandaData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const estado = activeTab === "Todas" ? undefined :
        activeTab === "Pendiente" ? ComandaEstado.PENDIENTE :
        activeTab === "En proceso" ? ComandaEstado.EN_PROCESO :
        activeTab === "Listo" ? ComandaEstado.FINALIZADA :
        activeTab === "Entregado" ? ComandaEstado.ENTREGADA : ComandaEstado.ANULADA;
      const [resComandas, resCatalogos] = await Promise.all([
        executeQuery(queryRef<GetComandasData, GetComandasVariables>(
          dataConnect,
          "GetComandasPaginadas",
          {
            limit: PAGE_SIZE,
            offset: (page - 1) * PAGE_SIZE,
            estado,
            cliente: search.trim() || undefined,
            fechaDesde: fechaDesde ? `${fechaDesde}T00:00:00.000-04:00` : undefined,
            fechaHasta: fechaHasta ? `${fechaHasta}T23:59:59.999-04:00` : undefined,
          },
        )),
        getCatalogosComanda(dataConnect)
      ]);
      setData(resComandas.data);
      setCatData(resCatalogos.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fechaDesde, fechaHasta, page, search]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const refetch = fetchData;

  const comandas: Comanda[] = useMemo(() => {
    return (data?.comandas || []).map((c) => ({
      id: c.numeroComanda,
      dbId: c.id,
      cliente: c.cliente.nombre,
      empresa: c.empresa || undefined,
      proyecto: c.proyecto || undefined,
      tipoCliente: c.cliente.tipoCliente as TipoCliente,
      telefono: c.cliente.telefono || "",
      email: c.cliente.email || "",
      direccion: c.cliente.direccion || "",
      servicio: c.comandaDetalles_on_comanda[0]?.tipoServicio.nombre || "Lavado",
      detalle: c.comandaDetalles_on_comanda.map((d) => ({
        tipoPrenda: [...PRENDAS_FORMULARIO, ...PRENDAS_HOTEL].find(
          (nombre) => normalizarCatalogo(nombre) === normalizarCatalogo(d.tipoPrenda.nombre),
        ) || d.tipoPrenda.nombre,
        servicio: d.tipoServicio.nombre,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        detalle: d.detalle || "",
      })),
      valorTotal: c.valorTotal,
      fechaRecepcion: new Date(c.fechaRecepcion).toLocaleDateString("es-CL"),
      fechaRecepcionIso: new Date(c.fechaRecepcion).toISOString().slice(0, 10),
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
  const [nuevoCliente, setNuevoCliente] = useState(false);

  const filtered = comandas;
  const totalResultados = data?.total[0]?._count ?? comandas.length;
  const totalPages = Math.max(1, Math.ceil(totalResultados / PAGE_SIZE));
  const pageItems = filtered;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const stateCounts: Record<EstadoComanda, number> = {
    Pendiente: data?.pendientes[0]?._count ?? 0,
    "En proceso": data?.enProceso[0]?._count ?? 0,
    Listo: data?.finalizadas[0]?._count ?? 0,
    Entregado: data?.entregadas[0]?._count ?? 0,
    Anulado: data?.anuladas[0]?._count ?? 0,
  };
  const totalGlobal = Object.values(stateCounts).reduce((sum, count) => sum + count, 0);
  const tabCount = (tab: (typeof TABS)[number]) => tab === "Todas" ? totalGlobal : stateCounts[tab];

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
    const servicio = catData?.tipoServicios[0];
    const cliente = catData?.clientes[0];
    const prendas = cliente?.tipoCliente === TipoCliente.HOTEL ? PRENDAS_HOTEL : PRENDAS_FORMULARIO;
    setFormData({
      ...emptyForm,
      clienteId: cliente?.id || "",
      cliente: cliente?.nombre || "",
      tipoCliente: cliente?.tipoCliente || TipoCliente.PARTICULAR,
      servicio: servicio?.nombre || "",
      detalle: [{
        tipoPrenda: prendas[0],
        servicio: servicio?.nombre || "",
        cantidad: 1,
        precioUnitario: servicio?.precioBase || 0,
        detalle: "",
        recibido: 0,
      }],
    });
    setNuevoCliente((catData?.clientes.length ?? 0) === 0);
    setForm({ mode: "crear" });
  };
  const openEditar = (c: Comanda) => {
    setDetalle(null);
    setNuevoCliente(false);
    setFormData({
      cliente: c.cliente,
      empresa: c.empresa || "",
      proyecto: c.proyecto || "",
      tipoCliente: c.tipoCliente,
      telefono: c.telefono,
      email: c.email,
      direccion: c.direccion ?? "",
      clienteId: catData?.clientes.find((cliente) => cliente.nombre === c.cliente)?.id || "",
      servicio: c.servicio,
      detalle: c.detalle.map((d) => {
        const hotel = leerDetalleHotel(d.detalle);
        return { ...d, detalle: c.tipoCliente === TipoCliente.HOTEL ? hotel.observacion : d.detalle || "", recibido: hotel.recibido };
      }),
      observaciones: c.observaciones || "",
    });
    setForm({ mode: "editar", id: c.dbId });
  };

  const guardar = async () => {
    const detalleLimpio = formData.detalle.filter((d) => d.tipoPrenda.trim());
    if (!formData.cliente.trim() || detalleLimpio.length === 0) {
      alert("Selecciona un cliente y agrega al menos una prenda.");
      return;
    }

    setIsSubmitting(true);
    try {
      // El formulario puede conservar un catálogo anterior en memoria después
      // de un intento parcial. Forzar lectura de red evita recrear nombres que
      // ya existen y chocan con sus índices únicos.
      const catalogosActuales = (await getCatalogosComanda(dataConnect, { fetchPolicy: "SERVER_ONLY" })).data;
      setCatData(catalogosActuales);
      const tiposPrendaResueltos = new Map(
        catalogosActuales.tipoPrendas.map((tipo) => [normalizarCatalogo(tipo.nombre), tipo.id]),
      );
      const resolverTipoPrendaId = async (nombre: string) => {
        const clave = normalizarCatalogo(nombre);
        const existente = tiposPrendaResueltos.get(clave);
        if (existente) return existente;
        const creado = await crearTipoPrenda(dataConnect, { nombre });
        const id = creado.data.tipoPrenda_insert.id;
        tiposPrendaResueltos.set(clave, id);
        return id;
      };
      const tiposServicioResueltos = new Map(
        catalogosActuales.tipoServicios.map((tipo) => [normalizarCatalogo(tipo.nombre), tipo.id]),
      );
      const resolverTipoServicioId = async (nombre?: string) => {
        const nombreResuelto = nombre?.trim() || "Lavado";
        const clave = normalizarCatalogo(nombreResuelto);
        const existente = tiposServicioResueltos.get(clave);
        if (existente) return existente;
        const creado = await crearTipoServicio(dataConnect, { nombre: nombreResuelto, precioBase: 0 });
        const id = creado.data.tipoServicio_insert.id;
        tiposServicioResueltos.set(clave, id);
        return id;
      };
      // Resolver primero todas las claves foráneas. Así nunca se crea una
      // cabecera de comanda si sus prendas no pueden relacionarse.
      const lineasResueltas = await Promise.all(
        detalleLimpio.map(async (linea) => ({
          linea,
          tipoPrendaId: await resolverTipoPrendaId(linea.tipoPrenda),
          tipoServicioId: await resolverTipoServicioId(linea.servicio),
        })),
      );

      if (form?.mode === "crear") {
        const formTotal = detalleLimpio.reduce((s, d) => s + d.cantidad * d.precioUnitario, 0);
        const numero = generarNumeroComanda();
        
        let clienteId = formData.clienteId;

        if (nuevoCliente) {
          const variables: CrearClienteComandaVariables = {
            nombre: formData.cliente.trim(),
            tipoCliente: formData.tipoCliente,
            telefono: formData.telefono.trim() || undefined,
            email: formData.email.trim() || undefined,
            direccion: formData.direccion.trim() || undefined,
          };
          const clienteRef = mutationRef<CrearClienteComandaData, CrearClienteComandaVariables>(
            dataConnect,
            "CrearClienteComanda",
            variables,
          );
          const clienteCreado = await executeMutation(clienteRef);
          clienteId = clienteCreado.data.cliente_insert.id;
        }
        
        if (clienteId) {
          const res = await crearComanda(dataConnect, {
            numeroComanda: numero,
            clienteId,
            empresa: formData.empresa.trim() || undefined,
            proyecto: formData.proyecto.trim() || undefined,
            valorTotal: formTotal,
            observaciones: formData.observaciones.trim() || undefined,
          });
          
          const newComandaId = res.data.comanda_insert.id;
          
          for (const { linea: d, tipoPrendaId, tipoServicioId } of lineasResueltas) {
              await agregarComandaDetalle(dataConnect, {
                comandaId: newComandaId,
                tipoPrendaId,
                tipoServicioId,
                cantidad: d.cantidad,
                detalle: formData.tipoCliente === TipoCliente.HOTEL
                  ? `Entregado: ${d.cantidad} · Recibido: ${d.recibido} · Pendiente: ${Math.max(0, d.cantidad - d.recibido)}${d.detalle.trim() ? ` · ${d.detalle.trim()}` : ""}`
                  : d.detalle.trim() || undefined,
                precioUnitario: d.precioUnitario,
                subtotal: d.cantidad * d.precioUnitario
              });
          }
        } else {
          throw new Error("El cliente seleccionado no existe en el catálogo.");
        }
        } else if (form?.mode === "editar") {
          const formTotal = detalleLimpio.reduce((s, d) => s + d.cantidad * d.precioUnitario, 0);
          
          await editarComanda(dataConnect, {
            id: form.id,
            empresa: formData.empresa.trim() || undefined,
            proyecto: formData.proyecto.trim() || undefined,
            valorTotal: formTotal,
            observaciones: formData.observaciones.trim() || undefined,
          });

          await eliminarDetallesComanda(dataConnect, { comandaId: form.id });

          for (const { linea: d, tipoPrendaId, tipoServicioId } of lineasResueltas) {
              await agregarComandaDetalle(dataConnect, {
                comandaId: form.id,
                tipoPrendaId,
                tipoServicioId,
                cantidad: d.cantidad,
                detalle: formData.tipoCliente === TipoCliente.HOTEL
                  ? `Entregado: ${d.cantidad} · Recibido: ${d.recibido} · Pendiente: ${Math.max(0, d.cantidad - d.recibido)}${d.detalle.trim() ? ` · ${d.detalle.trim()}` : ""}`
                  : d.detalle.trim() || undefined,
                precioUnitario: d.precioUnitario,
                subtotal: d.cantidad * d.precioUnitario
              });
          }
        }
        
        await refetch();
      setNotice(form?.mode === "crear" ? "Comanda creada correctamente." : "Comanda actualizada correctamente.");
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
      const comandaOriginal = data?.comandas.find(c => c.id === anular.dbId);
      if (comandaOriginal) {
        await anularComanda(dataConnect, {
          id: comandaOriginal.id,
          motivoAnulacion: motivo.trim() || "Anulación sin motivo"
        });
        await refetch();
        setNotice(`Comanda ${anular.id} anulada correctamente.`);
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
            {totalGlobal} órdenes · mostrando {comandas.length} en esta página
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
                {stateCounts[e]}
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
              onClick={() => { setActiveTab(tab); setPage(1); }}
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
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-end">
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Buscar por comanda o cliente..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
            <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <label className="space-y-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Desde
            <input type="date" value={fechaDesde} max={fechaHasta || undefined} onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }} className="block rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs normal-case dark:border-white/10 dark:bg-stone-800" />
          </label>
          <label className="space-y-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Hasta
            <input type="date" value={fechaHasta} min={fechaDesde || undefined} onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }} className="block rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs normal-case dark:border-white/10 dark:bg-stone-800" />
          </label>
          {(fechaDesde || fechaHasta) && (
            <button onClick={() => { setFechaDesde(""); setFechaHasta(""); setPage(1); }} className="rounded-xl px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-500/10">Limpiar fechas</button>
          )}
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
                {pageItems.map((c) => {
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
                          {c.estado === "Pendiente" && (
                            <button onClick={() => openEditar(c)} className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 transition-colors" title="Editar">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {c.estado !== "Anulado" && c.estado !== "Entregado" && (
                              <button onClick={() => setAnular(c)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Anular">
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {c.estado === "Listo" ? (
                            <button onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm(`¿Marcar la comanda ${c.id} como Entregada?`)) {
                                try {
                                  await entregarComanda(dataConnect, { id: c.dbId });
                                  await refetch();
                                  setNotice(`Comanda ${c.id} entregada correctamente. Se registró la fecha y el historial.`);
                                } catch (error) {
                                  console.error(error);
                                  alert("No se pudo marcar la comanda como entregada.");
                                }
                              }
                            }} className="p-1.5 rounded-lg text-stone-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/10 transition-colors" title="Marcar como entregada">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
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
        <div className="px-4 py-3 border-t border-stone-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-stone-400 dark:text-stone-600 text-xs">{totalResultados} resultados · Página {page} de {totalPages}</p>
          <p className="text-stone-500 dark:text-stone-400 text-xs font-bold">
            Total página: <span className="text-brand-600 dark:text-brand-400">{clp(totalFiltrado)} CLP</span>
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-bold disabled:opacity-40 dark:border-white/10">Anterior</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-bold disabled:opacity-40 dark:border-white/10">Siguiente</button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {notice && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} role="status" className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-xl">
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detalle modal (QR + comprobante) */}
      <AnimatePresence>
        {detalle && (
          <ComandaDetalle
            comanda={detalle as unknown as MockComanda}
            onClose={() => setDetalle(null)}
            onEditar={(c) => {
              const original = comandas.find((item) => item.id === c.id);
              if (original) openEditar(original);
            }}
            onAnular={(c) => {
              setDetalle(null);
              const original = comandas.find((item) => item.id === c.id);
              if (original) setAnular(original);
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
              className="glass-panel rounded-3xl p-6 sm:p-8 w-full max-w-4xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setForm(null)} className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display mb-6">
                {form.mode === "crear" ? "Nueva Comanda" : "Editar Comanda"}
              </h3>

              <div className="mb-4 flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs dark:border-white/10 dark:bg-stone-800">
                <span className="font-extrabold uppercase tracking-wider text-stone-500">Formulario de recepción</span>
                <span><strong>Fecha:</strong> {new Date().toLocaleDateString("es-CL")}</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Cliente</label>
                    <GlassSelect
                      value={nuevoCliente ? "__nuevo__" : formData.clienteId}
                      onChange={(v) => {
                        if (v === "__nuevo__") {
                          setNuevoCliente(true);
                          setFormData({ ...formData, clienteId: "", cliente: "", telefono: "", email: "", direccion: "" });
                          return;
                        }
                        const c = catData?.clientes.find(cli => cli.id === v);
                        const prendas = c?.tipoCliente === TipoCliente.HOTEL ? PRENDAS_HOTEL : PRENDAS_FORMULARIO;
                        setNuevoCliente(false);
                        setFormData({ 
                          ...formData, 
                          clienteId: c?.id || "",
                          cliente: c?.nombre || "",
                          tipoCliente: c?.tipoCliente || TipoCliente.PARTICULAR,
                          telefono: c?.telefono || "",
                          email: c?.email || "",
                          direccion: c?.direccion || "",
                          detalle: formData.detalle.map((linea, index) => ({
                            ...linea,
                            tipoPrenda: index === 0 ? prendas[0] : linea.tipoPrenda,
                            recibido: c?.tipoCliente === TipoCliente.HOTEL ? linea.recibido : 0,
                          })),
                        });
                      }}
                      ariaLabel="Seleccionar cliente"
                      options={[
                        ...(catData?.clientes || []).map((c) => ({ value: c.id, label: c.nombre })),
                        { value: "__nuevo__", label: "+ Registrar cliente nuevo" },
                      ]}
                    />
                  </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Tipo</label>
                      <GlassSelect
                        value={formData.tipoCliente}
                        onChange={(v) => {
                          const tipoCliente = v as TipoCliente;
                          const prendas = tipoCliente === TipoCliente.HOTEL ? PRENDAS_HOTEL : PRENDAS_FORMULARIO;
                          setFormData({
                            ...formData,
                            tipoCliente,
                            detalle: formData.detalle.map((linea, index) => ({
                              ...linea,
                              tipoPrenda: index === 0 ? prendas[0] : linea.tipoPrenda,
                              recibido: tipoCliente === TipoCliente.HOTEL ? linea.recibido : 0,
                            })),
                          });
                        }}
                        ariaLabel="Tipo de cliente"
                        options={[
                          { value: TipoCliente.PARTICULAR, label: "Particular / Empresa" },
                          { value: TipoCliente.HOTEL, label: "Hotel" },
                        ]}
                      />
                    </div>
                </div>
                {nuevoCliente && (
                  <FieldInput label="Nombre del cliente" value={formData.cliente} onChange={(v) => setFormData({ ...formData, cliente: v })} placeholder="Nombre o razón social" />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldInput label="Empresa" value={formData.empresa} onChange={(v) => setFormData({ ...formData, empresa: v })} placeholder="Empresa o mandante" />
                  <FieldInput label="Proyecto" value={formData.proyecto} onChange={(v) => setFormData({ ...formData, proyecto: v })} placeholder="Proyecto, faena u orden" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldInput label="Teléfono" value={formData.telefono} onChange={(v) => setFormData({ ...formData, telefono: v })} placeholder="+56 9 ..." />
                  <FieldInput label="Correo" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="correo@ejemplo.com" />
                </div>
                <FieldInput label="Dirección" value={formData.direccion} onChange={(v) => setFormData({ ...formData, direccion: v })} placeholder="Dirección de retiro / entrega" />
                {/* Detalle lines */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Prendas</label>
                    <button
                      onClick={() => {
                        const servicio = catData?.tipoServicios[0];
                        const prendas = formData.tipoCliente === TipoCliente.HOTEL ? PRENDAS_HOTEL : PRENDAS_FORMULARIO;
                        setFormData({ ...formData, detalle: [...formData.detalle, { tipoPrenda: prendas[0], servicio: servicio?.nombre || "", cantidad: 1, precioUnitario: servicio?.precioBase || 0, detalle: "", recibido: 0 }] });
                      }}
                      className="text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>
                  <div className={`hidden px-2 text-[9px] font-extrabold uppercase tracking-wider text-stone-400 sm:grid sm:gap-2 ${formData.tipoCliente === TipoCliente.HOTEL ? "sm:grid-cols-[1.4fr_80px_80px_80px_1.2fr_90px_auto]" : "sm:grid-cols-[1.2fr_80px_1.5fr_90px_auto]"}`}>
                    {formData.tipoCliente === TipoCliente.HOTEL ? (
                      <><span>Prenda</span><span>Entregado</span><span>Recibido</span><span>Pendiente</span><span>Observación</span><span>Precio</span><span /></>
                    ) : (
                      <><span>Prenda</span><span>Cantidad</span><span>Detalle</span><span>Precio</span><span /></>
                    )}
                  </div>
                  {formData.detalle.map((d, i) => (
                    <div key={i} className={`grid grid-cols-1 gap-2 rounded-xl border border-stone-200 p-2 sm:items-center dark:border-white/10 ${formData.tipoCliente === TipoCliente.HOTEL ? "sm:grid-cols-[1.4fr_80px_80px_80px_1.2fr_90px_auto]" : "sm:grid-cols-[1.2fr_80px_1.5fr_90px_auto]"}`}>
                      <GlassSelect value={d.tipoPrenda} onChange={(v) => updateLinea(i, { tipoPrenda: v })} ariaLabel="Tipo de prenda" options={(formData.tipoCliente === TipoCliente.HOTEL ? PRENDAS_HOTEL : PRENDAS_FORMULARIO).map((nombre) => ({ value: nombre, label: nombre }))} />
                      <input type="number" min={1} value={d.cantidad} onChange={(e) => updateLinea(i, { cantidad: Math.max(1, +e.target.value) })} className="w-14 px-2 py-2 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs text-center focus:outline-none focus:border-brand-500" />
                      {formData.tipoCliente === TipoCliente.HOTEL && <>
                        <input type="number" min={0} max={d.cantidad} value={d.recibido} onChange={(e) => updateLinea(i, { recibido: Math.min(d.cantidad, Math.max(0, +e.target.value)) })} aria-label="Cantidad recibida" className="w-16 px-2 py-2 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs text-center focus:outline-none focus:border-brand-500" />
                        <output aria-label="Cantidad pendiente" className="w-16 px-2 py-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs text-center font-bold">{Math.max(0, d.cantidad - d.recibido)}</output>
                      </>}
                      <input value={d.detalle} onChange={(e) => updateLinea(i, { detalle: e.target.value })} placeholder="Detalle de la prenda" className="min-w-0 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-200" />
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Observaciones</label>
                  <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} rows={3} placeholder="Observaciones generales de recepción..." className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-200" />
                </div>

                <button onClick={guardar} disabled={isSubmitting} className="w-full bg-gradient-brand text-white py-3 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Guardando..." : form.mode === "crear" ? "Crear Comanda" : "Guardar Cambios"}
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
