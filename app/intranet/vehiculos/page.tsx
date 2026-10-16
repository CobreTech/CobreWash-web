"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Clock,
  Gauge,
  Loader2,
  Navigation,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { QueryFetchPolicy, subscribe } from "firebase/data-connect";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { dataConnect } from "@/lib/firebase/client";
import {
  adjuntarFotoInspeccionFlota,
  editarVehiculoFlota,
  EstadoVehiculo,
  getFlotaVehiculos,
  getFlotaVehiculosRef,
  registrarRetornoFlota,
  registrarSalidaFlota,
  registrarVehiculoFlota,
  type GetFlotaVehiculosData,
} from "@/src/dataconnect-generated";
import type {
  ConductorFlota,
  EstadoOperativoVehiculo,
  RetornoFormState,
  SalidaFlota,
  SalidaFormState,
  VehiculoFlota,
  VehiculoFormState,
} from "@/lib/vehiculos/modelo";
import {
  calcularMinutosEnRuta,
  filtrarResumenFlota,
  formatearDuracionRuta,
  formatearFechaHoraVehiculo,
  mapearErrorVehiculos,
  UMBRAL_DEMORA_MINUTOS,
} from "@/lib/vehiculos/flota";
import {
  construirResumenFlota,
  normalizarPatente,
  obtenerInspeccionMomento,
  validarFormularioVehiculo,
  validarRetornoVehiculo,
  validarSalidaVehiculo,
} from "@/lib/vehiculos/validaciones";

type Notice = { text: string; tipo: "success" | "warning" | "error" };
type TabActiva = "flota" | "en-ruta";

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

const estadoTecnicoLabels: Record<EstadoVehiculo, string> = {
  [EstadoVehiculo.APTO]: "Apto para circular",
  [EstadoVehiculo.CON_OBSERVACIONES]: "Con observaciones leves",
  [EstadoVehiculo.NO_APTO]: "No apto (bloquea salida)",
};

