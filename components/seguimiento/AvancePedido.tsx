import { Check, CheckCircle2, CircleX, Clock3, Package, PackageCheck, WashingMachine } from "lucide-react";
import { ESTADOS_PUBLICOS, fechaSeguimiento, type presentarPedido } from "@/lib/seguimiento/publico";

const estados = {
  PENDIENTE: { icon: Package, titulo: "Recibimos tu pedido", texto: "Aquí podrás consultar el avance de tus prendas a medida que se registre." },
  EN_PROCESO: { icon: WashingMachine, titulo: "Tus prendas están en proceso", texto: "Estamos trabajando en tu pedido. Revisa las etapas y sus últimos avances." },
  FINALIZADA: { icon: CheckCircle2, titulo: "Tu pedido está listo", texto: "Coordina el retiro o la entrega de tus prendas con recepción." },
  ENTREGADA: { icon: PackageCheck, titulo: "Pedido entregado", texto: "Este pedido figura como entregado. Puedes consultar su historial registrado." },
  ANULADA: { icon: CircleX, titulo: "Pedido anulado", texto: "Si necesitas información sobre la anulación, contacta a recepción." },
};

export function EstadoPedido({ estado }: { estado: string }) {
  const dato = estados[estado as keyof typeof estados];
  const Icon = dato?.icon || Package;
  return <div className={`flex items-start gap-4 rounded-2xl border p-5 ${estado === "ANULADA" ? "border-red-200 bg-red-50/70" : "border-brand-200/70 bg-gradient-to-br from-brand-50 to-copper-50/70"}`}>
    <span className={`rounded-2xl p-3 shadow-premium ${estado === "ANULADA" ? "bg-red-100 text-red-600" : "bg-gradient-brand text-white"}`}><Icon className="h-6 w-6" /></span>
    <div><p className={`text-[10px] font-bold uppercase tracking-widest ${estado === "ANULADA" ? "text-red-700" : "text-brand-700"}`}>{ESTADOS_PUBLICOS[estado] || "Estado no disponible"}</p><h3 className="mt-1 font-display text-lg font-extrabold text-stone-900">{dato?.titulo || "Consulta tu pedido"}</h3><p className="mt-2 text-xs leading-relaxed text-stone-600">{dato?.texto || "Puedes volver a consultar el estado en unos momentos."}</p></div>
  </div>;
}

export default function AvancePedido({ vista, estado }: { vista: ReturnType<typeof presentarPedido>; estado: string }) {
  const terminal = ["FINALIZADA", "ENTREGADA", "ANULADA"].includes(estado);
  return <section className="space-y-5" aria-label="Avance del pedido">
    <div className="flex items-center justify-between gap-3"><h3 className="font-display text-lg font-extrabold text-stone-900">El recorrido de tus prendas</h3>{vista.progreso !== null && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{vista.progreso}% registrado</span>}</div>
    {vista.etapas.length ? <>
      <div role="progressbar" aria-label="Etapas completadas" aria-valuenow={vista.progreso ?? 0} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-stone-100"><div className={`h-full rounded-full transition-[width] duration-500 ${estado === "ANULADA" ? "bg-stone-400" : "bg-gradient-brand"}`} style={{ width: `${vista.progreso}%` }} /></div>
      <ol>{vista.etapas.map((etapa, indice) => {
        const completada = etapa.estado === "COMPLETADA", activa = etapa.estado === "EN_PROCESO" && !terminal;
        const texto = completada ? "Completada" : etapa.estado === "EN_PROCESO" ? estado === "ANULADA" ? "Interrumpida" : terminal ? "Sin cierre registrado" : "En curso" : "Pendiente";
        return <li key={`${etapa.orden}-${indice}`} className="relative flex gap-4 pb-6 last:pb-0">
          {indice < vista.etapas.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[19px] top-10 w-0.5 ${completada ? "bg-brand-200" : "bg-stone-100"}`} />}
          <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${completada ? "border-brand-500 bg-gradient-brand text-white shadow-premium" : activa ? "border-brand-300 bg-brand-50 text-brand-600 ring-4 ring-brand-50/80" : "border-stone-200 bg-white text-stone-400"}`}>{completada ? <Check className="h-5 w-5" /> : activa ? <WashingMachine className="h-5 w-5" /> : indice + 1}</span>
          <div className={`min-w-0 flex-1 rounded-2xl px-4 py-3 ${activa ? "border border-brand-100 bg-brand-50/60" : "bg-stone-50/70"}`}><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-stone-800">{etapa.nombre}</p><span className={`text-[11px] font-semibold ${completada || activa ? "text-brand-700" : "text-stone-500"}`}>{texto}</span></div>{etapa.fechaCompletado && <p className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500"><Clock3 className="h-3.5 w-3.5" />{fechaSeguimiento(etapa.fechaCompletado)}</p>}</div>
        </li>;
      })}</ol>
      {terminal && vista.progreso !== 100 && <p className="text-xs leading-relaxed text-stone-500">El estado general es «{vista.estado}». Algunas etapas históricas no tienen cierre registrado.</p>}
    </> : <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/70 p-5 text-sm leading-relaxed text-stone-500">Este pedido no tiene etapas registradas. Su estado actual es: {vista.estado.toLowerCase()}.</p>}
  </section>;
}
