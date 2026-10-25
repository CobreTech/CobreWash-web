"use client";
import { Package, ChevronDown, CalendarDays } from "lucide-react";
import { fechaSeguimiento, presentarPedido } from "@/lib/seguimiento/publico";
import type { PedidoCliente } from "@/lib/portal/consultar";
import AvancePedido, { EstadoPedido } from "@/components/seguimiento/AvancePedido";
import QrPedido from "@/components/seguimiento/QrPedido";
const clp = (valor: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(valor);
export default function DetallePedido({ pedido }: { pedido: PedidoCliente }) {
  const vista = presentarPedido(pedido);
  return <details className="group glass-card overflow-hidden rounded-3xl bg-white/75 shadow-premium">
    <summary className="grid cursor-pointer list-none grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 p-5 sm:flex sm:flex-wrap sm:gap-4 sm:p-6 [&::-webkit-details-marker]:hidden">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Package className="h-6 w-6" /></span>
      <span className="min-w-0 flex-1"><span className="break-words font-display text-base font-extrabold text-stone-900">{pedido.numeroComanda}</span><span className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs text-stone-500"><CalendarDays className="h-3.5 w-3.5 shrink-0" />{fechaSeguimiento(pedido.fechaRecepcion)}</span></span>
      <span className={`col-start-2 row-start-2 w-fit rounded-full px-3 py-1.5 text-[11px] font-bold ${pedido.estado === "ANULADA" ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"}`}>{vista.estado}</span>
      <span className="col-start-3 row-start-2 text-sm font-extrabold text-stone-800">{clp(pedido.valorTotal)}</span><ChevronDown className="col-start-3 row-start-1 h-5 w-5 justify-self-end text-stone-400 transition-transform group-open:rotate-180" />
    </summary>
    <div className="space-y-6 border-t border-stone-100 p-5 sm:p-6">
      <EstadoPedido estado={pedido.estado} />
      <dl className="grid gap-3 text-xs sm:grid-cols-2"><div className="rounded-xl bg-stone-50/70 p-4"><dt className="text-stone-500">Servicios</dt><dd className="mt-1 font-semibold text-stone-700">{vista.servicios}</dd></div><div className="rounded-xl bg-stone-50/70 p-4"><dt className="text-stone-500">Entrega estimada</dt><dd className="mt-1 font-semibold text-stone-700">{fechaSeguimiento(pedido.fechaEntregaEstimada)}</dd></div>{pedido.fechaEntregaReal && <div className="rounded-xl bg-stone-50/70 p-4 sm:col-span-2"><dt className="text-stone-500">Entregado el</dt><dd className="mt-1 font-semibold text-stone-700">{fechaSeguimiento(pedido.fechaEntregaReal)}</dd></div>}</dl>
      <div className="overflow-x-auto rounded-2xl border border-stone-100"><table className="w-full min-w-[440px] text-left text-sm"><caption className="sr-only">Detalle de prendas y servicios de {pedido.numeroComanda}</caption><thead className="bg-stone-50 text-[11px] uppercase tracking-wide text-stone-500"><tr><th className="p-3">Prenda</th><th className="p-3">Servicio</th><th className="p-3">Cantidad / peso</th><th className="p-3 text-right">Subtotal</th></tr></thead><tbody>{pedido.comandaDetalles_on_comanda.map(d => <tr key={d.id} className="border-t border-stone-100"><td className="p-3 font-semibold text-stone-700">{d.tipoPrenda.nombre}</td><td className="p-3 text-stone-500">{d.tipoServicio.nombre}</td><td className="p-3 text-stone-500">{d.cantidad}{d.pesoKg != null ? ` / ${d.pesoKg} kg` : ""}</td><td className="p-3 text-right font-semibold text-stone-700">{clp(d.subtotal)}</td></tr>)}</tbody><tfoot className="border-t border-brand-100 bg-brand-50/50"><tr><th colSpan={3} className="p-3 text-brand-800">Total</th><td className="p-3 text-right font-extrabold text-brand-800">{clp(pedido.valorTotal)}</td></tr></tfoot></table></div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]"><AvancePedido vista={vista} estado={pedido.estado} /><QrPedido codigoQr={pedido.codigoQr} numeroComanda={pedido.numeroComanda} /></div>
      <p className="text-[11px] text-stone-500">Último cambio: {fechaSeguimiento(pedido.actualizadoEn)}</p>
    </div>
  </details>;
}
