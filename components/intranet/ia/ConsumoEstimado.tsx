"use client";

import { AlertTriangle, BrainCircuit, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { estimarConsumoComanda, leerPesoKg, type ModeloComanda } from "@/lib/ia/comanda";
import type { NivelStock } from "@/lib/ia/prediccion";

const NIVEL: Record<NivelStock, { etiqueta: string; icono: React.ElementType; clase: string }> = {
  ok: { etiqueta: "Alcanza", icono: CheckCircle2, clase: "bg-green-500/10 text-green-700 dark:text-green-400" },
  justo: { etiqueta: "Justo, sin margen", icono: AlertTriangle, clase: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  insuficiente: { etiqueta: "No alcanza", icono: XCircle, clase: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

/** Rango en una misma unidad legible: "150 a 180 ml" o "2,1 a 2,6 L". */
function rango(minimo: number, maximo: number, unidad: string) {
  const sub = unidad === "L" ? "ml" : unidad === "kg" ? "g" : null;
  const factor = sub && maximo < 1 ? 1000 : 1;
  const f = (v: number) => (v * factor).toLocaleString("es-CL", { maximumFractionDigits: v * factor < 10 ? 2 : v * factor < 100 ? 1 : 0 });
  return `${f(minimo)} a ${f(maximo)} ${factor === 1000 ? sub : unidad}`;
}

/**
 * Consumo de insumos estimado para la comanda que se está registrando. Solo
 * informa: no impide guardar ni modifica el stock. La recepción ve si alcanza;
 * administración además ve el stock disponible.
 */
export default function ConsumoEstimado({ modelo, error, servicioId, servicioNombre, pesoTexto, verStock }: {
  modelo: ModeloComanda | null;
  error: boolean;
  servicioId: string | null;
  servicioNombre: string;
  pesoTexto: string;
  verStock: boolean;
}) {
  const kg = leerPesoKg(pesoTexto);
  let contenido: React.ReactNode;
  if (error) contenido = <p className="text-xs text-stone-400">No se pudo cargar la estimación. Puedes guardar la comanda igualmente.</p>;
  else if (!modelo) contenido = <p className="flex items-center gap-2 text-xs text-stone-400"><Loader2 className="h-3.5 w-3.5 animate-spin" />Cargando estimación…</p>;
  else if (kg === null) contenido = <p className="text-xs text-stone-500 dark:text-stone-400">Ingresa el peso total para estimar el consumo de insumos.</p>;
  else {
    const r = servicioId ? estimarConsumoComanda(modelo, servicioId, kg) : null;
    if (!r || !r.insumos.length) {
      contenido = <p className="text-xs text-stone-500 dark:text-stone-400">El servicio «{servicioNombre || "sin servicio"}» aún no tiene tasas de consumo en el Módulo IA.</p>;
    } else {
      const faltan = r.insumos.filter((i) => i.nivel === "insuficiente");
      contenido = (
        <div className="space-y-2">
          <ul className="space-y-1.5">
            {r.insumos.map((i) => {
              const n = NIVEL[i.nivel];
              return (
                <li key={i.insumoId} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-stone-700 dark:text-stone-200">{i.nombre}</span>
                  <span className="ml-auto text-stone-600 dark:text-stone-300">{rango(i.minimo, i.maximo, i.unidad)}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${n.clase}`}>
                    <n.icono className="h-3 w-3" aria-hidden />{n.etiqueta}
                    {verStock && <span className="font-normal opacity-80">· stock {i.stockActual.toLocaleString("es-CL", { maximumFractionDigits: 2 })} {i.unidad}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          {faltan.length > 0 && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              No hay stock suficiente de {faltan.map((i) => i.nombre).join(", ")} para esta comanda. Avisa a administración antes de procesarla.
            </p>
          )}
        </div>
      );
    }
  }
  return (
    <section aria-label="Consumo estimado de insumos" className="space-y-2 rounded-xl border border-brand-200/70 bg-brand-500/5 p-3 dark:border-brand-500/20">
      <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
        <BrainCircuit className="h-3.5 w-3.5" />Consumo estimado
        <span className="font-normal normal-case tracking-normal text-stone-400">· Módulo IA</span>
      </h3>
      {contenido}
    </section>
  );
}
