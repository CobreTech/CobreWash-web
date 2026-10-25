"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComandaEstado } from "@/src/dataconnect-generated";
import { consultarMisComandas, type PedidoCliente } from "./consultar";
import type { VistaPedidos } from "./vistas";

export function usePedidosCliente(uid: string | null, estado: ComandaEstado | null, pagina: number, vista: VistaPedidos = "todos") {
  const [datos, setDatos] = useState<{ uid: string; estado: ComandaEstado | null; pagina: number; vista: VistaPedidos; pedidos: PedidoCliente[]; total: number } | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const version = useRef(0);
  const cargar = useCallback(async () => {
    if (!uid) return;
    const actual = ++version.current;
    setCargando(true); setError("");
    try {
      const resultado = await consultarMisComandas(estado, pagina, vista);
      if (actual === version.current) setDatos({ uid, estado, pagina, vista, ...resultado });
    } catch {
      if (actual === version.current) setError("No pudimos cargar tus pedidos. Vuelve a intentarlo.");
    } finally {
      if (actual === version.current) setCargando(false);
    }
  }, [uid, estado, pagina, vista]);
  const invalidar = useCallback(() => { version.current++; }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void cargar(), 0);
    return () => { window.clearTimeout(timer); invalidar(); };
  }, [cargar, invalidar]);
  const vigentes = datos?.uid === uid && datos.estado === estado && datos.pagina === pagina && datos.vista === vista ? datos : null;
  return { pedidos: vigentes?.pedidos ?? [], total: vigentes?.total ?? 0, cargando, error, actualizar: cargar };
}
