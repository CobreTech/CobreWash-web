import { ArrowUpRight, MapPin, PackageCheck, Shirt, Truck } from "lucide-react";

export default function About() {
  return <section id="nosotros" className="relative overflow-hidden bg-stone-50/60 py-20 sm:py-24">
    <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
      <div className="space-y-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-650">Conoce El Cobre</p><h2 className="font-display text-3xl font-extrabold leading-tight text-stone-900 sm:text-4xl">Cuidado para tus prendas.<br /><span className="text-brand-600">Cercanía en cada entrega.</span></h2><p className="max-w-xl text-base leading-relaxed text-stone-600">Somos Lavandería El Cobre, en Calama. Atendemos a particulares y empresas con servicios de lavado, cuidado de textiles y coordinación de retiro y entrega.</p>
        <div className="rounded-2xl border-l-4 border-brand-500 bg-white/70 px-5 py-4 shadow-sm"><h3 className="font-display text-lg font-bold text-stone-900">Nuestro propósito</h3><p className="mt-2 text-sm leading-relaxed text-stone-600">Facilitar el cuidado de tus textiles con una atención cercana, procesos organizados y un seguimiento claro desde la recepción hasta la entrega.</p></div>
        <a href="#recepcion" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition-colors hover:text-brand-600"><MapPin className="h-4 w-4" />Conoce nuestra recepción en Calama<ArrowUpRight className="h-4 w-4" /></a>
      </div>
      <div className="glass-card space-y-2 rounded-3xl bg-white/65 p-5 shadow-premium sm:p-7"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Así acompañamos tu pedido</p>{[
        { icon: Shirt, titulo: "Atención según tus prendas", texto: "Coordinamos el servicio para tus textiles personales, uniformes y ropa de trabajo." },
        { icon: PackageCheck, titulo: "Cada pedido, identificado", texto: "Tu comanda permite consultar el avance y conservar la referencia de tu pedido." },
        { icon: Truck, titulo: "Recepción y entrega coordinadas", texto: "Consulta en recepción las opciones de atención y la disponibilidad de retiro y entrega." },
      ].map(({ icon: Icon, titulo, texto }) => <div key={titulo} className="flex gap-4 rounded-2xl p-3 sm:p-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-bold text-stone-900">{titulo}</h3><p className="mt-2 text-sm leading-relaxed text-stone-500">{texto}</p></div></div>)}</div>
    </div>
  </section>;
}
