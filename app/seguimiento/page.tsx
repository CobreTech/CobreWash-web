"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle2, LogIn, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/70 via-[#fdfcfb] to-[#fdfcfb] text-stone-900">
      <header className="sticky top-0 z-20 border-b border-brand-500/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="Logo" width={36} height={36} className="h-9 w-auto" />
            <span className="font-display text-sm font-extrabold">Lavandería <span className="text-brand-500">El Cobre</span></span>
          </Link>
          <div className="flex gap-2">
            <Link href="/" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-stone-500 sm:flex"><ArrowLeft className="h-4 w-4" /> Inicio</Link>
            <Link href="/?login=1" className="bg-gradient-brand flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white"><LogIn className="h-4 w-4" /> Iniciar sesión</Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:py-16">
        <div className="space-y-3 text-center">
          <Package className="mx-auto h-12 w-12 rounded-xl bg-brand-50 p-2 text-brand-600" />
          <h1 className="font-display text-3xl font-extrabold">Seguimiento de pedido</h1>
          <p className="text-sm text-stone-500">Escanea tu QR o ingresa tu número de comanda. No necesitas iniciar sesión.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); void ejecutar({ tipo: "numero", valor: codigo }); }} className="glass-card space-y-3 rounded-2xl bg-white/80 p-5">
          <label htmlFor="numero-comanda" className="block text-xs font-bold text-stone-600">Número de comanda</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="numero-comanda" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: ELCOBRE-14r3 o 14r3" className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm font-bold focus:border-brand-500 focus:outline-none" />
            <button className="bg-gradient-brand flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white"><Search className="h-4 w-4" /> Buscar</button>
          </div>
        </form>
        <div aria-live="polite" aria-busy={buscando} className="space-y-4">
          {buscando && <p role="status" className="text-center text-sm text-stone-500">{pedido ? "Actualizando pedido…" : "Consultando pedido…"}</p>}
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>
            {pedido && <p className="mt-2">Se muestra la última información recibida.</p>}
            {consulta && <button disabled={buscando} onClick={() => void actualizar()} className="mt-3 font-bold underline disabled:opacity-50">Reintentar</button>}
          </div>}
          {consultado && !pedido && !error && !buscando && <p role="status" className="rounded-xl border border-stone-200 bg-white p-5 text-center text-sm text-stone-600">No encontramos un pedido con ese código. Revisa tu comprobante.</p>}
          {pedido && vista && <motion.section key={pedido.numeroComanda} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-6 rounded-2xl bg-white/80 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-4">
              <div><h2 className="font-display text-lg font-extrabold">{pedido.numeroComanda}</h2><p className="mt-1 text-xs text-stone-500">{vista.servicios}</p></div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${pedido.estado === "ANULADA" ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"}`}>{vista.estado}</span>
            </div>
            <dl className="grid gap-3 text-xs sm:grid-cols-2">
              <div><dt className="text-stone-500">Ingreso</dt><dd className="mt-1 font-semibold">{fechaSeguimiento(pedido.fechaRecepcion)}</dd></div>
              {pedido.fechaEntregaEstimada && <div><dt className="text-stone-500">Entrega estimada</dt><dd className="mt-1 font-semibold">{fechaSeguimiento(pedido.fechaEntregaEstimada)}</dd></div>}
              {pedido.fechaEntregaReal && <div><dt className="text-stone-500">Entregado el</dt><dd className="mt-1 font-semibold">{fechaSeguimiento(pedido.fechaEntregaReal)}</dd></div>}
            </dl>
            {vista.etapas.length ? <div>
              <div className="mb-4 flex justify-between text-xs font-bold"><h3>Avance de tus prendas</h3><span>{vista.progreso}%</span></div>
              <ol className="space-y-4">{vista.etapas.map((etapa) => {
                const completada = etapa.estado === "COMPLETADA";
                const activa = etapa.estado === "EN_PROCESO" && !["ANULADA", "ENTREGADA"].includes(pedido.estado);
                const etiqueta = completada ? "Completada" : etapa.estado === "EN_PROCESO"
                  ? (pedido.estado === "ANULADA" ? "Interrumpida" : "En curso")
                  : etapa.estado === "PENDIENTE" ? "Pendiente" : "Estado no disponible";
                return <li key={etapa.orden} className="flex items-start gap-3">
                  {completada ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" /> : <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${activa ? "border-brand-500 bg-brand-100" : "border-stone-300"}`} />}
                  <div className="flex-1"><p className="text-sm font-bold">{etapa.nombre}</p>{etapa.fechaCompletado && <p className="mt-0.5 text-xs text-stone-500">{fechaSeguimiento(etapa.fechaCompletado)}</p>}</div>
                  <span className="text-xs text-stone-500">{etiqueta}</span>
                </li>;
              })}</ol>
            </div> : <p className="text-sm text-stone-500">Este pedido no tiene etapas registradas. Su estado actual es: {vista.estado.toLowerCase()}.</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4">
              <p className="text-xs text-stone-500">Último cambio: {fechaSeguimiento(pedido.actualizadoEn)}</p>
              <button disabled={buscando} onClick={() => void actualizar()} className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 disabled:opacity-50"><RefreshCw className="h-3.5 w-3.5" /> Actualizar</button>
            </div>
          </motion.section>}
        </div>
      </div>
    </main>
  );
}

export default function SeguimientoPublicoPage() {
  return <Suspense fallback={<p className="p-10 text-center">Cargando seguimiento…</p>}><SeguimientoContent /></Suspense>;
}
