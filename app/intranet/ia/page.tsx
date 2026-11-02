"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrainCircuit, Database, Loader2, Table2 } from "lucide-react";
import { QueryFetchPolicy } from "firebase/data-connect";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import DatosIa from "@/components/intranet/ia/DatosIa";
import TasasIa from "@/components/intranet/ia/TasasIa";
import { AvisoFlotante, type Aviso } from "@/components/intranet/ia/ui";
import { dataConnect } from "@/lib/firebase/client";
import { registrarError } from "@/lib/registro-seguro";
import { getPanelIa, type GetPanelIaData } from "@/src/dataconnect-generated";

const PESTANAS = [
  { id: "tasas", etiqueta: "Tasas", icono: Table2 },
  { id: "datos", etiqueta: "Datos", icono: Database },
] as const;
type Pestana = (typeof PESTANAS)[number]["id"];

export default function ModuloIaPage() {
  const permitido = useRoleGuard(["admin"]);
  const [pestana, setPestana] = useState<Pestana>("tasas");
  const [panel, setPanel] = useState<GetPanelIaData | null>(null);
  const [error, setError] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const temporizador = useRef<number | undefined>(undefined);
  const solicitud = useRef(0);

  const avisar = useCallback((texto: string, tipo: Aviso["tipo"] = "success") => {
    setAviso({ texto, tipo });
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setAviso(null), 5000);
  }, []);

  const recargar = useCallback(async () => {
    const actual = ++solicitud.current;
    try {
      const { data } = await getPanelIa(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
      if (actual === solicitud.current) { setPanel(data); setError(false); }
    } catch (e) {
      registrarError("No se pudo cargar el módulo IA", e);
      if (actual === solicitud.current) setError(true);
    }
  }, []);

  useEffect(() => {
    if (permitido) void Promise.resolve().then(recargar);
    return () => window.clearTimeout(temporizador.current);
  }, [permitido, recargar]);

  // Navegación con flechas entre pestañas, según el patrón ARIA de tabs.
  const moverConTeclado = (e: React.KeyboardEvent, indice: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const siguiente = (indice + (e.key === "ArrowRight" ? 1 : -1) + PESTANAS.length) % PESTANAS.length;
    setPestana(PESTANAS[siguiente].id);
    document.getElementById(`pestana-ia-${PESTANAS[siguiente].id}`)?.focus();
  };

  if (!permitido || (!panel && !error)) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="min-h-screen space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
      <AvisoFlotante aviso={aviso} />
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400"><BrainCircuit className="h-3 w-3" />Predicción de insumos</div>
        <h1 className="font-display text-2xl font-extrabold dark:text-white">Módulo IA</h1>
        <p className="mt-1 text-sm text-stone-500">Estima el consumo de insumos por comanda y aprende de cada conteo físico. Nunca modifica el stock.</p>
      </div>

      <div role="tablist" aria-label="Secciones del módulo IA" className="flex gap-2 overflow-x-auto">
        {PESTANAS.map((p, i) => (
          <button
            key={p.id} id={`pestana-ia-${p.id}`} role="tab" type="button"
            aria-selected={pestana === p.id} aria-controls={`panel-ia-${p.id}`} tabIndex={pestana === p.id ? 0 : -1}
            onClick={() => setPestana(p.id)} onKeyDown={(e) => moverConTeclado(e, i)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${pestana === p.id ? "bg-brand-500 text-white shadow-premium" : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"}`}
          >
            <p.icono className="h-4 w-4" />{p.etiqueta}
          </button>
        ))}
      </div>

      {error || !panel ? (
        <div role="alert" className="glass-panel rounded-2xl p-6 text-center text-sm text-stone-500">
          No se pudo cargar el módulo IA.
          <button type="button" onClick={() => void recargar()} className="ml-2 font-bold text-brand-600 hover:underline">Reintentar</button>
        </div>
      ) : (
        <div role="tabpanel" id={`panel-ia-${pestana}`} aria-labelledby={`pestana-ia-${pestana}`}>
          {pestana === "tasas" && <TasasIa panel={panel} recargar={recargar} avisar={avisar} />}
          {pestana === "datos" && <DatosIa panel={panel} recargar={recargar} avisar={avisar} />}
        </div>
      )}
    </div>
  );
}
