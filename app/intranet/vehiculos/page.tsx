"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RotateCcw, Truck } from "lucide-react";
import { QueryFetchPolicy, subscribe } from "firebase/data-connect";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { dataConnect } from "@/lib/firebase/client";
import {
  getFlotaVehiculos,
  getFlotaVehiculosRef,
  type GetFlotaVehiculosData,
} from "@/src/dataconnect-generated";
import type { ConductorFlota, SalidaFlota, VehiculoFlota } from "@/lib/vehiculos/modelo";
import { construirResumenFlota } from "@/lib/vehiculos/validaciones";

export default function VehiculosPage() {
  const permitido = useRoleGuard(["admin"]);
  const [vehiculos, setVehiculos] = useState<VehiculoFlota[]>([]);
  const [conductores, setConductores] = useState<ConductorFlota[]>([]);
  const [salidas, setSalidas] = useState<SalidaFlota[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const solicitudActual = useRef(0);

  const aplicarDatos = useCallback((data: GetFlotaVehiculosData) => {
    setVehiculos(data.vehiculos);
    setConductores(data.conductores);
    setSalidas(data.salidas);
    setErrorMsg("");
    setLoading(false);
  }, []);

  const cargarFlota = useCallback(async (silencioso = false) => {
    const solicitud = ++solicitudActual.current;
    if (!silencioso) setLoading(true);
    try {
      const result = await getFlotaVehiculos(dataConnect, {
        fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
      });
      if (solicitud === solicitudActual.current) aplicarDatos(result.data);
    } catch (error) {
      console.error("No se pudo cargar la flota de vehículos:", error);
      if (!silencioso) setErrorMsg("No se pudo cargar la información de la flota.");
    } finally {
      if (solicitud === solicitudActual.current) setLoading(false);
    }
  }, [aplicarDatos]);

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
    const alVolver = () => document.visibilityState === "visible" && refrescar();
    window.addEventListener("focus", refrescar);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      cancelar();
      window.removeEventListener("focus", refrescar);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [aplicarDatos, cargarFlota, permitido]);

  const { kpis } = useMemo(
    () => construirResumenFlota(vehiculos, salidas),
    [vehiculos, salidas],
  );

  if (!permitido) return null;

  return (
    <div className="space-y-6">
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
            {kpis.total} vehículos registrados · {conductores.length} conductores habilitados
          </p>
        </div>
        <button
          type="button"
          onClick={() => void cargarFlota(false)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          Actualizar
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-stone-900 dark:text-red-300">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
