"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Gauge,
  History,
  ImagePlus,
  Loader2,
  Navigation,
  Pencil,
  Plus,
  Power,
  Radio,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { QueryFetchPolicy, subscribe } from "firebase/data-connect";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { dataConnect, storage } from "@/lib/firebase/client";
import {
  adjuntarFotoInspeccionFlota,
  editarVehiculoFlota,
  EstadoVehiculo,
  getFlotaVehiculos,
  getFlotaVehiculosRef,
  registrarRetornoFlota,
  registrarSalidaFlota,
  registrarVehiculoFlota,
  SalidaVehiculoEstado,
  type GetFlotaVehiculosData,
} from "@/src/dataconnect-generated";
import type {
  ConductorFlota,
  EstadoOperativoVehiculo,
  EvidenciaFotoInput,
  RetornoFormState,
  SalidaFlota,
  SalidaFormState,
  VehiculoFlota,
  VehiculoFormState,
  VistaVehiculos,
} from "@/lib/vehiculos/modelo";
import {
  calcularMinutosEnRuta,
  crearCsvHistorialVehiculos,
  filtrarResumenFlota,
  filtrarSalidasHistorial,
  formatearDuracionRuta,
  formatearFechaHoraVehiculo,
  mapearErrorVehiculos,
  UMBRAL_DEMORA_MINUTOS,
  type FiltrosHistorialVehiculo,
} from "@/lib/vehiculos/flota";
import {
  calcularKilometrosRecorridos,
  construirResumenFlota,
  filtrarConductoresFlota,
  normalizarPatente,
  obtenerInspeccionMomento,
  validarFormularioVehiculo,
  validarRetornoVehiculo,
  validarSalidaVehiculo,
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

const FILTROS_HISTORIAL_VACIOS: FiltrosHistorialVehiculo = {
  vehiculoId: "",
  repartidorId: "",
  estado: "TODOS",
  desde: "",
  hasta: "",
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
  { badge: string; dot: string; icon: React.ElementType }
> = {
  Disponible: {
    badge: "bg-green-500/10 text-green-700 dark:text-green-400",
    dot: "bg-green-500 dark:bg-green-400 animate-pulse",
    icon: CheckCircle2,
  },
  "En ruta": {
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400 animate-pulse",
    icon: Navigation,
  },
  Inactivo: {
    badge: "bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400",
    dot: "bg-stone-400 dark:bg-stone-500",
    icon: Power,
  },
};

const estadoTecnicoLabels: Record<EstadoVehiculo, string> = {
  [EstadoVehiculo.APTO]: "Apto para circular",
  [EstadoVehiculo.CON_OBSERVACIONES]: "Con observaciones leves",
  [EstadoVehiculo.NO_APTO]: "No apto (bloquea salida)",
};

const estadoTecnicoChip: Record<EstadoVehiculo, string> = {
  [EstadoVehiculo.APTO]:
    "bg-green-500/10 text-green-700 dark:text-green-400",
  [EstadoVehiculo.CON_OBSERVACIONES]:
    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  [EstadoVehiculo.NO_APTO]:
    "bg-red-500/15 text-red-700 dark:text-red-300",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-stone-200/80 bg-stone-50/70 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800/80 dark:text-stone-200 dark:placeholder-stone-500 transition-all";

const LABEL_CLASS =
  "block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400";

function leerArchivoComoDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function subirFotoConRespaldo(foto: EvidenciaFotoInput): Promise<string> {
  if (!foto.archivo) return foto.rutaStorage;
  try {
    const referencia = storageRef(storage, foto.rutaStorage);
    const subida = uploadBytes(referencia, foto.archivo, {
      contentType: foto.archivo.type || "image/jpeg",
    });
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 3500),
    );
    await Promise.race([subida, timeout]);
    const url = await getDownloadURL(referencia);
    if (url && url.length <= 500 && !/\s/.test(url)) {
      return url;
    }
  } catch {
    // Si Firebase Storage no está habilitado en el entorno actual, se conserva rutaStorage.
  }
  return foto.rutaStorage;
}

export default function VehiculosPage() {
  const permitido = useRoleGuard(["admin"]);
  const usuarioActual = useUsuarioActualContext();
  const [vehiculos, setVehiculos] = useState<VehiculoFlota[]>([]);
  const [conductores, setConductores] = useState<ConductorFlota[]>([]);
  const [salidas, setSalidas] = useState<SalidaFlota[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<VistaVehiculos>("flota");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "Todos" | EstadoOperativoVehiculo
  >("Todos");
  const [filtrosHistorial, setFiltrosHistorial] =
    useState<FiltrosHistorialVehiculo>(FILTROS_HISTORIAL_VACIOS);

  // Modales RF-VE01, RF-VE02, RF-VE03, RF-VE04
  const [formVehiculo, setFormVehiculo] = useState<VehiculoFormState | null>(
    null,
  );
  const [formSalida, setFormSalida] = useState<SalidaFormState | null>(null);
  const [formRetorno, setFormRetorno] = useState<RetornoFormState | null>(null);
  const [salidaDetalle, setSalidaDetalle] = useState<SalidaFlota | null>(null);
  const [nuevaFotoDesc, setNuevaFotoDesc] = useState("");
  const [formError, setFormError] = useState("");
  const [previewsLocales, setPreviewsLocales] = useState<
    Record<string, string>
  >({});

  const solicitudActual = useRef(0);
  const inputFotoSalidaRef = useRef<HTMLInputElement | null>(null);
  const inputFotoRetornoRef = useRef<HTMLInputElement | null>(null);

  const conductoresHabilitados = useMemo(
    () => filtrarConductoresFlota(conductores),
    [conductores],
  );

  const aplicarDatos = useCallback((data: GetFlotaVehiculosData) => {
    setVehiculos(data.vehiculos);
    setConductores(filtrarConductoresFlota(data.conductores));
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
    if (!formVehiculo && !formSalida && !formRetorno && !salidaDetalle) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) {
        setFormVehiculo(null);
        setFormSalida(null);
        setFormRetorno(null);
        setSalidaDetalle(null);
        setFormError("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formVehiculo, formSalida, formRetorno, salidaDetalle, saving]);

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

  const salidasHistorialFiltradas = useMemo(
    () => filtrarSalidasHistorial(salidas, filtrosHistorial),
    [salidas, filtrosHistorial],
  );

  const metricasHistorial = useMemo(() => {
    let kmTotales = 0;
    let conObservaciones = 0;
    for (const s of salidasHistorialFiltradas) {
      const km = calcularKilometrosRecorridos(s);
      if (km !== null) kmTotales += km;
      if (
        s.inspecciones.some(
          (i) =>
            i.estadoVehiculo !== EstadoVehiculo.APTO ||
            Boolean(i.observaciones),
        )
      ) {
        conObservaciones++;
      }
    }
    return {
      totalViajes: salidasHistorialFiltradas.length,
      kmTotales: Number(kmTotales.toFixed(1)),
      conObservaciones,
    };
  }, [salidasHistorialFiltradas]);

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

  const abrirHistorialDeVehiculo = (vehiculoId: string) => {
    setFiltrosHistorial({
      ...FILTROS_HISTORIAL_VACIOS,
      vehiculoId,
    });
    setTab("historial");
  };

  const exportarHistorialCsv = () => {
    const csv = crearCsvHistorialVehiculos(salidasHistorialFiltradas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historial-vehiculos-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const abrirModalSalida = (vehiculoIdPreseleccionado?: string) => {
    const candidato =
      resumen.find(
        (r) =>
          r.vehiculo.id === vehiculoIdPreseleccionado &&
          r.estadoOperativo === "Disponible",
      ) ?? vehiculosDisponibles[0];

    const conductorDefault =
      conductoresHabilitados.find((c) => c.id === usuarioActual?.id)?.id ??
      conductoresHabilitados[0]?.id ??
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

  const agregarEvidenciaSalida = (
    nombreArchivo?: string,
    previewUrl?: string,
    archivo?: File,
  ) => {
    setFormSalida((prev) => {
      if (!prev) return prev;
      const itemVehiculo = resumen.find(
        (r) => r.vehiculo.id === prev.vehiculoId,
      );
      const patente = itemVehiculo?.vehiculo.patente ?? "FLOTA";
      const idx = prev.fotos.length + 1;
      const base = nombreArchivo
        ? nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, "_")
        : `evidencia-${idx}.jpg`;
      const ruta = `vehiculos/${patente}/salida-${Date.now()}-${idx}-${base}`;
      if (previewUrl) {
        setPreviewsLocales((actual) => ({ ...actual, [ruta]: previewUrl }));
      }
      return {
        ...prev,
        fotos: [
          ...prev.fotos,
          {
            id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            rutaStorage: ruta,
            descripcion:
              nuevaFotoDesc.trim() ||
              (nombreArchivo
                ? nombreArchivo.replace(/\.[^.]+$/, "")
                : `Fotografía de salida #${idx}`),
            nombreArchivo: nombreArchivo ?? base,
            previewUrl,
            archivo,
          },
        ],
      };
    });
    setNuevaFotoDesc("");
  };

  const agregarEvidenciaRetorno = (
    nombreArchivo?: string,
    previewUrl?: string,
    archivo?: File,
  ) => {
    setFormRetorno((prev) => {
      if (!prev) return prev;
      const idx = prev.fotos.length + 1;
      const base = nombreArchivo
        ? nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, "_")
        : `retorno-${idx}.jpg`;
      const ruta = `vehiculos/${prev.vehiculoPatente}/retorno-${Date.now()}-${idx}-${base}`;
      if (previewUrl) {
        setPreviewsLocales((actual) => ({ ...actual, [ruta]: previewUrl }));
      }
      return {
        ...prev,
        fotos: [
          ...prev.fotos,
          {
            id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            rutaStorage: ruta,
            descripcion:
              nuevaFotoDesc.trim() ||
              (nombreArchivo
                ? nombreArchivo.replace(/\.[^.]+$/, "")
                : `Fotografía de retorno #${idx}`),
            nombreArchivo: nombreArchivo ?? base,
            previewUrl,
            archivo,
          },
        ],
      };
    });
    setNuevaFotoDesc("");
  };

  const manejarSeleccionArchivosSalida = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const file of archivos) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await leerArchivoComoDataUrl(file).catch(() => "");
      agregarEvidenciaSalida(file.name, dataUrl || undefined, file);
    }
  };

  const manejarSeleccionArchivosRetorno = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const file of archivos) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await leerArchivoComoDataUrl(file).catch(() => "");
      agregarEvidenciaRetorno(file.name, dataUrl || undefined, file);
    }
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
        const rutaFinal = await subirFotoConRespaldo(foto);
        if (foto.previewUrl) {
          setPreviewsLocales((actual) => ({
            ...actual,
            [rutaFinal]: foto.previewUrl!,
          }));
        }
        await adjuntarFotoInspeccionFlota(dataConnect, {
          inspeccionId,
          rutaStorage: rutaFinal,
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
        const rutaFinal = await subirFotoConRespaldo(foto);
        if (foto.previewUrl) {
          setPreviewsLocales((actual) => ({
            ...actual,
            [rutaFinal]: foto.previewUrl!,
          }));
        }
        await adjuntarFotoInspeccionFlota(dataConnect, {
          inspeccionId,
          rutaStorage: rutaFinal,
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

  if (!permitido) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
      {/* Notificación flotante unificada con el resto de vistas */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role={notice.tipo === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`fixed right-5 top-5 z-[70] flex max-w-md items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl ${noticeStyle[notice.tipo]}`}
          >
            <span>{notice.text}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Cerrar aviso"
              className="rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado principal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            <Radio className="h-3 w-3 animate-pulse" />
            Flota y Reparto Conectado
          </div>
          <h1 className="font-display text-2xl font-extrabold text-stone-900 dark:text-white">
            Control de Vehículos
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Gestión de unidades de transporte, despacho a terreno, monitoreo en vivo y auditoría de inspecciones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void cargarFlota(false)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white/80 px-3.5 py-2.5 text-sm font-bold text-stone-700 transition hover:bg-stone-100 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-stone-200 dark:hover:bg-white/10 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Actualizar
          </button>

          <button
            type="button"
            disabled={vehiculosDisponibles.length === 0}
            onClick={() => abrirModalSalida()}
            className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300 cursor-pointer"
          >
            <ArrowUpRight className="h-4 w-4" />
            Registrar salida
          </button>

          <button
            type="button"
            onClick={abrirNuevoVehiculo}
            className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Registrar vehículo
          </button>
        </div>
      </motion.div>

      {/* Tarjetas de KPIs de Flota con glass-panel y bordes definidos */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total Flota",
            sub: "Unidades registradas",
            value: kpis.total,
            cls: "text-stone-900 dark:text-white",
            tone: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
            icon: Truck,
          },
          {
            label: "Disponibles en Planta",
            sub: "Listos para despacho",
            value: kpis.disponibles,
            cls: "text-green-600 dark:text-green-400",
            tone: "bg-green-500/10 text-green-600 dark:text-green-400",
            icon: CheckCircle2,
          },
          {
            label: "En Ruta",
            sub: "Con recorrido activo",
            value: kpis.enRuta,
            cls: "text-amber-600 dark:text-amber-400",
            tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            icon: Navigation,
          },
          {
            label: "Inactivos / Taller",
            sub: "Fuera de operación",
            value: kpis.inactivos,
            cls: "text-stone-700 dark:text-stone-300",
            tone: "bg-stone-500/10 text-stone-500 dark:text-stone-400",
            icon: Power,
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel rounded-2xl border border-stone-200/80 p-4 dark:border-white/10"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {item.label}
                </p>
                <p className={`mt-1 font-display text-2xl font-extrabold ${item.cls}`}>
                  {item.value}
                </p>
                <p className="mt-0.5 text-[11px] text-stone-400 dark:text-stone-500">
                  {item.sub}
                </p>
              </div>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                <item.icon className="h-5 w-5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pestañas de navegación de vista con el mismo estilo de píldoras de Usuarios/Inventario */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          {
            id: "flota" as const,
            label: "Catálogo de Flota",
            count: kpis.total,
            icon: Truck,
          },
          {
            id: "en-ruta" as const,
            label: "Monitor en Ruta",
            count: salidasEnCurso.length,
            icon: Navigation,
          },
          {
            id: "historial" as const,
            label: "Historial e Inspecciones",
            count: salidas.length,
            icon: History,
          },
        ].map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-300"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VISTA 1: CATÁLOGO DE FLOTA */}
      {tab === "flota" && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative max-w-md flex-1">
              <span className="sr-only">Buscar vehículos</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por patente, marca, modelo o conductor..."
                aria-label="Buscar vehículos"
                className="glass-panel w-full rounded-xl border border-stone-200/80 py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-brand-500/50 dark:border-white/10 dark:text-stone-100"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {(["Todos", "Disponible", "En ruta", "Inactivo"] as const).map(
                (opcion) => {
                  const activo = filtroEstado === opcion;
                  return (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => setFiltroEstado(opcion)}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                        activo
                          ? "bg-brand-500 text-white shadow-sm"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
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
            <div className="glass-panel flex items-center justify-center rounded-2xl border border-stone-200/80 p-12 dark:border-white/10">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              <span className="ml-3 text-sm font-medium text-stone-600 dark:text-stone-400">
                Cargando catálogo de flota...
              </span>
            </div>
          ) : resumenFiltrado.length === 0 ? (
            <div className="glass-panel rounded-2xl border border-stone-200/80 p-12 text-center dark:border-white/10">
              <Truck className="mx-auto h-10 w-10 text-stone-300 dark:text-stone-600" />
              <p className="mt-3 font-bold text-stone-800 dark:text-stone-200">
                No se encontraron vehículos
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Ajusta el filtro de búsqueda o registra una nueva unidad en la flota.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resumenFiltrado.map((item, i) => {
                const {
                  vehiculo,
                  estadoOperativo,
                  salidaActiva,
                  kilometrajeActual,
                  totalSalidas,
                  ultimaSalida,
                } = item;
                const cfg = estadoBadgeStyle[estadoOperativo];

                return (
                  <motion.article
                    key={vehiculo.id}
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.25) }}
                    className="glass-panel flex flex-col justify-between rounded-2xl border border-stone-200/80 p-5 transition-colors hover:border-brand-500/30 dark:border-white/10 dark:hover:border-brand-500/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-sm">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-block rounded-lg border border-stone-200 bg-stone-100/90 px-2.5 py-0.5 font-mono text-xs font-extrabold tracking-wider text-stone-900 dark:border-white/15 dark:bg-stone-800 dark:text-stone-100">
                                {vehiculo.patente}
                              </span>
                              {vehiculo.anio && (
                                <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500">
                                  {vehiculo.anio}
                                </span>
                              )}
                            </div>
                            <h2 className="mt-1 font-display text-base font-extrabold text-stone-900 dark:text-white">
                              {vehiculo.marca} {vehiculo.modelo}
                            </h2>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {estadoOperativo}
                        </span>
                      </div>

                      {vehiculo.descripcion && (
                        <p className="mt-2.5 text-xs text-stone-500 dark:text-stone-400">
                          {vehiculo.descripcion}
                        </p>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-stone-100 bg-stone-50/80 p-3 text-xs dark:border-white/5 dark:bg-stone-800/50">
                        <div>
                          <span className="text-[11px] text-stone-400 dark:text-stone-500">
                            Odómetro actual
                          </span>
                          <p className="mt-0.5 flex items-center gap-1 font-extrabold text-stone-900 dark:text-stone-100">
                            <Gauge className="h-3.5 w-3.5 text-brand-500" />
                            {kilometrajeActual.toLocaleString("es-CL")} km
                          </p>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 dark:text-stone-500">
                            Salidas registradas
                          </span>
                          <p className="mt-0.5 font-extrabold text-stone-900 dark:text-stone-100">
                            {totalSalidas}{" "}
                            {totalSalidas === 1 ? "viaje" : "viajes"}
                          </p>
                        </div>
                      </div>

                      {salidaActiva ? (
                        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                          <p className="flex items-center gap-1.5 font-bold">
                            <User className="h-3.5 w-3.5" />
                            Conductor: {salidaActiva.repartidor.nombre}{" "}
                            {salidaActiva.repartidor.apellido ?? ""}
                          </p>
                          <p className="mt-0.5 text-[11px] text-amber-700/80 dark:text-amber-300/80">
                            Salida:{" "}
                            {formatearFechaHoraVehiculo(
                              salidaActiva.fechaSalida ?? salidaActiva.creadoEn,
                            )}
                          </p>
                        </div>
                      ) : (
                        ultimaSalida && (
                          <p className="mt-3 text-[11px] text-stone-400 dark:text-stone-500">
                            Último retorno:{" "}
                            {formatearFechaHoraVehiculo(
                              ultimaSalida.fechaRetorno ??
                                ultimaSalida.creadoEn,
                            )}
                          </p>
                        )
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3.5 dark:border-white/5">
                      {salidaActiva ? (
                        <button
                          type="button"
                          onClick={() => abrirModalRetorno(salidaActiva)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 cursor-pointer"
                        >
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                          Registrar regreso
                        </button>
                      ) : vehiculo.activo ? (
                        <button
                          type="button"
                          onClick={() => abrirModalSalida(vehiculo.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-premium transition-all hover:shadow-md cursor-pointer"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Dar salida
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-stone-400">
                          Unidad inactiva
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Ver historial del vehículo"
                          onClick={() => abrirHistorialDeVehiculo(vehiculo.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-1.5 text-xs font-bold text-stone-600 transition hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300 dark:hover:text-brand-400 cursor-pointer"
                        >
                          <History className="h-3.5 w-3.5" />
                          Historial
                        </button>
                        <button
                          type="button"
                          title="Editar vehículo"
                          onClick={() => abrirEditarVehiculo(vehiculo)}
                          className="inline-flex items-center gap-1 rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-1.5 text-xs font-bold text-stone-600 transition hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300 dark:hover:text-brand-400 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={saving || Boolean(salidaActiva)}
                          title={vehiculo.activo ? "Desactivar" : "Habilitar"}
                          onClick={() =>
                            void alternarActivoVehiculo(
                              vehiculo,
                              Boolean(salidaActiva),
                            )
                          }
                          className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer ${
                            vehiculo.activo
                              ? "border-stone-200/80 bg-stone-50/70 text-stone-600 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
                              : "border-green-500/30 bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                          }`}
                        >
                          <Power className="h-3.5 w-3.5" />
                          {vehiculo.activo ? "Desactivar" : "Habilitar"}
                        </button>
                      </div>
                    </div>
                  </motion.article>
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
            <div className="glass-panel rounded-2xl border border-stone-200/80 p-12 text-center dark:border-white/10">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
              <p className="mt-3 font-bold text-stone-800 dark:text-stone-200">
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
                    className={`glass-panel rounded-2xl border p-5 ${
                      demorado
                        ? "border-red-500/40 bg-red-500/5"
                        : "border-amber-500/30 dark:border-amber-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          <Navigation className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg border border-stone-300 bg-stone-100 px-2.5 py-0.5 font-mono text-xs font-extrabold text-stone-900 dark:border-white/15 dark:bg-stone-800 dark:text-stone-100">
                              {salida.vehiculo.patente}
                            </span>
                            <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                              {salida.vehiculo.marca} {salida.vehiculo.modelo}
                            </span>
                          </div>
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                            <User className="h-3.5 w-3.5 text-brand-500" />
                            Conductor: {salida.repartidor.nombre}{" "}
                            {salida.repartidor.apellido ?? ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                          <Clock className="h-3.5 w-3.5" />
                          {formatearDuracionRuta(minutos)}
                        </span>
                        {demorado && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:text-red-300">
                            <AlertTriangle className="h-3 w-3" />
                            Retorno demorado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-stone-100 bg-stone-50/80 p-3 text-xs dark:border-white/5 dark:bg-stone-800/50">
                      <div>
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">
                          Hora de salida
                        </span>
                        <p className="mt-0.5 font-bold text-stone-900 dark:text-stone-100">
                          {formatearFechaHoraVehiculo(
                            salida.fechaSalida ?? salida.creadoEn,
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">
                          Odómetro de salida
                        </span>
                        <p className="mt-0.5 font-bold text-stone-900 dark:text-stone-100">
                          {antes
                            ? `${antes.kilometraje.toLocaleString("es-CL")} km`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {(salida.observaciones || antes?.observaciones) && (
                      <p className="mt-3 text-xs text-stone-600 dark:text-stone-400">
                        <span className="font-bold">Ruta / Notas:</span>{" "}
                        {[salida.observaciones, antes?.observaciones]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3.5 dark:border-white/5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
                        <Camera className="h-3.5 w-3.5 text-brand-500" />
                        {totalFotos}{" "}
                        {totalFotos === 1
                          ? "foto de salida"
                          : "fotos de salida"}
                      </span>

                      <button
                        type="button"
                        onClick={() => abrirModalRetorno(salida)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-bold text-white shadow-premium transition-all hover:shadow-lg cursor-pointer"
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

      {/* VISTA 3: HISTORIAL Y AUDITORÍA DE INSPECCIONES (RF-VE04) */}
      {tab === "historial" && (
        <div className="space-y-4">
          {/* Resumen rápido del historial filtrado */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="glass-panel rounded-2xl border border-stone-200/80 p-4 dark:border-white/10">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Salidas en el periodo
              </span>
              <p className="mt-1 font-display text-2xl font-extrabold text-stone-900 dark:text-white">
                {metricasHistorial.totalViajes}
              </p>
            </div>
            <div className="glass-panel rounded-2xl border border-stone-200/80 p-4 dark:border-white/10">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Distancia total acumulada
              </span>
              <p className="mt-1 font-display text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                {metricasHistorial.kmTotales.toLocaleString("es-CL")} km
              </p>
            </div>
            <div className="glass-panel rounded-2xl border border-stone-200/80 p-4 dark:border-white/10">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Viajes con observaciones / hallazgos
              </span>
              <p className="mt-1 font-display text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {metricasHistorial.conObservaciones}
              </p>
            </div>
          </div>

          {/* Contenedor glass-panel de filtros + tabla igual que Inventario */}
          <section className="glass-panel overflow-hidden rounded-2xl border border-stone-200/80 dark:border-white/10">
            <div className="flex flex-col gap-4 border-b border-stone-100 px-5 py-4 dark:border-white/5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <History className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-stone-900 dark:text-white">
                    Bitácora de salidas e inspecciones
                  </h2>
                  <p className="text-xs text-stone-400">
                    Auditoría de kilometraje, conductores y evidencia fotográfica
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
                <div>
                  <label
                    htmlFor="hist-vehiculo"
                    className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
                  >
                    Vehículo
                  </label>
                  <select
                    id="hist-vehiculo"
                    value={filtrosHistorial.vehiculoId}
                    onChange={(e) =>
                      setFiltrosHistorial({
                        ...filtrosHistorial,
                        vehiculoId: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-2 text-xs font-medium text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  >
                    <option value="">Todas las patentes</option>
                    {vehiculos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.patente} — {v.marca} {v.modelo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hist-conductor"
                    className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
                  >
                    Conductor
                  </label>
                  <select
                    id="hist-conductor"
                    value={filtrosHistorial.repartidorId}
                    onChange={(e) =>
                      setFiltrosHistorial({
                        ...filtrosHistorial,
                        repartidorId: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-2 text-xs font-medium text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  >
                    <option value="">Todos los conductores</option>
                    {conductoresHabilitados.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.apellido ?? ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hist-estado"
                    className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
                  >
                    Estado del viaje
                  </label>
                  <select
                    id="hist-estado"
                    value={filtrosHistorial.estado}
                    onChange={(e) =>
                      setFiltrosHistorial({
                        ...filtrosHistorial,
                        estado: e.target
                          .value as FiltrosHistorialVehiculo["estado"],
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-2 text-xs font-medium text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  >
                    <option value="TODOS">Todos</option>
                    <option value={SalidaVehiculoEstado.EN_SERVICIO}>
                      En ruta
                    </option>
                    <option value={SalidaVehiculoEstado.FINALIZADA}>
                      Finalizados
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hist-desde"
                    className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
                  >
                    Desde
                  </label>
                  <input
                    id="hist-desde"
                    type="date"
                    value={filtrosHistorial.desde}
                    onChange={(e) =>
                      setFiltrosHistorial({
                        ...filtrosHistorial,
                        desde: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-2 text-xs font-medium text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hist-hasta"
                    className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
                  >
                    Hasta
                  </label>
                  <input
                    id="hist-hasta"
                    type="date"
                    value={filtrosHistorial.hasta}
                    onChange={(e) =>
                      setFiltrosHistorial({
                        ...filtrosHistorial,
                        hasta: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-stone-50/70 px-2.5 py-2 text-xs font-medium text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-end gap-1.5">
                  <button
                    type="button"
                    title="Limpiar filtros"
                    onClick={() =>
                      setFiltrosHistorial(FILTROS_HISTORIAL_VACIOS)
                    }
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-stone-200/80 bg-stone-50/70 px-3 py-2 text-xs font-bold text-stone-600 transition hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-stone-300 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Limpiar
                  </button>
                  <button
                    type="button"
                    disabled={salidasHistorialFiltradas.length === 0}
                    onClick={exportarHistorialCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3 py-2 text-xs font-bold text-white shadow-premium disabled:opacity-40 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV
                  </button>
                </div>
              </div>
            </div>

            {salidasHistorialFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <History className="mx-auto h-9 w-9 text-stone-300 dark:text-stone-600" />
                <p className="mt-3 text-sm font-bold text-stone-700 dark:text-stone-300">
                  No hay registros de salidas para los filtros seleccionados
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-stone-50/80 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:bg-white/5">
                    <tr>
                      <th className="px-4 py-3">Vehículo</th>
                      <th className="px-4 py-3">Conductor</th>
                      <th className="px-4 py-3">Salida</th>
                      <th className="px-4 py-3">Retorno</th>
                      <th className="px-4 py-3">Kilometraje</th>
                      <th className="px-4 py-3">Evidencia</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                    {salidasHistorialFiltradas.map((s) => {
                      const antes = obtenerInspeccionMomento(s, "ANTES");
                      const despues = obtenerInspeccionMomento(s, "DESPUES");
                      const recorridos = calcularKilometrosRecorridos(s);
                      const fotosTotal =
                        (antes?.fotos.length ?? 0) +
                        (despues?.fotos.length ?? 0);

                      return (
                        <tr
                          key={s.id}
                          className="transition-colors hover:bg-stone-50/70 dark:hover:bg-white/5"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono font-extrabold text-stone-900 dark:text-stone-100">
                              {s.vehiculo.patente}
                            </span>
                            <p className="text-stone-500 dark:text-stone-400">
                              {s.vehiculo.marca} {s.vehiculo.modelo}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-semibold text-stone-800 dark:text-stone-200">
                            {s.repartidor.nombre} {s.repartidor.apellido ?? ""}
                          </td>
                          <td className="px-4 py-3 text-stone-600 dark:text-stone-300">
                            {formatearFechaHoraVehiculo(
                              s.fechaSalida ?? s.creadoEn,
                            )}
                          </td>
                          <td className="px-4 py-3 text-stone-600 dark:text-stone-300">
                            {s.estado === "FINALIZADA" ? (
                              formatearFechaHoraVehiculo(s.fechaRetorno)
                            ) : (
                              <span className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                En ruta
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-stone-800 dark:text-stone-200">
                              {antes
                                ? `${antes.kilometraje.toLocaleString("es-CL")} km`
                                : "—"}
                              {despues
                                ? ` → ${despues.kilometraje.toLocaleString("es-CL")} km`
                                : ""}
                            </div>
                            {recorridos !== null && (
                              <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400">
                                +{recorridos.toLocaleString("es-CL")} km recorridos
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 font-semibold text-stone-600 dark:text-stone-300">
                              <Camera className="h-3.5 w-3.5 text-brand-500" />
                              {fotosTotal} {fotosTotal === 1 ? "foto" : "fotos"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSalidaDetalle(s)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-stone-50/70 px-3 py-1.5 text-xs font-bold text-stone-700 transition hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-200 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Ver inspección
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal de Registro / Edición de Vehículo (RF-VE01) — Estilo glass-panel unificado */}
      <AnimatePresence>
        {formVehiculo && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-vehiculo-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setFormVehiculo(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={guardarVehiculo}
              className="glass-panel relative z-10 max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-3xl border border-stone-200/80 p-6 shadow-2xl sm:p-7 dark:border-white/10"
            >
              <button
                type="button"
                onClick={() => setFormVehiculo(null)}
                disabled={saving}
                aria-label="Cerrar modal"
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 dark:bg-white/5 dark:text-stone-400 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-2 flex items-start gap-3.5 pr-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                    Catálogo de flota
                  </p>
                  <h2
                    id="modal-vehiculo-titulo"
                    className="font-display text-xl font-extrabold text-stone-900 dark:text-white"
                  >
                    {formVehiculo.id
                      ? "Editar vehículo de la flota"
                      : "Registrar nuevo vehículo"}
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Ingresa los datos identificatorios de la unidad de reparto.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="vehiculo-patente" className={LABEL_CLASS}>
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
                    className={`${INPUT_CLASS} font-mono uppercase`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="vehiculo-anio" className={LABEL_CLASS}>
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
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="vehiculo-marca" className={LABEL_CLASS}>
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
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="vehiculo-modelo" className={LABEL_CLASS}>
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
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="vehiculo-descripcion" className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </div>

              {formVehiculo.id && (
                <label className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-sm font-semibold dark:border-white/5 dark:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVehiculo.activo}
                    onChange={(e) =>
                      setFormVehiculo({
                        ...formVehiculo,
                        activo: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded accent-brand-500"
                  />
                  <span>Vehículo habilitado para operación</span>
                </label>
              )}

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                >
                  {formError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setFormVehiculo(null)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {formVehiculo.id ? "Guardar cambios" : "Registrar vehículo"}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Registro de Salida (RF-VE02) — Estilo glass-panel + subida real de fotos */}
      <AnimatePresence>
        {formSalida && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-salida-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setFormSalida(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={confirmarSalidaVehiculo}
              className="glass-panel relative z-10 max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-3xl border border-stone-200/80 p-6 shadow-2xl sm:p-7 dark:border-white/10"
            >
              <button
                type="button"
                onClick={() => setFormSalida(null)}
                disabled={saving}
                aria-label="Cerrar modal"
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 dark:bg-white/5 dark:text-stone-400 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-2 flex items-start gap-3.5 pr-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                    Despacho a terreno
                  </p>
                  <h2
                    id="modal-salida-titulo"
                    className="font-display text-xl font-extrabold text-stone-900 dark:text-white"
                  >
                    Registrar salida de vehículo
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Inspección previa, kilometraje inicial y conductor o repartidor responsable.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="salida-vehiculo" className={LABEL_CLASS}>
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
                    className={INPUT_CLASS}
                  >
                    {vehiculosDisponibles.map((item) => (
                      <option
                        key={item.vehiculo.id}
                        value={item.vehiculo.id}
                        className="dark:bg-stone-900"
                      >
                        {item.vehiculo.patente} — {item.vehiculo.marca}{" "}
                        {item.vehiculo.modelo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="salida-conductor" className={LABEL_CLASS}>
                    Conductor / Repartidor asignado *
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
                    className={INPUT_CLASS}
                  >
                    {conductoresHabilitados.length === 0 ? (
                      <option value="">
                        Sin usuarios con rol conductor o repartidor
                      </option>
                    ) : (
                      conductoresHabilitados.map((c) => (
                        <option
                          key={c.id}
                          value={c.id}
                          className="dark:bg-stone-900"
                        >
                          {c.nombre} {c.apellido ?? ""} ({c.rol.nombre})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="salida-km" className={LABEL_CLASS}>
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
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="salida-estado-vehiculo"
                    className={LABEL_CLASS}
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
                    className={INPUT_CLASS}
                  >
                    {Object.values(EstadoVehiculo).map((est) => (
                      <option
                        key={est}
                        value={est}
                        className="dark:bg-stone-900"
                      >
                        {estadoTecnicoLabels[est]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="salida-observaciones" className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="salida-obs-inspeccion" className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </div>

              {/* Zona de adjunto de fotografías de salida */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Fotografías del estado inicial ({formSalida.fotos.length})
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Selecciona imágenes desde tu equipo o cámara para respaldar la salida.
                    </p>
                  </div>
                  <input
                    ref={inputFotoSalidaRef}
                    id="salida-input-fotos"
                    type="file"
                    accept="image/*"
                    multiple
                    aria-label="Seleccionar fotografías de salida"
                    onChange={(e) => void manejarSeleccionArchivosSalida(e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inputFotoSalidaRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-100 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300 cursor-pointer"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Subir fotos
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={nuevaFotoDesc}
                    onChange={(e) => setNuevaFotoDesc(e.target.value)}
                    placeholder="Descripción de la foto (ej. Frontal, Odómetro)"
                    className="flex-1 rounded-xl border border-stone-200/80 bg-white px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={() => agregarEvidenciaSalida()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500/15 px-3.5 py-2 text-xs font-bold text-brand-600 transition hover:bg-brand-500/25 dark:text-brand-400 cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Adjuntar evidencia
                  </button>
                </div>

                {formSalida.fotos.length > 0 && (
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {formSalida.fotos.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center justify-between gap-2.5 rounded-xl border border-stone-200/70 bg-white p-2 text-xs dark:border-white/10 dark:bg-stone-900"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          {f.previewUrl ? (
                            <Image
                              src={f.previewUrl}
                              alt={f.descripcion}
                              width={44}
                              height={44}
                              unoptimized
                              className="h-11 w-11 shrink-0 rounded-lg object-cover border border-stone-200 dark:border-white/10"
                            />
                          ) : (
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                              <Camera className="h-4 w-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-bold text-stone-800 dark:text-stone-200">
                              {f.descripcion}
                            </p>
                            <p className="truncate font-mono text-[10px] text-stone-400">
                              {f.nombreArchivo ?? f.rutaStorage}
                            </p>
                          </div>
                        </div>
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
                          className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
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
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                >
                  {formError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setFormSalida(null)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirmar salida
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Registro de Regreso (RF-VE03) — Estilo glass-panel + subida real de fotos */}
      <AnimatePresence>
        {formRetorno && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-retorno-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setFormRetorno(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={confirmarRetornoVehiculo}
              className="glass-panel relative z-10 max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-3xl border border-stone-200/80 p-6 shadow-2xl sm:p-7 dark:border-white/10"
            >
              <button
                type="button"
                onClick={() => setFormRetorno(null)}
                disabled={saving}
                aria-label="Cerrar modal"
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 dark:bg-white/5 dark:text-stone-400 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-2 flex items-start gap-3.5 pr-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <ArrowDownLeft className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                    Cierre de recorrido
                  </p>
                  <h2
                    id="modal-retorno-titulo"
                    className="font-display text-xl font-extrabold text-stone-900 dark:text-white"
                  >
                    Registrar regreso de {formRetorno.vehiculoPatente}
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Odómetro de salida registrado:{" "}
                    <strong>
                      {formRetorno.kilometrajeSalida.toLocaleString("es-CL")} km
                    </strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="retorno-km" className={LABEL_CLASS}>
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
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="retorno-estado-vehiculo"
                    className={LABEL_CLASS}
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
                    className={INPUT_CLASS}
                  >
                    <option
                      value={EstadoVehiculo.APTO}
                      className="dark:bg-stone-900"
                    >
                      Sin novedades (Apto)
                    </option>
                    <option
                      value={EstadoVehiculo.CON_OBSERVACIONES}
                      className="dark:bg-stone-900"
                    >
                      Con observaciones
                    </option>
                    <option
                      value={EstadoVehiculo.NO_APTO}
                      className="dark:bg-stone-900"
                    >
                      Con daño / Requiere taller (No apto)
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="retorno-obs-inspeccion"
                  className={LABEL_CLASS}
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
                  className={INPUT_CLASS}
                />
              </div>

              {/* Zona de adjunto de fotografías de retorno */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Fotografías del estado al regresar ({formRetorno.fotos.length})
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Adjunta fotos de recepción y odómetro al finalizar la ruta.
                    </p>
                  </div>
                  <input
                    ref={inputFotoRetornoRef}
                    id="retorno-input-fotos"
                    type="file"
                    accept="image/*"
                    multiple
                    aria-label="Seleccionar fotografías de retorno"
                    onChange={(e) => void manejarSeleccionArchivosRetorno(e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inputFotoRetornoRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-100 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300 cursor-pointer"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Subir fotos
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={nuevaFotoDesc}
                    onChange={(e) => setNuevaFotoDesc(e.target.value)}
                    placeholder="Descripción de la foto (ej. Tablero final, Lateral)"
                    className="flex-1 rounded-xl border border-stone-200/80 bg-white px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={() => agregarEvidenciaRetorno()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500/15 px-3.5 py-2 text-xs font-bold text-brand-600 transition hover:bg-brand-500/25 dark:text-brand-400 cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Adjuntar evidencia
                  </button>
                </div>

                {formRetorno.fotos.length > 0 && (
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {formRetorno.fotos.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center justify-between gap-2.5 rounded-xl border border-stone-200/70 bg-white p-2 text-xs dark:border-white/10 dark:bg-stone-900"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          {f.previewUrl ? (
                            <Image
                              src={f.previewUrl}
                              alt={f.descripcion}
                              width={44}
                              height={44}
                              unoptimized
                              className="h-11 w-11 shrink-0 rounded-lg object-cover border border-stone-200 dark:border-white/10"
                            />
                          ) : (
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                              <Camera className="h-4 w-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-bold text-stone-800 dark:text-stone-200">
                              {f.descripcion}
                            </p>
                            <p className="truncate font-mono text-[10px] text-stone-400">
                              {f.nombreArchivo ?? f.rutaStorage}
                            </p>
                          </div>
                        </div>
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
                          className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
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
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                >
                  {formError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setFormRetorno(null)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirmar regreso
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Detalle y Auditoría Comparativa de Inspección (RF-VE04) */}
      <AnimatePresence>
        {salidaDetalle && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-auditoria-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSalidaDetalle(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel relative z-10 max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-3xl border border-stone-200/80 p-6 shadow-2xl sm:p-7 dark:border-white/10"
            >
              {(() => {
                const antes = obtenerInspeccionMomento(salidaDetalle, "ANTES");
                const despues = obtenerInspeccionMomento(
                  salidaDetalle,
                  "DESPUES",
                );
                const recorridos = calcularKilometrosRecorridos(salidaDetalle);
                const resolverPreview = (ruta: string) => {
                  if (previewsLocales[ruta]) return previewsLocales[ruta];
                  if (
                    ruta.startsWith("http://") ||
                    ruta.startsWith("https://") ||
                    ruta.startsWith("data:") ||
                    ruta.startsWith("blob:")
                  ) {
                    return ruta;
                  }
                  return null;
                };

                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setSalidaDetalle(null)}
                      aria-label="Cerrar auditoría"
                      className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 dark:bg-white/5 dark:text-stone-400 dark:hover:bg-white/10 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-start gap-3.5 pr-8">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                          Ficha de Auditoría de Viaje
                        </p>
                        <h2
                          id="modal-auditoria-titulo"
                          className="font-display text-xl font-extrabold text-stone-900 dark:text-white"
                        >
                          {salidaDetalle.vehiculo.patente} —{" "}
                          {salidaDetalle.vehiculo.marca}{" "}
                          {salidaDetalle.vehiculo.modelo}
                        </h2>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                          Conductor: {salidaDetalle.repartidor.nombre}{" "}
                          {salidaDetalle.repartidor.apellido ?? ""}
                          {recorridos !== null
                            ? ` · Distancia recorrida: ${recorridos.toLocaleString("es-CL")} km`
                            : ""}
                        </p>
                      </div>
                    </div>

                    {salidaDetalle.observaciones && (
                      <div className="rounded-2xl border border-stone-200/70 bg-stone-50/80 px-4 py-3 text-xs text-stone-700 dark:border-white/5 dark:bg-white/5 dark:text-stone-300">
                        <span className="font-bold">
                          Observaciones de la jornada:
                        </span>{" "}
                        {salidaDetalle.observaciones}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Columna Inspección ANTES */}
                      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-sm font-extrabold text-stone-900 dark:text-stone-100">
                            Inspección de Salida (ANTES)
                          </h3>
                          {antes && (
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${estadoTecnicoChip[antes.estadoVehiculo]}`}
                            >
                              {antes.estadoVehiculo}
                            </span>
                          )}
                        </div>
                        {antes ? (
                          <div className="mt-3 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                            <p>
                              <span className="font-bold">Fecha/Hora:</span>{" "}
                              {formatearFechaHoraVehiculo(antes.registradoEn)}
                            </p>
                            <p>
                              <span className="font-bold">Odómetro:</span>{" "}
                              {antes.kilometraje.toLocaleString("es-CL")} km
                            </p>
                            <p>
                              <span className="font-bold">Notas:</span>{" "}
                              {antes.observaciones || "Sin observaciones"}
                            </p>
                            <div className="pt-2">
                              <p className="font-bold text-stone-800 dark:text-stone-200">
                                Evidencia fotográfica ({antes.fotos.length})
                              </p>
                              {antes.fotos.length === 0 ? (
                                <p className="mt-1 text-stone-400">
                                  Sin fotografías adjuntas.
                                </p>
                              ) : (
                                <ul className="mt-2 space-y-2">
                                  {antes.fotos.map((f) => {
                                    const preview = resolverPreview(
                                      f.rutaStorage,
                                    );
                                    return (
                                      <li
                                        key={f.id}
                                        className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white p-2 dark:border-white/10 dark:bg-stone-900"
                                      >
                                        {preview ? (
                                          <Image
                                            src={preview}
                                            alt={f.descripcion || "Fotografía"}
                                            width={48}
                                            height={48}
                                            unoptimized
                                            className="h-12 w-12 shrink-0 rounded-lg object-cover border border-stone-200 dark:border-white/10"
                                          />
                                        ) : (
                                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                            <Camera className="h-4 w-4" />
                                          </span>
                                        )}
                                        <div className="min-w-0">
                                          <p className="font-bold text-stone-800 dark:text-stone-200">
                                            #{f.orden} ·{" "}
                                            {f.descripcion || "Fotografía"}
                                          </p>
                                          <p className="truncate font-mono text-[10px] text-stone-400">
                                            {f.rutaStorage}
                                          </p>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="mt-3 text-xs text-stone-400">
                            Sin registro de inspección inicial.
                          </p>
                        )}
                      </div>

                      {/* Columna Inspección DESPUES */}
                      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-sm font-extrabold text-stone-900 dark:text-stone-100">
                            Inspección de Retorno (DESPUÉS)
                          </h3>
                          {despues && (
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${estadoTecnicoChip[despues.estadoVehiculo]}`}
                            >
                              {despues.estadoVehiculo}
                            </span>
                          )}
                        </div>
                        {despues ? (
                          <div className="mt-3 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                            <p>
                              <span className="font-bold">Fecha/Hora:</span>{" "}
                              {formatearFechaHoraVehiculo(despues.registradoEn)}
                            </p>
                            <p>
                              <span className="font-bold">Odómetro:</span>{" "}
                              {despues.kilometraje.toLocaleString("es-CL")} km
                            </p>
                            <p>
                              <span className="font-bold">Notas:</span>{" "}
                              {despues.observaciones || "Sin observaciones"}
                            </p>
                            <div className="pt-2">
                              <p className="font-bold text-stone-800 dark:text-stone-200">
                                Evidencia fotográfica ({despues.fotos.length})
                              </p>
                              {despues.fotos.length === 0 ? (
                                <p className="mt-1 text-stone-400">
                                  Sin fotografías adjuntas.
                                </p>
                              ) : (
                                <ul className="mt-2 space-y-2">
                                  {despues.fotos.map((f) => {
                                    const preview = resolverPreview(
                                      f.rutaStorage,
                                    );
                                    return (
                                      <li
                                        key={f.id}
                                        className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white p-2 dark:border-white/10 dark:bg-stone-900"
                                      >
                                        {preview ? (
                                          <Image
                                            src={preview}
                                            alt={f.descripcion || "Fotografía"}
                                            width={48}
                                            height={48}
                                            unoptimized
                                            className="h-12 w-12 shrink-0 rounded-lg object-cover border border-stone-200 dark:border-white/10"
                                          />
                                        ) : (
                                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                            <Camera className="h-4 w-4" />
                                          </span>
                                        )}
                                        <div className="min-w-0">
                                          <p className="font-bold text-stone-800 dark:text-stone-200">
                                            #{f.orden} ·{" "}
                                            {f.descripcion || "Fotografía"}
                                          </p>
                                          <p className="truncate font-mono text-[10px] text-stone-400">
                                            {f.rutaStorage}
                                          </p>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            El vehículo aún se encuentra en ruta (retorno pendiente).
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSalidaDetalle(null)}
                        className="rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg cursor-pointer"
                      >
                        Cerrar ficha
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