export default function VehiculosPage() {
  const permitido = useRoleGuard(["admin"]);
  const usuarioActual = useUsuarioActualContext();
  const [vehiculos, setVehiculos] = useState<VehiculoFlota[]>([]);
  const [conductores, setConductores] = useState<ConductorFlota[]>([]);
  const [salidas, setSalidas] = useState<SalidaFlota[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<TabActiva>("flota");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "Todos" | EstadoOperativoVehiculo
  >("Todos");

  // Modales RF-VE01, RF-VE02, RF-VE03
  const [formVehiculo, setFormVehiculo] = useState<VehiculoFormState | null>(
    null,
  );
  const [formSalida, setFormSalida] = useState<SalidaFormState | null>(null);
  const [formRetorno, setFormRetorno] = useState<RetornoFormState | null>(null);
  const [nuevaFotoDesc, setNuevaFotoDesc] = useState("");
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
    if (!formVehiculo && !formSalida && !formRetorno) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) {
        setFormVehiculo(null);
        setFormSalida(null);
        setFormRetorno(null);
        setFormError("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formVehiculo, formSalida, formRetorno, saving]);

  const { resumen, kpis } = useMemo(
    () => construirResumenFlota(vehiculos, salidas),
    [vehiculos, salidas],
  );

  const resumenFiltrado = useMemo(
    () => filtrarResumenFlota(resumen, busqueda, filtroEstado),
    [resumen, busqueda, filtroEstado],
  );

  const salidasEnCurso = useMemo(
    () =>
      salidas.filter(
        (s) => s.estado === "EN_SERVICIO" || s.estado === "PROGRAMADA",
      ),
    [salidas],
  );

  const vehiculosDisponibles = useMemo(
    () => resumen.filter((r) => r.estadoOperativo === "Disponible"),
    [resumen],
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

  const abrirModalSalida = (vehiculoIdPreseleccionado?: string) => {
    const candidato =
      resumen.find(
        (r) =>
          r.vehiculo.id === vehiculoIdPreseleccionado &&
          r.estadoOperativo === "Disponible",
      ) ?? vehiculosDisponibles[0];

    const conductorDefault =
      conductores.find((c) => c.id === usuarioActual?.id)?.id ??
      conductores[0]?.id ??
      "";

    setFormError("");
    setNuevaFotoDesc("");
    setFormSalida({
      vehiculoId: candidato?.vehiculo.id ?? "",
      repartidorId: conductorDefault,
      kilometraje: candidato ? String(candidato.kilometrajeActual) : "0",
      estadoVehiculo: EstadoVehiculo.APTO,
      observaciones: "",
      observacionesInspeccion: "",
      fotos: [],
    });
  };

  const abrirModalRetorno = (salida: SalidaFlota) => {
    const antes = obtenerInspeccionMomento(salida, "ANTES");
    const kmBase = antes?.kilometraje ?? 0;
    setFormError("");
    setNuevaFotoDesc("");
    setFormRetorno({
      salidaId: salida.id,
      vehiculoPatente: salida.vehiculo.patente,
      kilometrajeSalida: kmBase,
      kilometrajeRetorno: String(kmBase),
      estadoVehiculo: EstadoVehiculo.APTO,
      observacionesRetorno: salida.observaciones ?? "",
      observacionesInspeccion: "",
      fotos: [],
    });
  };

  const agregarEvidenciaSalida = (nombreArchivo?: string) => {
    if (!formSalida) return;
    const itemVehiculo = resumen.find(
      (r) => r.vehiculo.id === formSalida.vehiculoId,
    );
    const patente = itemVehiculo?.vehiculo.patente ?? "FLOTA";
    const idx = formSalida.fotos.length + 1;
    const base = nombreArchivo
      ? nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, "_")
      : `evidencia-${idx}.jpg`;
    const ruta = `vehiculos/${patente}/salida-${Date.now()}-${idx}-${base}`;
    setFormSalida({
      ...formSalida,
      fotos: [
        ...formSalida.fotos,
        {
          id: `${Date.now()}-${idx}`,
          rutaStorage: ruta,
          descripcion:
            nuevaFotoDesc.trim() || `Fotografía de salida #${idx}`,
        },
      ],
    });
    setNuevaFotoDesc("");
  };

  const agregarEvidenciaRetorno = (nombreArchivo?: string) => {
    if (!formRetorno) return;
    const idx = formRetorno.fotos.length + 1;
    const base = nombreArchivo
      ? nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, "_")
      : `retorno-${idx}.jpg`;
    const ruta = `vehiculos/${formRetorno.vehiculoPatente}/retorno-${Date.now()}-${idx}-${base}`;
    setFormRetorno({
      ...formRetorno,
      fotos: [
        ...formRetorno.fotos,
        {
          id: `${Date.now()}-${idx}`,
          rutaStorage: ruta,
          descripcion:
            nuevaFotoDesc.trim() || `Fotografía de retorno #${idx}`,
        },
      ],
    });
    setNuevaFotoDesc("");
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

  const confirmarSalidaVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSalida || saving) return;

    const itemVehiculo = resumen.find(
      (r) => r.vehiculo.id === formSalida.vehiculoId,
    );
    const kmMinimo = itemVehiculo?.kilometrajeActual ?? 0;

    const errorVal = validarSalidaVehiculo({
      vehiculoId: formSalida.vehiculoId,
      repartidorId: formSalida.repartidorId,
      kilometraje: formSalida.kilometraje,
      kilometrajeMinimo: kmMinimo,
      estadoVehiculo: formSalida.estadoVehiculo,
    });
    if (errorVal) {
      setFormError(errorVal);
      return;
    }

    const kmNum = Number(formSalida.kilometraje.trim().replace(",", "."));
    setSaving(true);
    setFormError("");
    try {
      const resultado = await registrarSalidaFlota(dataConnect, {
        vehiculoId: formSalida.vehiculoId,
        repartidorId: formSalida.repartidorId,
        kilometraje: kmNum,
        estadoVehiculo: formSalida.estadoVehiculo,
        observaciones: formSalida.observaciones.trim() || null,
        observacionesInspeccion:
          formSalida.observacionesInspeccion.trim() || null,
      });

      const inspeccionId = resultado.data.inspeccion.id;
      for (let i = 0; i < formSalida.fotos.length; i++) {
        const foto = formSalida.fotos[i];
        await adjuntarFotoInspeccionFlota(dataConnect, {
          inspeccionId,
          rutaStorage: foto.rutaStorage,
          descripcion: foto.descripcion || null,
          orden: i + 1,
        });
      }

      const patente = itemVehiculo?.vehiculo.patente ?? "Vehículo";
      setNotice({
        text: `Salida de ${patente} registrada (${kmNum.toLocaleString("es-CL")} km).`,
        tipo: "success",
      });
      setFormSalida(null);
      await cargarFlota(true);
    } catch (error) {
      setFormError(mapearErrorVehiculos(error));
    } finally {
      setSaving(false);
    }
  };

  const confirmarRetornoVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRetorno || saving) return;

    const errorVal = validarRetornoVehiculo({
      salidaId: formRetorno.salidaId,
      kilometrajeSalida: formRetorno.kilometrajeSalida,
      kilometrajeRetorno: formRetorno.kilometrajeRetorno,
    });
    if (errorVal) {
      setFormError(errorVal);
      return;
    }

    const kmNum = Number(
      formRetorno.kilometrajeRetorno.trim().replace(",", "."),
    );
    setSaving(true);
    setFormError("");
    try {
      const resultado = await registrarRetornoFlota(dataConnect, {
        salidaId: formRetorno.salidaId,
        kilometraje: kmNum,
        estadoVehiculo: formRetorno.estadoVehiculo,
        observacionesRetorno: formRetorno.observacionesRetorno.trim() || null,
        observacionesInspeccion:
          formRetorno.observacionesInspeccion.trim() || null,
      });

      const inspeccionId = resultado.data.inspeccion.id;
      for (let i = 0; i < formRetorno.fotos.length; i++) {
        const foto = formRetorno.fotos[i];
        await adjuntarFotoInspeccionFlota(dataConnect, {
          inspeccionId,
          rutaStorage: foto.rutaStorage,
          descripcion: foto.descripcion || null,
          orden: i + 1,
        });
      }

      const recorridos = Math.max(
        0,
        Number((kmNum - formRetorno.kilometrajeSalida).toFixed(1)),
      );
      setNotice({
        text: `Regreso de ${formRetorno.vehiculoPatente} confirmado (+${recorridos.toLocaleString("es-CL")} km recorridos).`,
        tipo: "success",
      });
      setFormRetorno(null);
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
            Gestión de unidades de transporte, despacho a terreno y monitoreo de salidas activas.
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
            disabled={vehiculosDisponibles.length === 0}
            onClick={() => abrirModalSalida()}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-40 dark:text-brand-400"
          >
            <ArrowUpRight className="h-4 w-4" />
            Registrar salida
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

      {/* Pestañas de navegación de vista */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3 dark:border-white/10">
        <button
          type="button"
          onClick={() => setTab("flota")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === "flota"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          }`}
        >
          <Truck className="h-4 w-4" />
          Catálogo de Flota ({kpis.total})
        </button>

        <button
          type="button"
          onClick={() => setTab("en-ruta")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === "en-ruta"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          }`}
        >
          <Navigation className="h-4 w-4" />
          Monitor en Ruta ({salidasEnCurso.length})
        </button>
      </div>

      {/* VISTA 1: CATÁLOGO DE FLOTA */}
      {tab === "flota" && (
        <>
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
                            {totalSalidas}{" "}
                            {totalSalidas === 1 ? "viaje" : "viajes"}
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
                              ultimaSalida.fechaRetorno ??
                                ultimaSalida.creadoEn,
                            )}
                          </p>
                        )
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 dark:border-white/10">
                      {salidaActiva ? (
                        <button
                          type="button"
                          onClick={() => abrirModalRetorno(salidaActiva)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/25 dark:text-amber-300"
                        >
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                          Registrar regreso
                        </button>
                      ) : vehiculo.activo ? (
                        <button
                          type="button"
                          onClick={() => abrirModalSalida(vehiculo.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-500/20 dark:text-brand-400"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Dar salida
                        </button>
                      ) : (
                        <span className="text-xs text-stone-400">
                          Unidad inactiva
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => abrirEditarVehiculo(vehiculo)}
                          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-white/10 dark:text-stone-300 dark:hover:bg-stone-800"
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
                          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-stone-300 dark:hover:bg-stone-800"
                        >
                          <Power className="h-3.5 w-3.5" />
                          {vehiculo.activo ? "Desactivar" : "Habilitar"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VISTA 2: MONITOR EN VIVO DE VEHÍCULOS EN RUTA (RF-VE02 / RF-VE03) */}
      {tab === "en-ruta" && (
        <div className="space-y-4">
          {salidasEnCurso.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center dark:border-white/10 dark:bg-stone-900/40">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
              <p className="mt-3 font-semibold text-stone-800 dark:text-stone-200">
                No hay vehículos en ruta en este momento
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Todas las unidades activas se encuentran disponibles en planta.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {salidasEnCurso.map((salida) => {
                const antes = obtenerInspeccionMomento(salida, "ANTES");
                const minutos = calcularMinutosEnRuta(
                  salida.fechaSalida ?? salida.creadoEn,
                );
                const demorado = minutos >= UMBRAL_DEMORA_MINUTOS;
                const totalFotos = antes?.fotos.length ?? 0;

                return (
                  <div
                    key={salida.id}
                    className={`rounded-2xl border p-5 shadow-sm ${
                      demorado
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-amber-500/25 bg-white dark:bg-stone-900/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg border border-stone-300 bg-stone-100 px-2.5 py-0.5 font-mono text-sm font-bold text-stone-900 dark:border-white/15 dark:bg-stone-800 dark:text-stone-100">
                            {salida.vehiculo.patente}
                          </span>
                          <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                            {salida.vehiculo.marca} {salida.vehiculo.modelo}
                          </span>
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-300">
                          <User className="h-4 w-4 text-brand-500" />
                          Conductor: {salida.repartidor.nombre}{" "}
                          {salida.repartidor.apellido ?? ""}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          <Clock className="h-3.5 w-3.5" />
                          {formatearDuracionRuta(minutos)}
                        </span>
                        {demorado && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-300">
                            <AlertTriangle className="h-3 w-3" />
                            Retorno demorado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-stone-50 p-3 text-xs dark:bg-stone-800/60">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400">
                          Hora de salida
                        </span>
                        <p className="mt-0.5 font-semibold text-stone-900 dark:text-stone-100">
                          {formatearFechaHoraVehiculo(
                            salida.fechaSalida ?? salida.creadoEn,
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-stone-500 dark:text-stone-400">
                          Odómetro de salida
                        </span>
                        <p className="mt-0.5 font-semibold text-stone-900 dark:text-stone-100">
                          {antes
                            ? `${antes.kilometraje.toLocaleString("es-CL")} km`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {(salida.observaciones || antes?.observaciones) && (
                      <p className="mt-3 text-xs text-stone-600 dark:text-stone-400">
                        <span className="font-semibold">Ruta / Notas:</span>{" "}
                        {[salida.observaciones, antes?.observaciones]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-white/10">
                      <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                        <Camera className="h-3.5 w-3.5" />
                        {totalFotos}{" "}
                        {totalFotos === 1
                          ? "foto de salida"
                          : "fotos de salida"}
                      </span>

                      <button
                        type="button"
                        onClick={() => abrirModalRetorno(salida)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-600"
                      >
                        <ArrowDownLeft className="h-4 w-4" />
                        Registrar regreso
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {/* Modal de Registro de Salida (RF-VE02) */}
      <AnimatePresence>
        {formSalida && (
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
              aria-labelledby="modal-salida-titulo"
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-stone-900"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-white/10">
                <div>
                  <h2
                    id="modal-salida-titulo"
                    className="font-display text-lg font-bold text-stone-900 dark:text-stone-50"
                  >
                    Registrar salida de vehículo
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Inspección previa, kilometraje inicial y conductor responsable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormSalida(null)}
                  aria-label="Cerrar modal"
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={confirmarSalidaVehiculo} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="salida-vehiculo"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Vehículo *
                    </label>
                    <select
                      id="salida-vehiculo"
                      value={formSalida.vehiculoId}
                      onChange={(e) => {
                        const sel = resumen.find(
                          (r) => r.vehiculo.id === e.target.value,
                        );
                        setFormSalida({
                          ...formSalida,
                          vehiculoId: e.target.value,
                          kilometraje: sel
                            ? String(sel.kilometrajeActual)
                            : formSalida.kilometraje,
                        });
                      }}
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    >
                      {vehiculosDisponibles.map((item) => (
                        <option key={item.vehiculo.id} value={item.vehiculo.id}>
                          {item.vehiculo.patente} — {item.vehiculo.marca}{" "}
                          {item.vehiculo.modelo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="salida-conductor"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Conductor asignado *
                    </label>
                    <select
                      id="salida-conductor"
                      value={formSalida.repartidorId}
                      onChange={(e) =>
                        setFormSalida({
                          ...formSalida,
                          repartidorId: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    >
                      {conductores.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} {c.apellido ?? ""} ({c.rol.nombre})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="salida-km"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Kilometraje de salida (km) *
                    </label>
                    <input
                      id="salida-km"
                      type="number"
                      step="0.1"
                      required
                      value={formSalida.kilometraje}
                      onChange={(e) =>
                        setFormSalida({
                          ...formSalida,
                          kilometraje: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="salida-estado-vehiculo"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Estado de inspección inicial *
                    </label>
                    <select
                      id="salida-estado-vehiculo"
                      value={formSalida.estadoVehiculo}
                      onChange={(e) =>
                        setFormSalida({
                          ...formSalida,
                          estadoVehiculo: e.target.value as EstadoVehiculo,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    >
                      {Object.values(EstadoVehiculo).map((est) => (
                        <option key={est} value={est}>
                          {estadoTecnicoLabels[est]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="salida-observaciones"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Destino / Observaciones de ruta
                  </label>
                  <input
                    id="salida-observaciones"
                    type="text"
                    maxLength={300}
                    value={formSalida.observaciones}
                    onChange={(e) =>
                      setFormSalida({
                        ...formSalida,
                        observaciones: e.target.value,
                      })
                    }
                    placeholder="Ej. Reparto ruta hotelera centro y retiro faena"
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salida-obs-inspeccion"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Observaciones técnicas de la inspección
                  </label>
                  <input
                    id="salida-obs-inspeccion"
                    type="text"
                    maxLength={500}
                    value={formSalida.observacionesInspeccion}
                    onChange={(e) =>
                      setFormSalida({
                        ...formSalida,
                        observacionesInspeccion: e.target.value,
                      })
                    }
                    placeholder="Ej. Nivel de combustible 3/4, carrocería sin novedades"
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                {/* Evidencia fotográfica */}
                <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 dark:border-white/10 dark:bg-stone-800/40">
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Fotografías del estado inicial ({formSalida.fotos.length})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={nuevaFotoDesc}
                      onChange={(e) => setNuevaFotoDesc(e.target.value)}
                      placeholder="Descripción de la foto (ej. Frontal, Odómetro)"
                      className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => agregarEvidenciaSalida()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-500/25 dark:text-brand-400"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Adjuntar evidencia
                    </button>
                  </div>

                  {formSalida.fotos.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5">
                      {formSalida.fotos.map((f) => (
                        <li
                          key={f.id}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs dark:bg-stone-900"
                        >
                          <span className="truncate font-medium text-stone-700 dark:text-stone-300">
                            {f.descripcion} ·{" "}
                            <span className="font-mono text-[11px] text-stone-400">
                              {f.rutaStorage}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormSalida({
                                ...formSalida,
                                fotos: formSalida.fotos.filter(
                                  (item) => item.id !== f.id,
                                ),
                              })
                            }
                            aria-label="Quitar foto"
                            className="ml-2 text-stone-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

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
                    onClick={() => setFormSalida(null)}
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
                    Confirmar salida
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Registro de Regreso (RF-VE03) */}
      <AnimatePresence>
        {formRetorno && (
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
              aria-labelledby="modal-retorno-titulo"
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-stone-900"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-white/10">
                <div>
                  <h2
                    id="modal-retorno-titulo"
                    className="font-display text-lg font-bold text-stone-900 dark:text-stone-50"
                  >
                    Registrar regreso de {formRetorno.vehiculoPatente}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Odómetro de salida registrado:{" "}
                    <strong>
                      {formRetorno.kilometrajeSalida.toLocaleString("es-CL")} km
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormRetorno(null)}
                  aria-label="Cerrar modal"
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={confirmarRetornoVehiculo}
                className="mt-4 space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="retorno-km"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Kilometraje de retorno (km) *
                    </label>
                    <input
                      id="retorno-km"
                      type="number"
                      step="0.1"
                      required
                      min={formRetorno.kilometrajeSalida}
                      value={formRetorno.kilometrajeRetorno}
                      onChange={(e) =>
                        setFormRetorno({
                          ...formRetorno,
                          kilometrajeRetorno: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="retorno-estado-vehiculo"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      Estado al retornar *
                    </label>
                    <select
                      id="retorno-estado-vehiculo"
                      value={formRetorno.estadoVehiculo}
                      onChange={(e) =>
                        setFormRetorno({
                          ...formRetorno,
                          estadoVehiculo: e.target.value as EstadoVehiculo,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                    >
                      <option value={EstadoVehiculo.APTO}>
                        Sin novedades (Apto)
                      </option>
                      <option value={EstadoVehiculo.CON_OBSERVACIONES}>
                        Con observaciones
                      </option>
                      <option value={EstadoVehiculo.NO_APTO}>
                        Con daño / Requiere taller (No apto)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="retorno-obs-inspeccion"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Novedades o comentarios de inspección final
                  </label>
                  <input
                    id="retorno-obs-inspeccion"
                    type="text"
                    maxLength={500}
                    value={formRetorno.observacionesInspeccion}
                    onChange={(e) =>
                      setFormRetorno({
                        ...formRetorno,
                        observacionesInspeccion: e.target.value,
                      })
                    }
                    placeholder="Ej. Limpieza interior realizada, sin golpes"
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                {/* Evidencia fotográfica de retorno */}
                <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 dark:border-white/10 dark:bg-stone-800/40">
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Fotografías del estado al regresar ({formRetorno.fotos.length})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={nuevaFotoDesc}
                      onChange={(e) => setNuevaFotoDesc(e.target.value)}
                      placeholder="Descripción de la foto (ej. Tablero final, Lateral)"
                      className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => agregarEvidenciaRetorno()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-500/25 dark:text-brand-400"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Adjuntar evidencia
                    </button>
                  </div>

                  {formRetorno.fotos.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5">
                      {formRetorno.fotos.map((f) => (
                        <li
                          key={f.id}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs dark:bg-stone-900"
                        >
                          <span className="truncate font-medium text-stone-700 dark:text-stone-300">
                            {f.descripcion} ·{" "}
                            <span className="font-mono text-[11px] text-stone-400">
                              {f.rutaStorage}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormRetorno({
                                ...formRetorno,
                                fotos: formRetorno.fotos.filter(
                                  (item) => item.id !== f.id,
                                ),
                              })
                            }
                            aria-label="Quitar foto"
                            className="ml-2 text-stone-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

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
                    onClick={() => setFormRetorno(null)}
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
                    Confirmar regreso
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
