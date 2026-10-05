"use client";

import { useEffect, useMemo, useState } from "react";
import { consultarFiltrosReportes, consultarReporte } from "./consultar";
import { errorRango } from "./fechas";
import type { FiltrosReporte, Reporte, VistaReporte } from "./modelo";

export function useReportes(
  usuarioId: string | undefined,
  habilitado: boolean,
  vista: VistaReporte,
  filtros: FiltrosReporte,
) {
  const { desde, hasta, clienteId, empresa, servicioId } = filtros;
  const filtrosEstables = useMemo(
    () => ({ desde, hasta, clienteId, empresa, servicioId }),
    [desde, hasta, clienteId, empresa, servicioId],
  );
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState<{
    clave: string;
    datos?: Reporte;
    error?: string;
  } | null>(null);
  const [catalogos, setCatalogos] = useState<{
    usuarioId: string;
    datos?: Awaited<ReturnType<typeof consultarFiltrosReportes>>;
    error?: string;
  } | null>(null);
  const clave = JSON.stringify([usuarioId, vista, filtros, version]);
  const validacion = errorRango(filtros.desde, filtros.hasta);

  useEffect(() => {
    if (!habilitado || !usuarioId) return;
    let vigente = true;
    consultarFiltrosReportes()
      .then((datos) => {
        if (vigente) setCatalogos({ usuarioId, datos });
      })
      .catch(() => {
        if (vigente)
          setCatalogos({
            usuarioId,
            error: "No se pudieron cargar los filtros. Vuelve a intentar.",
          });
      });
    return () => {
      vigente = false;
    };
  }, [usuarioId, habilitado, version]);

  useEffect(() => {
    if (!habilitado || !usuarioId || validacion) return;
    let vigente = true;
    consultarReporte(vista, filtrosEstables)
      .then((datos) => {
        if (vigente) setResultado({ clave, datos });
      })
      .catch(() => {
        if (vigente)
          setResultado({
            clave,
            error:
              "No se pudo generar el reporte. Revisa tu conexión y vuelve a intentar.",
          });
      });
    return () => {
      vigente = false;
    };
  }, [clave, usuarioId, habilitado, vista, filtrosEstables, validacion]);

  const actual = habilitado && resultado?.clave === clave ? resultado : null;
  const filtrosActuales =
    habilitado && catalogos?.usuarioId === usuarioId ? catalogos : null;
  return {
    datos: actual?.datos ?? null,
    error: validacion || actual?.error || filtrosActuales?.error || "",
    cargando: habilitado && !validacion && !actual,
    catalogos: filtrosActuales?.datos,
    recargar: () => setVersion((v) => v + 1),
  };
}
