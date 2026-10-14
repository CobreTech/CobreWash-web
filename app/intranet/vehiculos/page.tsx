"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Gauge,
  Loader2,
  Navigation,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  Truck,
  User,
  X,
} from "lucide-react";
import { QueryFetchPolicy, subscribe } from "firebase/data-connect";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { dataConnect } from "@/lib/firebase/client";
import {
  editarVehiculoFlota,
  getFlotaVehiculos,
  getFlotaVehiculosRef,
  registrarVehiculoFlota,
  type GetFlotaVehiculosData,
} from "@/src/dataconnect-generated";
import type {
  ConductorFlota,
  EstadoOperativoVehiculo,
  SalidaFlota,
  VehiculoFlota,
  VehiculoFormState,
} from "@/lib/vehiculos/modelo";
import {
  filtrarResumenFlota,
  formatearFechaHoraVehiculo,
  mapearErrorVehiculos,
} from "@/lib/vehiculos/flota";
import {
  construirResumenFlota,
  normalizarPatente,
  validarFormularioVehiculo,
} from "@/lib/vehiculos/validaciones";

type Notice = { text: string; tipo: "success" | "warning" | "error" };

const FORM_VEHICULO_VACIO: VehiculoFormState = {
  patente: "",
  marca: "",
  modelo: "",
  anio: String(new Date().getFullYear()),
  descripcion: "",
  activo: true,
};

const noticeStyle: Record<Notice["tipo"], string> = {
  success:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-stone-900 dark:text-green-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-stone-900 dark:text-amber-300",
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-stone-900 dark:text-red-300",
};

const estadoBadgeStyle: Record<
  EstadoOperativoVehiculo,
  { badge: string; icon: React.ElementType }
> = {
  Disponible: {
    badge: "bg-green-500/10 text-green-700 dark:text-green-400",
    icon: CheckCircle2,
  },
  "En ruta": {
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    icon: Navigation,
  },
  Inactivo: {
    badge: "bg-stone-500/10 text-stone-500 dark:text-stone-400",
    icon: Power,
  },
};

