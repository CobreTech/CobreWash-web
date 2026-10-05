"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { consultarAvisos } from "./consultar";

type Resultado = Awaited<ReturnType<typeof consultarAvisos>>;

export function useAvisos(usuarioId: string | undefined, habilitado: boolean, pagina: number) {
  const [resultado, setResultado] = useState<{ clave: string; data: Resultado } | null>(null);
  const [fallo, setFallo] = useState<{ clave: string; mensaje: string } | null>(null);
  const secuencia = useRef(0);
  const enCurso = useRef(false);
  const clave = `${usuarioId}:${pagina}`;

  const cargar = useCallback(async (silencioso = false) => {
    if (!habilitado || !usuarioId || (silencioso && enCurso.current)) return;
    const version = ++secuencia.current;
    enCurso.current = true;
    try {
      const data = await consultarAvisos(pagina);
      if (version !== secuencia.current) return;
      setResultado({ clave, data });
      setFallo(null);
    } catch {
      if (version !== secuencia.current) return;
      setFallo({ clave, mensaje: "No se pudieron cargar los avisos. Revisa tu conexión y vuelve a intentar." });
    } finally {
      if (version === secuencia.current) enCurso.current = false;
    }
  }, [clave, habilitado, pagina, usuarioId]);

  useEffect(() => {
    const solicitudes = secuencia;
    const timer = window.setTimeout(() => void cargar(), 0);
    return () => {
      window.clearTimeout(timer);
      solicitudes.current++;
      enCurso.current = false;
    };
  }, [cargar]);

  const datos = habilitado && resultado?.clave === clave ? resultado.data : null;
  const error = habilitado && fallo?.clave === clave ? fallo.mensaje : "";
  return {
    avisos: datos?.avisos ?? [], total: datos?.total ?? 0,
    cargando: habilitado && !datos && !error, error, recargar: cargar,
  };
}
