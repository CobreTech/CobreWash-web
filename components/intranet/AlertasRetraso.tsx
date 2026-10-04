"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { useUsuarioActualContext } from "./AuthGuard";
import { consultarComandasAlertas } from "@/lib/produccion/consultar-alertas";
import { detectarAlertas, type ComandaAlerta } from "@/lib/produccion/alertas";
import { formatearDuracion } from "@/lib/produccion/duracion";

const Contexto = createContext({ alertas: [] as ReturnType<typeof detectarAlertas>, error: "", cargando: false, refrescar: () => {} });
export const useAlertasRetraso = () => useContext(Contexto);

export function AlertasRetrasoProvider({ children }: { children: React.ReactNode }) {
  const usuario = useUsuarioActualContext();
  const adminId = usuario?.rol.nombre === "admin" ? usuario.id : null;
  const [datos, setDatos] = useState<{ usuarioId: string; comandas: ComandaAlerta[] } | null>(null);
  const [ahora, setAhora] = useState(0);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [revision, setRevision] = useState(0);
  const refrescar = useCallback(() => setRevision((r) => r + 1), []);

  useEffect(() => {
    if (!adminId) return;
    let vigente = true;
    let pendiente = false;
    const cargar = async () => {
      if (pendiente || document.visibilityState === "hidden") return;
      pendiente = true;
      setCargando(true);
      try {
        const comandas = await consultarComandasAlertas(() => vigente);
        if (vigente && comandas) {
          setDatos({ usuarioId: adminId, comandas }); setAhora(Date.now()); setError("");
        }
      } catch {
        if (vigente) setError("No se pudieron actualizar las alertas de retraso. Los datos anteriores pueden estar desactualizados.");
      } finally {
        pendiente = false;
        if (vigente) setCargando(false);
      }
    };
    void cargar();
    const timer = window.setInterval(() => void cargar(), 30_000);
    const reloj = window.setInterval(() => { if (document.visibilityState === "visible") setAhora(Date.now()); }, 10_000);
    const actualizar = () => void cargar();
    window.addEventListener("focus", actualizar);
    document.addEventListener("visibilitychange", actualizar);
    return () => {
      vigente = false; window.clearInterval(timer); window.clearInterval(reloj);
      window.removeEventListener("focus", actualizar); document.removeEventListener("visibilitychange", actualizar);
    };
  }, [adminId, revision]);

  const alertas = useMemo(() => adminId && datos?.usuarioId === adminId ? detectarAlertas(datos.comandas, ahora) : [], [adminId, datos, ahora]);
  return <Contexto.Provider value={{ alertas, error: adminId ? error : "", cargando, refrescar }}>{children}</Contexto.Provider>;
}

export default function AlertasRetraso() {
  const usuario = useUsuarioActualContext();
  const { alertas, error, cargando, refrescar } = useAlertasRetraso();
  if (usuario?.rol.nombre !== "admin" || (!alertas.length && !error)) return null;
  return <section id="alertas-retraso" className="mx-4 mt-4 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-red-900 sm:mx-6 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2" role="status" aria-live="polite"><AlertTriangle className="h-5 w-5 shrink-0" /><h2 className="text-sm font-bold">{alertas.length ? `${alertas.length} comanda${alertas.length === 1 ? "" : "s"} con tiempo de etapa excedido` : "Alertas de retraso"}</h2></div>
      <button onClick={refrescar} disabled={cargando} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-red-100 disabled:opacity-50 dark:hover:bg-white/5"><RefreshCw className={`h-4 w-4 ${cargando ? "animate-spin" : ""}`} />Actualizar alertas</button>
    </div>
    {error && <p role="alert" className="mt-2 text-xs">{error}</p>}
    {alertas.length > 0 && <details className="mt-2" open={alertas.length === 1}>
      <summary className="cursor-pointer text-xs font-semibold">Ver comandas y actuar ante los retrasos</summary>
      <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
        {alertas.map((a) => <li key={a.id}><Link href={a.href} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/70 p-3 text-xs hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"><span><strong>{a.numeroComanda}</strong> · {a.etapa}<span className="mt-1 block opacity-80">Límite: {formatearDuracion(a.esperadoMin)} · Excedido: {formatearDuracion(a.excedidoMin)} · {a.responsable}</span></span><span className="flex items-center gap-1 font-bold">Abrir comanda<ArrowRight className="h-3.5 w-3.5" /></span></Link></li>)}
      </ul>
    </details>}
  </section>;
}
