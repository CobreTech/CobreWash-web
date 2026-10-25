"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Package, QrCode, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, CalendarDays, Clock3, Loader2, PackageCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AvancePedido, { EstadoPedido } from "@/components/seguimiento/AvancePedido";
import QrPedido from "@/components/seguimiento/QrPedido";
import { useSeguimientoPublico } from "@/lib/seguimiento/useSeguimientoPublico";
import { presentarPedido, fechaSeguimiento } from "@/lib/seguimiento/publico";

function SeguimientoContent() {
  const searchParams = useSearchParams();
  const qrParametro = searchParams.get("qr");
  const codigoParametro = searchParams.get("codigo");
  const [codigo, setCodigo] = useState(codigoParametro ?? "");
  const { pedido, error, buscando, consultado, consulta, ejecutar, actualizar } = useSeguimientoPublico();
  const vista = pedido ? presentarPedido(pedido) : null;

  useEffect(() => {
    if (qrParametro !== null) void ejecutar({ tipo: "qr", valor: qrParametro });
    else if (codigoParametro !== null) void ejecutar({ tipo: "numero", valor: codigoParametro });
  }, [qrParametro, codigoParametro, ejecutar]);

  return <>
    <Navbar paginaInterior />
    <main className="relative isolate min-h-screen overflow-hidden pb-16 pt-32 text-stone-900 sm:pb-24 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] bg-gradient-to-b from-brand-50/90 via-copper-50/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-40 -z-10 h-80 w-80 rounded-full bg-copper-100/60 blur-3xl" />
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <header className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/70 px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest text-brand-700"><Package className="h-4 w-4" />Siempre al tanto de tus prendas</span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Seguimiento <span className="text-brand-600">de tu pedido</span></h1>
            <div className="h-1 w-20 rounded-full bg-brand-500" />
            <p className="text-base leading-relaxed text-stone-600">Consulta tu comanda y acompaña el recorrido de tus prendas, desde su recepción hasta la entrega.</p>
          </div>
          <div className="glass-card flex items-start gap-3 rounded-2xl bg-white/60 p-5 shadow-premium"><span className="rounded-xl bg-brand-50 p-2.5 text-brand-600"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-sm font-bold">Consulta sin iniciar sesión</p><p className="mt-1 text-xs leading-relaxed text-stone-500">El seguimiento muestra el avance del pedido. El detalle de tu cuenta se mantiene privado.</p></div></div>
        </header>

        <form onSubmit={event => { event.preventDefault(); void ejecutar({ tipo: "numero", valor: codigo }); }} className="glass-card space-y-4 rounded-3xl bg-white/70 p-5 shadow-premium backdrop-blur-lg sm:p-6">
          <label htmlFor="numero-comanda" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600"><Search className="h-4 w-4 text-brand-600" />Número de comanda</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="numero-comanda" required maxLength={20} value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ej: ELCOBRE-14r3 o 14r3" className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3.5 text-sm font-semibold text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10" />
            <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-7 py-3.5 text-sm font-bold text-white shadow-premium transition-shadow hover:shadow-lg">{buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}Buscar pedido</button>
          </div>
          <p className="text-xs text-stone-500">Encontrarás el número y el QR en el comprobante que recibiste al ingresar tus prendas.</p>
        </form>

        <div aria-live="polite" aria-busy={buscando} className="space-y-5">
          {buscando && <p role="status" className="flex items-center gap-2 rounded-xl bg-white/60 px-4 py-3 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin text-brand-600" />{pedido ? "Actualizando pedido…" : "Consultando pedido…"}</p>}
          {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"><p className="flex items-center gap-2"><AlertCircle className="h-5 w-5 shrink-0" />{error}</p>{pedido && <p className="mt-2">Se muestra la última información recibida.</p>}{consulta && <button disabled={buscando} onClick={() => void actualizar()} className="mt-3 font-bold underline disabled:opacity-50">Reintentar</button>}</div>}
          {consultado && !pedido && !error && !buscando && <div role="status" className="glass-card space-y-3 rounded-3xl bg-white/70 px-6 py-10 text-center shadow-premium"><Package className="mx-auto h-10 w-10 text-brand-400" /><p className="font-display text-lg font-bold">No encontramos ese pedido</p><p className="text-sm text-stone-500">Revisa el número de tu comprobante o vuelve a escanear su QR.</p></div>}
          {!consulta && !pedido && !error && !buscando && <div className="grid gap-4 sm:grid-cols-3">{[
            { icon: QrCode, titulo: "Tu comprobante a mano", texto: "Ingresa el número de comanda o escanea el QR del comprobante." },
            { icon: RefreshCw, titulo: "Avances registrados", texto: "Revisa las etapas de tus prendas y las fechas disponibles." },
            { icon: PackageCheck, titulo: "Retiro o entrega", texto: "Cuando esté listo, coordina con recepción el siguiente paso." },
          ].map(({ icon: Icon, titulo, texto }) => <div key={titulo} className="glass-card rounded-2xl bg-white/55 p-6 shadow-premium"><span className="mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-600"><Icon className="h-5 w-5" /></span><h2 className="font-display text-base font-extrabold">{titulo}</h2><p className="mt-2 text-sm leading-relaxed text-stone-500">{texto}</p></div>)}</div>}
          {pedido && vista && <motion.div key={pedido.numeroComanda} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <section aria-label={`Seguimiento de ${pedido.numeroComanda}`} className="glass-card min-w-0 space-y-6 rounded-3xl bg-white/75 p-5 shadow-premium backdrop-blur-lg sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand-700">Tu comanda</p><h2 className="font-display text-2xl font-extrabold">{pedido.numeroComanda}</h2><p className="mt-2 text-sm text-stone-500">{vista.servicios}</p></div><span className="rounded-xl bg-brand-50 p-3 text-brand-600"><Package className="h-6 w-6" /></span></div>
              <EstadoPedido estado={pedido.estado} />
              <dl className="grid gap-3 sm:grid-cols-3">{[
                { label: "Ingreso", value: pedido.fechaRecepcion, icon: CalendarDays },
                { label: "Entrega estimada", value: pedido.fechaEntregaEstimada, icon: Clock3 },
                { label: "Entrega registrada", value: pedido.fechaEntregaReal, icon: PackageCheck },
              ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-stone-100 bg-stone-50/70 p-4"><dt className="flex items-center gap-2 text-[11px] text-stone-500"><Icon className="h-4 w-4 text-brand-500" />{label}</dt><dd className="mt-2 text-xs font-bold text-stone-700">{value ? fechaSeguimiento(value) : "Sin registro"}</dd></div>)}</dl>
              <AvancePedido vista={vista} estado={pedido.estado} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-5"><p className="text-[11px] text-stone-500">Último cambio: {fechaSeguimiento(pedido.actualizadoEn)}</p><button disabled={buscando} onClick={() => void actualizar()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-50 px-4 py-2 text-xs font-bold text-brand-700 disabled:opacity-50"><RefreshCw className={buscando ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Actualizar pedido</button></div>
              <p className="text-[11px] text-stone-400">Se actualiza cada 30 segundos mientras esta pantalla está visible.</p>
            </section>
            <aside className="min-w-0 space-y-5"><QrPedido codigoQr={pedido.codigoQr} numeroComanda={pedido.numeroComanda} /><div className="rounded-3xl border border-brand-200/70 bg-gradient-to-br from-brand-50 to-copper-50 p-6"><ShieldCheck className="h-6 w-6 text-brand-600" /><h3 className="mt-4 font-display text-lg font-extrabold">Todo tu historial, en un lugar</h3><p className="mt-2 text-xs leading-relaxed text-stone-600">En tu cuenta puedes revisar pedidos activos, anteriores, prendas y montos. El acceso requiere iniciar sesión.</p><Link href="/cuenta" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Mis pedidos e historial<ArrowRight className="h-4 w-4" /></Link></div></aside>
          </motion.div>}
        </div>
      </div>
    </main>
  </>;
}

export default function SeguimientoPublicoPage() {
  return <Suspense fallback={<p className="flex min-h-screen items-center justify-center gap-2 text-sm text-stone-500"><Loader2 className="h-5 w-5 animate-spin text-brand-600" />Cargando seguimiento…</p>}><SeguimientoContent /></Suspense>;
}
