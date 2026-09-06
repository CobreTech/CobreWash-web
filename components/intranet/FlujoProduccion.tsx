import { CheckCircle2, Clock } from "lucide-react";
import { progresoProduccion, type EtapaVisible } from "@/lib/produccion/modelo";

export default function FlujoProduccion({ etapas }: { etapas: EtapaVisible[] }) {
  if (!etapas.length) return <p className="text-sm text-stone-500">Esta comanda no tiene un flujo de producción asociado.</p>;
  const porcentaje = progresoProduccion(etapas);
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-semibold"><span>Flujo de producción</span><span>{porcentaje}%</span></div>
      <div role="progressbar" aria-label="Etapas completadas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={porcentaje} className="h-2 rounded-full bg-stone-200 dark:bg-stone-800">
        <div className="h-2 rounded-full bg-brand-500" style={{ width: porcentaje + "%" }} />
      </div>
      <ol className="space-y-2">
        {etapas.map((etapa) => (
          <li key={etapa.id} className="flex items-start gap-3 rounded-xl bg-stone-50 p-3 dark:bg-white/5">
            {etapa.estado === "COMPLETADA" ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" /> : <Clock className="mt-0.5 h-4 w-4 text-stone-400" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{etapa.orden}. {etapa.nombre}</p>
              {etapa.descripcion && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{etapa.descripcion}</p>}
              {etapa.tiempoEstimadoMin != null && <p className="mt-1 text-xs text-stone-500">Tiempo estimado: {etapa.tiempoEstimadoMin} min</p>}
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {etapa.estado === "COMPLETADA" ? "Completada" : etapa.estado === "EN_PROCESO" ? "En proceso" : etapa.estado === "PENDIENTE" ? "Pendiente" : "Estado desconocido"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
