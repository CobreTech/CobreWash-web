"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { consultarSeguimiento } from "./consultar";
import { validarConsulta, type ConsultaSeguimiento, type PedidoPublico } from "./publico";

export function useSeguimientoPublico() {
  const [pedido, setPedido] = useState<PedidoPublico | null>(null);
  const [error, setError] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [consultado, setConsultado] = useState(false);
  const [consulta, setConsulta] = useState<ConsultaSeguimiento | null>(null);
  const secuencia = useRef(0);
  const enCurso = useRef(false);

  const ejecutar = useCallback(async (entrada: ConsultaSeguimiento, actualizar = false) => {
    // El polling no desplaza una búsqueda ni acumula peticiones lentas.
    if (actualizar && enCurso.current) return;
    const version = ++secuencia.current;
    enCurso.current = true;
    let validada: ConsultaSeguimiento;
    try { validada = validarConsulta(entrada); }
    catch (error) {
      setError(error instanceof Error ? error.message : "Código inválido.");
      setConsulta(null); setPedido(null); setConsultado(false); setBuscando(false);
      enCurso.current = false;
      return;
    }
    setConsulta(validada); setError(""); setBuscando(true);
    if (!actualizar) { setPedido(null); setConsultado(false); }
    try {
      const resultado = await consultarSeguimiento(validada);
      if (version !== secuencia.current) return;
      setPedido(resultado); setConsultado(true);
    } catch {
      if (version !== secuencia.current) return;
      setError("No se pudo consultar el pedido. Revisa tu conexión y vuelve a intentar.");
    } finally {
      if (version === secuencia.current) { setBuscando(false); enCurso.current = false; }
    }
  }, []);

  useEffect(() => () => { secuencia.current++; enCurso.current = false; }, []);

  useEffect(() => {
    if (!consulta) return;
    const actualizar = () => {
      if (document.visibilityState === "visible") void ejecutar(consulta, true);
    };
    const timer = window.setInterval(actualizar, 30_000);
    document.addEventListener("visibilitychange", actualizar);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", actualizar); };
  }, [consulta, ejecutar]);

  return { pedido, error, buscando, consultado, consulta, ejecutar, actualizar: () => consulta && ejecutar(consulta, true) };
}