export default function VehiculosPage() {
  const permitido = useRoleGuard(["admin"]);
  const [vehiculos, setVehiculos] = useState<VehiculoFlota[]>([]);
  const [conductores, setConductores] = useState<ConductorFlota[]>([]);
  const [salidas, setSalidas] = useState<SalidaFlota[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "Todos" | EstadoOperativoVehiculo
  >("Todos");
  const [formVehiculo, setFormVehiculo] = useState<VehiculoFormState | null>(
    null,
  );
  const [formError, setFormError] = useState("");
  const solicitudActual = useRef(0);

  const aplicarDatos = useCallback((data: GetFlotaVehiculosData) => {
    setVehiculos(data.vehiculos);
    setConductores(data.conductores);
    setSalidas(data.salidas);
    setLoading(false);
  }, []);

  const cargarFlota = useCallback(
    async (silencioso = false) => {
      const solicitud = ++solicitudActual.current;
      if (!silencioso) setLoading(true);
      try {
        const result = await getFlotaVehiculos(dataConnect, {
          fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
        });
        if (solicitud === solicitudActual.current) aplicarDatos(result.data);
      } catch (error) {
        console.error("No se pudo cargar la flota de vehículos:", error);
        if (!silencioso) {
          setNotice({
            text: "No se pudo cargar la flota de vehículos.",
            tipo: "error",
          });
        }
      } finally {
        if (solicitud === solicitudActual.current) setLoading(false);
      }
    },
    [aplicarDatos],
  );

  useEffect(() => {
    if (!permitido) return;
    const query = getFlotaVehiculosRef(dataConnect);
    const cancelar = subscribe(
      query,
      (result) => aplicarDatos(result.data),
      () => {
        void cargarFlota(true);
      },
    );
    const refrescar = () => void cargarFlota(true);
    const alVolver = () =>
      document.visibilityState === "visible" && refrescar();
    window.addEventListener("focus", refrescar);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      cancelar();
      window.removeEventListener("focus", refrescar);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [aplicarDatos, cargarFlota, permitido]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!formVehiculo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) {
        setFormVehiculo(null);
        setFormError("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formVehiculo, saving]);

  const { resumen, kpis } = useMemo(
    () => construirResumenFlota(vehiculos, salidas),
    [vehiculos, salidas],
  );

  const resumenFiltrado = useMemo(
    () => filtrarResumenFlota(resumen, busqueda, filtroEstado),
    [resumen, busqueda, filtroEstado],
  );

  const abrirNuevoVehiculo = () => {
    setFormError("");
    setFormVehiculo(FORM_VEHICULO_VACIO);
  };

  const abrirEditarVehiculo = (v: VehiculoFlota) => {
    setFormError("");
    setFormVehiculo({
      id: v.id,
      patente: v.patente,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio ? String(v.anio) : "",
      descripcion: v.descripcion ?? "",
      activo: v.activo,
    });
  };

  const guardarVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVehiculo || saving) return;

    const itemActual = formVehiculo.id
      ? resumen.find((r) => r.vehiculo.id === formVehiculo.id)
      : undefined;
    const tieneSalidaActiva = Boolean(itemActual?.salidaActiva);

    const errorValidacion = validarFormularioVehiculo(
      formVehiculo,
      vehiculos,
      tieneSalidaActiva,
    );
    if (errorValidacion) {
      setFormError(errorValidacion);
      return;
    }

    const patenteNorm = normalizarPatente(formVehiculo.patente);
    const anioNum =
      formVehiculo.anio.trim() !== "" ? Number(formVehiculo.anio) : null;
    const descNorm = formVehiculo.descripcion.trim() || null;

    setSaving(true);
    setFormError("");
    try {
      if (formVehiculo.id) {
        await editarVehiculoFlota(dataConnect, {
          id: formVehiculo.id,
          patente: patenteNorm,
          marca: formVehiculo.marca.trim(),
          modelo: formVehiculo.modelo.trim(),
          anio: anioNum,
          descripcion: descNorm,
          activo: formVehiculo.activo,
        });
        setNotice({
          text: `Vehículo ${patenteNorm} actualizado correctamente.`,
          tipo: "success",
        });
      } else {
        await registrarVehiculoFlota(dataConnect, {
          patente: patenteNorm,
          marca: formVehiculo.marca.trim(),
          modelo: formVehiculo.modelo.trim(),
          anio: anioNum,
          descripcion: descNorm,
        });
        setNotice({
          text: `Vehículo ${patenteNorm} incorporado a la flota.`,
          tipo: "success",
        });
      }
      setFormVehiculo(null);
      await cargarFlota(true);
    } catch (error) {
      setFormError(mapearErrorVehiculos(error));
    } finally {
      setSaving(false);
    }
  };

  const alternarActivoVehiculo = async (
    v: VehiculoFlota,
    tieneSalidaActiva: boolean,
  ) => {
    if (saving) return;
    if (v.activo && tieneSalidaActiva) {
      setNotice({
        text: "No se puede desactivar un vehículo que tiene una salida en curso.",
        tipo: "warning",
      });
      return;
    }
    setSaving(true);
    try {
      await editarVehiculoFlota(dataConnect, {
        id: v.id,
        patente: v.patente,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio ?? null,
        descripcion: v.descripcion ?? null,
        activo: !v.activo,
      });
      setNotice({
        text: `Vehículo ${v.patente} ${!v.activo ? "habilitado" : "marcado como inactivo"}.`,
        tipo: "success",
      });
      await cargarFlota(true);
    } catch (error) {
      setNotice({ text: mapearErrorVehiculos(error), tipo: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!permitido) return null;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-500">
            <Truck className="h-3.5 w-3.5" />
            Flota y Reparto
          </span>
          <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
            Control de Vehículos
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Catálogo de unidades de transporte, estado en planta y disponibilidad operativa ({conductores.length} conductores habilitados).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void cargarFlota(false)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Actualizar
          </button>
          <button
            type="button"
            onClick={abrirNuevoVehiculo}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            Registrar vehículo
          </button>
        </div>
      </div>

      {/* Notificación contextual */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium ${noticeStyle[notice.tipo]}`}
          >
            <span>{notice.text}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Cerrar aviso"
              className="ml-3 rounded-lg p-1 opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tarjetas de KPIs de Flota */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-stone-900/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Total Flota
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
            {kpis.total}
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            Unidades registradas
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
            Disponibles en Planta
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-green-700 dark:text-green-300">
            {kpis.disponibles}
          </p>
          <p className="mt-0.5 text-xs text-green-700/80 dark:text-green-400/80">
            Listos para despacho
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            En Ruta
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-700 dark:text-amber-300">
            {kpis.enRuta}
          </p>
          <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/80">
            Con recorrido activo
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-stone-900/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Inactivos / Taller
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-stone-700 dark:text-stone-300">
            {kpis.inactivos}
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            Fuera de operación
          </p>
        </div>
      </div>

      {/* Buscador y filtros por estado */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-stone-900/70">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por patente, marca, modelo o conductor..."
            aria-label="Buscar vehículos"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-stone-800/80 dark:text-stone-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(["Todos", "Disponible", "En ruta", "Inactivo"] as const).map(
            (opcion) => {
              const activo = filtroEstado === opcion;
              return (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => setFiltroEstado(opcion)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activo
                      ? "bg-brand-500 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                  }`}
                >
                  {opcion}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Grilla de vehículos */}
      {loading && vehiculos.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-12 dark:border-white/10 dark:bg-stone-900/70">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          <span className="ml-3 text-sm text-stone-600 dark:text-stone-400">
            Cargando catálogo de flota...
          </span>
        </div>
      ) : resumenFiltrado.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center dark:border-white/10 dark:bg-stone-900/40">
          <Truck className="mx-auto h-10 w-10 text-stone-400" />
          <p className="mt-3 font-semibold text-stone-800 dark:text-stone-200">
            No se encontraron vehículos
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Ajusta el filtro de búsqueda o registra una nueva unidad en la flota.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumenFiltrado.map((item) => {
            const {
              vehiculo,
              estadoOperativo,
              salidaActiva,
              kilometrajeActual,
              totalSalidas,
              ultimaSalida,
            } = item;
            const cfg = estadoBadgeStyle[estadoOperativo];
            const IconoEstado = cfg.icon;

            return (
              <div
                key={vehiculo.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:border-brand-500/40 dark:border-white/10 dark:bg-stone-900/70"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-lg border border-stone-300 bg-stone-100 px-2.5 py-0.5 font-mono text-sm font-bold tracking-wider text-stone-900 dark:border-white/15 dark:bg-stone-800 dark:text-stone-100">
                        {vehiculo.patente}
                      </span>
                      <h2 className="mt-2 font-display text-lg font-bold text-stone-900 dark:text-stone-50">
                        {vehiculo.marca} {vehiculo.modelo}
                        {vehiculo.anio ? ` (${vehiculo.anio})` : ""}
                      </h2>
                      {vehiculo.descripcion && (
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                          {vehiculo.descripcion}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}
                    >
                      <IconoEstado className="h-3.5 w-3.5" />
                      {estadoOperativo}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-stone-50 p-3 text-xs dark:bg-stone-800/60">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">
                        Odómetro actual
                      </span>
                      <p className="mt-0.5 flex items-center gap-1 font-semibold text-stone-900 dark:text-stone-100">
                        <Gauge className="h-3.5 w-3.5 text-brand-500" />
                        {kilometrajeActual.toLocaleString("es-CL")} km
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">
                        Salidas registradas
                      </span>
                      <p className="mt-0.5 font-semibold text-stone-900 dark:text-stone-100">
                        {totalSalidas} {totalSalidas === 1 ? "viaje" : "viajes"}
                      </p>
                    </div>
                  </div>

                  {salidaActiva ? (
                    <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                      <p className="flex items-center gap-1.5 font-semibold">
                        <User className="h-3.5 w-3.5" />
                        Conductor: {salidaActiva.repartidor.nombre}{" "}
                        {salidaActiva.repartidor.apellido ?? ""}
                      </p>
                      <p className="mt-0.5 text-amber-700/80 dark:text-amber-300/80">
                        Salida:{" "}
                        {formatearFechaHoraVehiculo(
                          salidaActiva.fechaSalida ?? salidaActiva.creadoEn,
                        )}
                      </p>
                    </div>
                  ) : (
                    ultimaSalida && (
                      <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
                        Último retorno:{" "}
                        {formatearFechaHoraVehiculo(
                          ultimaSalida.fechaRetorno ?? ultimaSalida.creadoEn,
                        )}
                      </p>
                    )
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-stone-100 pt-3 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => abrirEditarVehiculo(vehiculo)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-white/10 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={saving || Boolean(salidaActiva)}
                    onClick={() =>
                      void alternarActivoVehiculo(
                        vehiculo,
                        Boolean(salidaActiva),
                      )
                    }
                    title={
                      salidaActiva
                        ? "No se puede desactivar mientras está en ruta"
                        : vehiculo.activo
                          ? "Desactivar vehículo"
                          : "Activar vehículo"
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <Power className="h-3.5 w-3.5" />
                    {vehiculo.activo ? "Desactivar" : "Habilitar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Registro / Edición de Vehículo (RF-VE01) */}
      <AnimatePresence>
        {formVehiculo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-vehiculo-titulo"
              className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-stone-900"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-white/10">
                <div>
                  <h2
                    id="modal-vehiculo-titulo"
                    className="font-display text-lg font-bold text-stone-900 dark:text-stone-50"
                  >
                    {formVehiculo.id
                      ? "Editar vehículo de la flota"
                      : "Registrar nuevo vehículo"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Ingresa los datos identificatorios de la unidad de reparto.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormVehiculo(null)}
                  aria-label="Cerrar modal"
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={guardarVehiculo} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="vehiculo-patente"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Patente *
                    </label>
                    <input
                      id="vehiculo-patente"
                      type="text"
                      required
                      maxLength={10}
                      value={formVehiculo.patente}
                      onChange={(e) =>
                        setFormVehiculo({
                          ...formVehiculo,
                          patente: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Ej. HLRT-24"
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 font-mono text-sm uppercase text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vehiculo-anio"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Año
                    </label>
                    <input
                      id="vehiculo-anio"
                      type="number"
                      min={1980}
                      max={2100}
                      value={formVehiculo.anio}
                      onChange={(e) =>
                        setFormVehiculo({
                          ...formVehiculo,
                          anio: e.target.value,
                        })
                      }
                      placeholder="Ej. 2023"
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="vehiculo-marca"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Marca *
                    </label>
                    <input
                      id="vehiculo-marca"
                      type="text"
                      required
                      maxLength={50}
                      value={formVehiculo.marca}
                      onChange={(e) =>
                        setFormVehiculo({
                          ...formVehiculo,
                          marca: e.target.value,
                        })
                      }
                      placeholder="Ej. Peugeot"
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vehiculo-modelo"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Modelo *
                    </label>
                    <input
                      id="vehiculo-modelo"
                      type="text"
                      required
                      maxLength={50}
                      value={formVehiculo.modelo}
                      onChange={(e) =>
                        setFormVehiculo({
                          ...formVehiculo,
                          modelo: e.target.value,
                        })
                      }
                      placeholder="Ej. Partner Maxi"
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="vehiculo-descripcion"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Descripción / Asignación operativa
                  </label>
                  <input
                    id="vehiculo-descripcion"
                    type="text"
                    maxLength={200}
                    value={formVehiculo.descripcion}
                    onChange={(e) =>
                      setFormVehiculo({
                        ...formVehiculo,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Ej. Furgón cerrado ruta hotelera Calama"
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                {formVehiculo.id && (
                  <label className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={formVehiculo.activo}
                      onChange={(e) =>
                        setFormVehiculo({
                          ...formVehiculo,
                          activo: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-stone-300 text-brand-500 focus:ring-brand-500"
                    />
                    Vehículo habilitado para operación
                  </label>
                )}

                {formError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {formError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setFormVehiculo(null)}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {formVehiculo.id ? "Guardar cambios" : "Registrar vehículo"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
